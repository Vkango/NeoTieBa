export function getTimeInterval(previousTimestamp) {
    const currentTimestamp = Date.now(); // 获取当前时间戳（单位为毫秒）
    // 计算两个时间戳之间的差值（单位为秒）
    const diffInSeconds = (currentTimestamp - previousTimestamp) / 1000;
    if (diffInSeconds < 60) {
        // 不足1分钟
        return "刚刚";
    } else if (diffInSeconds < 60 * 60) {
        // 不足1小时
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}分钟前`;
    } else if (diffInSeconds < 60 * 60 * 24) {
        // 不足1天
        const hours = Math.floor(diffInSeconds / (60 * 60));
        return `${hours}小时前`;
    } else if (diffInSeconds < 60 * 60 * 24 * 7) {
        // 不足1周
        const days = Math.floor(diffInSeconds / (60 * 60 * 24));
        return `${days}天前`;
    } else if (diffInSeconds < 60 * 60 * 24 * 30) {
        // 不足1月（这里假设1月为30天）
        const weeks = Math.floor(diffInSeconds / (60 * 60 * 24 * 7));
        return `${weeks}周前`;
    } else if (diffInSeconds < 60 * 60 * 24 * 365) {
        // 不足1年（这里假设1年为365天）
        const months = Math.floor(diffInSeconds / (60 * 60 * 24 * 30));
        return `${months}个月前`;
    } else {
        // 超过1年
        const years = Math.floor(diffInSeconds / (60 * 60 * 24 * 365));
        return `${years}年前`;
    }
}

export function processContentElements(elements, dismissMedia = false) {
    let content = ``;
    elements.forEach((ele, index) => {
        // content += `<span>${index}${JSON.stringify(ele)}</span>`;
        switch (ele.type) {
            case 0: // text
                if (index == 0 && ele.text == `\n`) {
                    break;
                }
                if (index != 0) {
                    if (elements[index - 1].type == 3) {
                        content += `<br>`
                    }
                }
                content += ele.text;
                break;
            case 1: // link
                content += `<a href="${decodeURIComponent(
                    ele.link
                        .replace('https://tieba.baidu.com/mo/q/checkurl?url=', '')
                        .replace('http://tieba.baidu.com/mo/q/checkurl?url=', '')
                ).split('&urlrefer=')[0]}" target="_blank" rel="noopener noreferrer">${ele.text}</a>`;
                break;
            case 2: // emoticon
                content += `<img class="emoticon" src="${('/assets/emoticons/' + ele.text + '.png')}" alt="${ele.c}" />`;
                break;
            case 3: // image
                if (!dismissMedia) {
                    content += (index != 0 ? `<br>` : ``) + `<img class="thread-reply-img" style="  max-height: 450px; max-width: 300px; border-radius: 5px;" src="${ele.bigCdnSrc || ele.originSrc || ele.big_cdn_src || ele.origin_src}" referrerpolicy="no-referrer">`;
                }
                break;
            case 4: // at
                content += `<button class="at-button" uid="${ele.uid}">${ele.text}</button>`;
                break;
            case 5: // video
                if (!dismissMedia) {
                    content += ((index != 0 && elements[index - 1].type != 0 && elements[index - 1]?.text !== '\n') ? `<br>` : ``) + `<video class="thread-reply-img" style="max-height: 450px; max-width: 300px; border-radius: 5px;" src="${ele.link}" referrerpolicy="no-referrer" controls></video>`;
                }
                break;
            case 18: // tag
                content += `${ele.text}`;
                break;
            case 40: // search_words
                content += `${ele.text}`;
                break;
            default:
                content += `<div style='color: red'>Failed to parse: ` + JSON.stringify(ele) + `</div>`;
                break;
        }
    });
    return content;
}