export type Listener = () => void;

export interface ObserverInterface {
    listeners: Set<Listener>;
    subscribe(listener: Listener): void;
    unsubscribe(listener: Listener): void;
    notifyListeners(): void;
}

export class Observer implements ObserverInterface {
    listeners: Set<Listener>;

    constructor() {
        this.listeners = new Set();
    }

    subscribe(listener: Listener): void {
        this.listeners.add(listener);
    }

    unsubscribe(listener: Listener): void {
        this.listeners.delete(listener);
    }

    notifyListeners(): void {
        this.listeners.forEach((listener) => listener());
    }
}
