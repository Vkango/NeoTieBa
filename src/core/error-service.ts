export type ErrorSource = 'vue' | 'window' | 'unhandledrejection' | 'manual';

export interface ErrorReport {
    time: string;
    appVersion: string;
    commit: string;
    platform: string;
    source: ErrorSource;
    info: string;
    name: string;
    message: string;
    stack: string;
}

type ErrorHandler = (report: ErrorReport) => void | Promise<unknown>;

const DEDUPE_WINDOW_MS = 5000;
const MAX_EVENTS_PER_WINDOW = 20;
const MAX_STACK_LENGTH = 8000;

function describeMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    try {
        return String(error);
    } catch {
        return '[unserializable error]';
    }
}

function describeStack(error: unknown): string {
    if (error instanceof Error && typeof error.stack === 'string') {
        return error.stack.length > MAX_STACK_LENGTH
            ? `${error.stack.slice(0, MAX_STACK_LENGTH)}...`
            : error.stack;
    }
    return '';
}

function describeInfo(info: unknown): string {
    if (info === null || info === undefined) {
        return '';
    }
    try {
        const text = String(info);
        return text.length > 200 ? `${text.slice(0, 200)}...` : text;
    } catch {
        return '';
    }
}

export function buildReport(error: unknown, source: ErrorSource = 'manual', info?: unknown): ErrorReport {
    const message = describeMessage(error);
    return {
        time: new Date().toISOString(),
        appVersion: typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'unknown',
        commit: typeof __BUILD_COMMIT__ === 'string' ? __BUILD_COMMIT__.slice(0, 8) : 'unknown',
        platform: navigator.userAgent,
        source,
        info: describeInfo(info),
        name: error instanceof Error ? error.name : typeof error,
        message: message.length > 500 ? `${message.slice(0, 500)}...` : message,
        stack: describeStack(error),
    };
}

export function formatReport(report: ErrorReport): string {
    const lines = [
        '[NeoTieba 错误报告]',
        `时间: ${report.time}`,
        `版本: ${report.appVersion} (commit ${report.commit})`,
        `平台: ${report.platform}`,
        `来源: ${report.source}${report.info ? ` / ${report.info}` : ''}`,
        `类型: ${report.name}`,
        `消息: ${report.message}`,
    ];
    if (report.stack) {
        lines.push('', '堆栈:', report.stack);
    }
    return lines.join('\n');
}

export function describeReport(report: ErrorReport): string {
    const base = report.name === 'string' || !report.name ? report.message : `${report.name}: ${report.message}`;
    return base.length > 300 ? `${base.slice(0, 300)}...` : base;
}

class ErrorService {
    private handlers: ErrorHandler[] = [];
    private seen = new Map<string, number>();
    private eventCount = 0;
    private windowStart = 0;

    addHandler(handler: ErrorHandler): void {
        this.handlers.push(handler);
    }

    handleError(error: unknown, info?: unknown, source: ErrorSource = 'manual'): void {
        const report = buildReport(error, source, info);

        if (this.shouldSuppress(report)) {
            return;
        }

        void this.dispatch(report);
    }

    private async dispatch(report: ErrorReport): Promise<void> {
        try {
            const { mapStack } = await import('./stack-mapper');
            report.stack = await mapStack(report.stack);
        } catch {
            // keep the raw stack if source-mapping fails
        }
        for (const handler of this.handlers) {
            try {
                const result = handler(report);
                if (result instanceof Promise) {
                    result.catch((e: unknown) => {
                        console.error('Error handler rejected:', e);
                    });
                }
            } catch (e) {
                console.error('Error handler threw:', e);
            }
        }
    }

    private shouldSuppress(report: ErrorReport): boolean {
        const now = Date.now();
        if (now - this.windowStart > DEDUPE_WINDOW_MS) {
            this.windowStart = now;
            this.seen.clear();
            this.eventCount = 0;
        }

        this.eventCount++;
        if (this.eventCount > MAX_EVENTS_PER_WINDOW) {
            return true;
        }

        const key = `${report.source} | ${report.name} | ${report.message} | ${report.info}`;
        const lastSeen = this.seen.get(key);
        if (lastSeen !== undefined && now - lastSeen < DEDUPE_WINDOW_MS) {
            return true;
        }

        this.seen.set(key, now);
        return false;
    }
}

export const errorService = new ErrorService();
