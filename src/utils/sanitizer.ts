import DOMPurify from 'dompurify';

export function sanitize(content: string): string {
    if (!content) return '';
    return DOMPurify.sanitize(content, {
        ADD_TAGS: ['img', 'a', 'span', 'div', 'br', 'p', 'b', 'i', 'strong', 'em', 'font', 'video'],
        ADD_ATTR: ['src', 'href', 'style', 'class', 'target', 'color', 'size', 'width', 'height', 'controls', 'poster', 'referrerpolicy',
            'loading',
            'decoding'
        ],
    });
}
