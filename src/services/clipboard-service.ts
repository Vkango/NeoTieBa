type ClipboardHandler = (url: string) => void;

class ClipboardService {
    private handlers: ClipboardHandler[] = [];

    addHandler(handler: ClipboardHandler): void {
        this.handlers.push(handler);
    }

    handle(url: string): void {
        this.handlers.forEach(handler => handler(url));
    }
}

export const clipboardService = new ClipboardService();
