export const FLOOR_INDEX_SIZE = 10;

export function floorWindowStart(length: number, index: number, edge?: 'start' | 'end'): number {
    const offset = edge === 'start' ? FLOOR_INDEX_SIZE - 1 : edge === 'end' ? 0 : 4;
    return Math.max(0, Math.min(Math.max(0, length - FLOOR_INDEX_SIZE), index - offset));
}

export function findReadingFloor(length: number, bottomAt: (index: number) => number, anchor: number): number {
    if (!length) return -1;
    let left = 0;
    let right = length - 1;
    while (left < right) {
        const middle = Math.floor((left + right) / 2);
        if (bottomAt(middle) <= anchor) left = middle + 1;
        else right = middle;
    }
    return left;
}

export function floorPreview(content: unknown, fallback = ''): string {
    if (!Array.isArray(content) || !content.length) return fallback;
    return content.map(part => {
        if (!part || typeof part !== 'object') return '';
        if (Number(part.type) === 3) return '[图片]';
        if (Number(part.type) === 5) return '[视频]';
        if (Number(part.type) === 2) return part.c || '[表情]';
        return typeof part.text === 'string' ? part.text : '';
    }).join('').replace(/\s+/g, ' ').trim() || '[该楼层暂无文字]';
}
