import DOMPurify from 'dompurify';

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u0080-\u009F]/g;

export function sanitize(content: string): string {
    if (!content) return '';
    try {
        const cleaned = content.replace(CONTROL_CHARS, '');
        return DOMPurify.sanitize(cleaned, {
            ADD_TAGS: ['img', 'a', 'span', 'div', 'br', 'p', 'b', 'i', 'strong', 'em', 'font', 'video'],
            ADD_ATTR: ['src', 'href', 'style', 'class', 'target', 'color', 'size', 'width', 'height', 'controls', 'poster', 'referrerpolicy',
                'loading',
                'decoding'
            ],
        });
    } catch (error) {
        console.error('Sanitize failed, falling back to plain text:', error);
        return content
            .replace(CONTROL_CHARS, '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}
