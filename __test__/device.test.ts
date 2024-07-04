import { Pomodoro } from "@/lib/pomodoro";
import { MINUTE } from "@/utils/times";

jest.useFakeTimers();

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

    it.only("wakes lock the display of device", async () => {
        const requestSpyOn = jest.spyOn(navigator.wakeLock, "request");
        const releaseSpyOn = jest.fn();

        requestSpyOn.mockResolvedValue({
            release: releaseSpyOn,
        } as unknown as WakeLockSentinel);

        // 타이머가 시작하면, wakeLock이 걸린다.
        let pomodoro = new Pomodoro();
        await pomodoro.lockScreen();
        pomodoro.onTimer(jest.fn);

        jest.advanceTimersByTime(1 * MINUTE);
        expect(requestSpyOn).toHaveBeenCalled();
        expect(pomodoro.getWakeLockSentinel).not.toBeNull();

        // 타이머가 완료되면 wakeLock이 풀린다.
        jest.runAllTimers();
        await pomodoro.unLockScreen();

        expect(releaseSpyOn).toHaveBeenCalled();
    });
});

describe("when pomodoro alternately start the phases", () => {
    it("vibrates the device", () => {
        Object.defineProperty(navigator, "vibrate", {
            value: jest.fn(),
            writable: true,
        });

        let pomodoro = new Pomodoro();

        pomodoro.onTimer(jest.fn);

        jest.advanceTimersByTime(26 * MINUTE);

        expect(navigator.vibrate).toHaveBeenCalledWith(200);
    });

    it("ringings with sound effect", () => {
        let playMock = jest.fn();

        Audio = jest.fn().mockImplementation(() => {
            return { play: playMock };
        });

        let pomodoro = new Pomodoro();

        pomodoro.onTimer(jest.fn);

        jest.advanceTimersByTime(25 * MINUTE);

        expect(Audio).toHaveBeenCalledWith("sounds/bell.mp3");
        expect(playMock).toHaveBeenCalled();
    });
});
