type ErrorHandler = (error: unknown, info: string) => void;

class ErrorService {
    private handlers: ErrorHandler[] = [];

    addHandler(handler: ErrorHandler): void {
        this.handlers.push(handler);
    }

    handleError(error: unknown, info: string): void {
        this.handlers.forEach(handler => handler(error, info));
    }
}

export const errorService = new ErrorService();
