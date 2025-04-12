class ErrorService {
    constructor() {
        this.handlers = [];
    }

    addHandler(handler) {
        this.handlers.push(handler);
    }

    handleError(error, info) {
        this.handlers.forEach(handler => handler(error, info));
    }
}

export const errorService = new ErrorService();