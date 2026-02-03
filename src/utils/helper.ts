import type { ContentElement } from '@/types';
import { sanitize } from './sanitizer';

export function getTimeInterval(previousTimestamp: number): string {
    const currentTimestamp = Date.now();
    const diffInSeconds = (currentTimestamp - previousTimestamp) / 1000;

    if (diffInSeconds < 60) {
        return "刚刚";
    } else if (diffInSeconds < 60 * 60) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}分钟前`;
    } else if (diffInSeconds < 60 * 60 * 24) {
        const hours = Math.floor(diffInSeconds / (60 * 60));
        return `${hours}小时前`;
    } else if (diffInSeconds < 60 * 60 * 24 * 7) {
        const days = Math.floor(diffInSeconds / (60 * 60 * 24));
        return `${days}天前`;
    } else if (diffInSeconds < 60 * 60 * 24 * 30) {
        const weeks = Math.floor(diffInSeconds / (60 * 60 * 24 * 7));
        return `${weeks}周前`;
    } else if (diffInSeconds < 60 * 60 * 24 * 365) {
        const months = Math.floor(diffInSeconds / (60 * 60 * 24 * 30));
        return `${months}个月前`;
    } else {
        const years = Math.floor(diffInSeconds / (60 * 60 * 24 * 365));
        return `${years}年前`;
    }
}

export function processContentElements(elements: ContentElement[], dismissMedia = false): string {
    let content = '';
    elements.forEach((ele, index) => {
        switch (ele.type) {
            case 0: // text
                if (index === 0 && ele.text === '\n') {
                    break;
                }
                if (index !== 0 && elements[index - 1]?.type === 3) {
                    content += '<br>';
                }
                content += ele.text || '';
                break;
            case 1: // link
                const decodedLink = decodeURIComponent(
                    (ele.link || '')
                        .replace('https://tieba.baidu.com/mo/q/checkurl?url=', '')
                        .replace('http://tieba.baidu.com/mo/q/checkurl?url=', '')
                ).split('&urlrefer=')[0];
                content += `<a href="${decodedLink}" target="_blank" rel="noopener noreferrer">${ele.text}</a>`;
                break;
            case 2: // emoticon
                content += `<img class="emoticon" src="${'/assets/emoticons/' + ele.text + '.png'}" alt="${ele.c}" />`;
                break;
            case 3: // image
                if (!dismissMedia) {
                    // console.log(ele);
                    const imgSrc = ele.bigCdnSrc || ele.originSrc || ele.big_cdn_src || ele.origin_src;
                    content += (index !== 0 ? '<br>' : '') +
                        `<img class="thread-reply-img" style="max-height: 450px; max-width: 300px; border-radius: 5px;" src="${imgSrc}" referrerpolicy="no-referrer">`;
                }
                break;
            case 4: // at
                content += `<button class="at-button" uid="${ele.uid}">${ele.text}</button>`;
                break;
            case 5: // video
                if (!dismissMedia) {
                    const prefix = (index !== 0 && elements[index - 1]?.type !== 0 && elements[index - 1]?.text !== '\n') ? '<br>' : '';
                    content += prefix +
                        `<video class="thread-reply-img" style="max-height: 450px; max-width: 300px; border-radius: 5px;" src="${ele.link}" referrerpolicy="no-referrer" controls></video>`;
                }
                break;
            case 18: // tag
            case 40: // search_words
                content += ele.text || '';
                break;
            default:
                content += `<div style='color: red'>Failed to parse: ${JSON.stringify(ele)}</div>`;
                break;
        }
    });
    return sanitize(content);
}

export function formatNumber(num: number): string {
    if (num >= 100000000) {
        return (num / 100000000).toFixed(1) + '亿';
    } else if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
}
