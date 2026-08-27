type ErrorHandler = (error: unknown, info: string) => void | Promise<unknown>;

const DEDUPE_WINDOW_MS = 5000;
const MAX_EVENTS_PER_WINDOW = 20;

function describeError(error: unknown): string {
    let base: string;
    if (error instanceof Error) {
        base = `${error.name}: ${error.message}`;
    } else {
        try {
            base = String(error);
        } catch {
            base = '[unserializable error]';
        }
    }
    if (base.length > 500) {
        base = `${base.slice(0, 500)}...`;
    }
    return base;
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

class ErrorService {
    private handlers: ErrorHandler[] = [];
    private seen = new Map<string, number>();
    private eventCount = 0;
    private windowStart = 0;

    addHandler(handler: ErrorHandler): void {
        this.handlers.push(handler);
    }

    handleError(error: unknown, info: unknown): void {
        const errorText = describeError(error);
        const infoText = describeInfo(info);

        if (this.shouldSuppress(errorText, infoText)) {
            return;
        }

        for (const handler of this.handlers) {
            try {
                const result = handler(error, infoText);
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

    private shouldSuppress(errorText: string, infoText: string): boolean {
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

        const key = `${errorText} | ${infoText}`;
        const lastSeen = this.seen.get(key);
        if (lastSeen !== undefined && now - lastSeen < DEDUPE_WINDOW_MS) {
            return true;
        }

        this.seen.set(key, now);
        return false;
    }
}

export const errorService = new ErrorService();
