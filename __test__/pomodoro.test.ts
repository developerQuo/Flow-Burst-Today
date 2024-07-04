import { describe, expect, it, test } from "@jest/globals";
import { Pomodoro } from "@/lib/pomodoro";
import { MINUTE, SECOND } from "@/utils/times";
import mockAPIs from "./api-mocks";

jest.useFakeTimers();

describe("pomodoro timer", () => {
    let pomodoro: Pomodoro;

    beforeAll(() => {
        mockAPIs();
    });

    beforeEach(() => {
        pomodoro = new Pomodoro();
    });

    it("starts the timer for custom time", () => {
        const timeoutCallback = jest.fn();
        pomodoro.startTimer(25 * MINUTE, timeoutCallback);

        expect(timeoutCallback).not.toHaveBeenCalledTimes(2);
        expect(pomodoro.getRemainingTime).toBe(25 * MINUTE);

        jest.runAllTimers();

        expect(timeoutCallback).toHaveBeenCalledTimes(1);
        expect(pomodoro.getRemainingTime).not.toBe(25 * MINUTE);
    });

    test("중복 실행 방지", () => {
        pomodoro.onTimer(jest.fn);
        pomodoro.onTimer(jest.fn);

        jest.advanceTimersByTime(2 * SECOND);

        expect(pomodoro.getRemainingTime).toBe(24 * MINUTE + 58 * SECOND);
    });

    test("타이머 초기화", () => {
        expect(pomodoro.getCycle).toBe(0);
        expect(pomodoro.getFocusCalledTimes).toBe(0);
        expect(pomodoro.getBreakCalledTimes).toBe(0);

        pomodoro.onTimer(jest.fn);
        jest.runAllTimers();

        pomodoro.onTimer(jest.fn);
        jest.advanceTimersByTime(35 * MINUTE);

        expect(pomodoro.getCycle).toBe(1);
        expect(pomodoro.getFocusCalledTimes).toBe(1);
        expect(pomodoro.getBreakCalledTimes).toBe(1);
        expect(pomodoro.getTimerId).not.toBeUndefined();

        pomodoro.offTimer();

        expect(pomodoro.getCycle).toBe(1);
        expect(pomodoro.getFocusCalledTimes).toBe(0);
        expect(pomodoro.getBreakCalledTimes).toBe(0);
        expect(pomodoro.getTimerId).toBeUndefined();
    });

    test("Pomodoro has a cycle that alternates continuosly 4 focus sessions and 4 breaks", () => {
        expect(pomodoro.getCycle).toBe(0);

        pomodoro.onTimer(jest.fn);

        // 1st focus session
        jest.advanceTimersByTime(24 * MINUTE);

        expect(pomodoro.getFocusCalledTimes).toBe(0);
        expect(pomodoro.getBreakCalledTimes).toBe(0);
        expect(pomodoro.getRemainingTime).toBe(1 * MINUTE);

        // 1st break
        jest.advanceTimersByTime(5 * MINUTE);

        expect(pomodoro.getFocusCalledTimes).toBe(1);
        expect(pomodoro.getBreakCalledTimes).toBe(0);
        expect(pomodoro.getRemainingTime).toBe(1 * MINUTE);

        // end cycle
        jest.runAllTimers();
        expect(pomodoro.getRemainingTime).toBe(25 * MINUTE);
        expect(pomodoro.getFocusCalledTimes).toBe(0);
        expect(pomodoro.getBreakCalledTimes).toBe(0);
        expect(pomodoro.getCycle).toBe(1);
    });
});

describe("pomodoro staistic", () => {
    it.todo("records number of termination");

    it.todo("records number of reset");

    test.todo(
        "When finishing, it records the count of cycles in a day starting from 4 AM.",
    );

    test.todo("When finishing, it records the feedback of the cycle.");
});
