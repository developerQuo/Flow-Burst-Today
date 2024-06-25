import { Pomodoro } from "@/lib/pomodoro";
import { MINUTE } from "@/utils/times";

describe("mobile", () => {
    it.todo("works on mobile environment");

    it.todo("works on offline environment");

    it("wakes lock the display of device", async () => {
        jest.useFakeTimers();
        const mockRelease = jest.fn();
        const mockRequest = jest
            .fn()
            .mockResolvedValue({ release: mockRelease });

        Object.defineProperty(navigator, "wakeLock", {
            writable: true,
            value: {
                request: mockRequest,
            },
        });

        // 타이머가 시작하면, wakeLock이 걸린다.
        let pomodoro = new Pomodoro();
        pomodoro.onTimer(jest.fn);

        jest.advanceTimersByTime(1 * MINUTE);
        expect(mockRequest).toHaveBeenCalled();

        // 타이머가 완료되면 wakeLock이 풀린다.

        jest.runAllTimers();
        expect(mockRelease).toHaveBeenCalled();
    });
});

describe("when pomodoro alternately start the phases", () => {
    it.todo("vibrates the device ");

    it.todo("ringings with sound effect");
});
