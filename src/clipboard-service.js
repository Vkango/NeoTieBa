class ClipboardService {
    constructor() {
        this.handlers = [];
    }

    addHandler(handler) {
        this.handlers.push(handler);
    }

    handle(url) {
        this.handlers.forEach(handler => handler(url));
    }
}

export const clipboardService = new ClipboardService();