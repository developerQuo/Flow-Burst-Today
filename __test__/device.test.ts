import { Pomodoro } from "@/lib/pomodoro";

describe("mobile", () => {
    beforeAll(() => {
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

        jest.useFakeTimers();
    });

    it.todo("works on mobile environment");

    it.todo("works on offline environment");

    it("wakes lock the display of device", async () => {
        const wakeLockRequestSpyOn = jest.spyOn(navigator.wakeLock, "request");
        const wakeLockReleaseSpyOn = jest.fn();

        wakeLockRequestSpyOn.mockResolvedValue({
            release: wakeLockReleaseSpyOn,
        } as unknown as WakeLockSentinel);

        // 타이머가 시작하면, wakeLock이 걸린다.
        let pomodoro = new Pomodoro();
        pomodoro.onTimer(jest.fn);

        expect(wakeLockRequestSpyOn).toHaveBeenCalled();

        // 타이머가 완료되면 wakeLock이 풀린다.
        jest.runAllTimers();
        setTimeout(() => {
            expect(wakeLockReleaseSpyOn).toHaveBeenCalled();
        }, 0);
    });
});

describe("when pomodoro alternately start the phases", () => {
    it.todo("vibrates the device ");

    it.todo("ringings with sound effect");
});
