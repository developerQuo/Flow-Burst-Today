export default function mockAPIs() {
    // Mock HTMLMediaElement.prototype.play
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
        configurable: true,
        value: jest.fn().mockResolvedValue(undefined),
    });

    // Mock navigator.wakeLock
    Object.defineProperty(navigator, "wakeLock", {
        writable: true,
        value: {
            request: jest.fn().mockResolvedValue({
                release: jest.fn(),
            }),
        },
    });
}
