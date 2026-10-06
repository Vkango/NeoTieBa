import { SourceMapConsumer } from 'source-map-js';

type RawSourceMap = ConstructorParameters<typeof SourceMapConsumer>[0];

type FrameStyle = 'v8-paren' | 'v8-plain' | 'webkit';

interface StackFrame {
    style: FrameStyle;
    indent: string;
    fn: string;
    url: string;
    line: number;
    column: number;
}

const V8_FRAME_RE = /^(\s*)at\s+(?:(.*)\s+\()?(.+?):(\d+):(\d+)\)?\s*$/;
const WEBKIT_FRAME_RE = /^(\s*)(?:(.*)@)(.+?):(\d+):(\d+)\s*$/;
const URL_PROTOCOL_RE = /^(?:https?|tauri|file):\/\//i;
const consumerCache = new Map<string, SourceMapConsumer | null>();

function parseFrame(line: string): StackFrame | null {
    let frame: StackFrame | null = null;
    let match = V8_FRAME_RE.exec(line);
    if (match) {
        frame = {
            style: match[2] !== undefined ? 'v8-paren' : 'v8-plain',
            indent: match[1],
            fn: match[2] ?? '',
            url: match[3],
            line: Number(match[4]),
            column: Number(match[5]),
        };
    } else {
        match = WEBKIT_FRAME_RE.exec(line);
        if (match) {
            frame = {
                style: 'webkit',
                indent: match[1],
                fn: match[2] ?? '',
                url: match[3],
                line: Number(match[4]),
                column: Number(match[5]),
            };
        }
    }
    if (!frame || !URL_PROTOCOL_RE.test(frame.url)) return null;
    return frame;
}

function isJsUrl(url: string): boolean {
    return /\.js(?:\?|$)/i.test(url);
}

async function consumerFor(url: string): Promise<SourceMapConsumer | null> {
    const cached = consumerCache.get(url);
    if (cached !== undefined) return cached;
    let consumer: SourceMapConsumer | null = null;
    try {
        const mapUrl = `${url.split('?')[0]}.map`;
        const res = await fetch(mapUrl);
        if (res.ok) {
            const raw = (await res.json()) as RawSourceMap;
            consumer = new SourceMapConsumer(raw);
        }
    } catch {
        consumer = null;
    }
    consumerCache.set(url, consumer);
    return consumer;
}

function formatMapped(frame: StackFrame, source: string, line: number | null, column: number | null): string {
    const path = source.replace(/^https?:\/\/[^/]+\//i, '').replace(/^(?:\.\.\/|\.\/)+/, '');
    const mappedLine = line ?? 0;
    const mappedColumn = (column ?? 0) + 1;
    switch (frame.style) {
        case 'v8-paren':
            return `${frame.indent}at ${frame.fn} (${path}:${mappedLine}:${mappedColumn})`;
        case 'webkit':
            return `${frame.indent}${frame.fn}@${path}:${mappedLine}:${mappedColumn}`;
        default:
            return `${frame.indent}at ${path}:${mappedLine}:${mappedColumn}`;
    }
}

export async function mapStack(stack: string): Promise<string> {
    if (!stack) return stack;
    const lines = stack.split('\n');
    const mapped = await Promise.all(lines.map(async (line): Promise<string> => {
        const frame = parseFrame(line);
        if (!frame || !isJsUrl(frame.url)) return line;
        const consumer = await consumerFor(frame.url);
        if (!consumer) return line;
        try {
            const original = consumer.originalPositionFor({
                line: frame.line,
                column: frame.column - 1,
                bias: SourceMapConsumer.LEAST_UPPER_BOUND,
            });
            if (!original || !original.source || original.line === null) return line;
            return formatMapped(frame, original.source, original.line, original.column);
        } catch {
            return line;
        }
    }));
    return mapped.join('\n');
}
