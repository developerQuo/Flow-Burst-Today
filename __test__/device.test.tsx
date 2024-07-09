import Hourglass from "@/components/pomodoro/hourglass";
import { Pomodoro } from "@/lib/pomodoro";
import { MINUTE, SECOND } from "@/utils/times";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import mockAPIs from "./api-mocks";
import { TimerContext } from "@/store/timer";

jest.useFakeTimers();

describe("mobile", () => {
    beforeAll(() => {
        mockAPIs();
    });

    describe("wakes lock the display of device", () => {
        let requestSpyOn: jest.SpyInstance;
        let releaseSpyOn: jest.Mock;
        let pomodoro: Pomodoro;

        beforeEach(() => {
            requestSpyOn = jest.spyOn(navigator.wakeLock, "request");
            releaseSpyOn = jest.fn();

            requestSpyOn.mockResolvedValue({
                release: releaseSpyOn,
            } as unknown as WakeLockSentinel);

            pomodoro = new Pomodoro();
        });

        it("정상 종료", async () => {
            const { getByTestId } = render(
                <TimerContext.Provider value={{ pomodoro }}>
                    <Hourglass />
                </TimerContext.Provider>,
            );

            fireEvent.click(getByTestId("hourglass"));

            act(() => {
                jest.advanceTimersByTime(1 * MINUTE);
            });

            expect(requestSpyOn).toHaveBeenCalled();
            await waitFor(() => {
                expect(pomodoro.wakeLockSentinel).not.toBeNull();
            });

            act(() => {
                jest.runAllTimers();
            });

            expect(releaseSpyOn).toHaveBeenCalled();
            await waitFor(() => {
                expect(pomodoro.wakeLockSentinel).toBeNull();
            });
        });

        it("강제 종료 - pc", async () => {
            const { getByTestId } = render(
                <TimerContext.Provider value={{ pomodoro }}>
                    <Hourglass />
                </TimerContext.Provider>,
            );

            fireEvent.click(getByTestId("hourglass"));

            act(() => {
                jest.advanceTimersByTime(1 * MINUTE);
            });

            await waitFor(() => {
                expect(pomodoro.wakeLockSentinel).not.toBeNull();
            });

            fireEvent.mouseDown(getByTestId("hourglass"));
            act(() => {
                jest.advanceTimersByTime(2 * SECOND);
            });
            fireEvent.mouseUp(getByTestId("hourglass"));

            expect(releaseSpyOn).toHaveBeenCalled();
            await waitFor(() => {
                expect(pomodoro.wakeLockSentinel).toBeNull();
            });
        });

        it("강제 종료 - mobile", async () => {
            const { getByTestId } = render(
                <TimerContext.Provider value={{ pomodoro }}>
                    <Hourglass />
                </TimerContext.Provider>,
            );

            fireEvent.click(getByTestId("hourglass"));

            act(() => {
                jest.advanceTimersByTime(1 * MINUTE);
            });

            await waitFor(() => {
                expect(pomodoro.wakeLockSentinel).not.toBeNull();
            });

            fireEvent.touchStart(getByTestId("hourglass"));
            act(() => {
                jest.advanceTimersByTime(2 * SECOND);
            });
            fireEvent.touchEnd(getByTestId("hourglass"));

            expect(releaseSpyOn).toHaveBeenCalled();
            await waitFor(() => {
                expect(pomodoro.wakeLockSentinel).toBeNull();
            });
        });
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
