import Hourglass from "@/components/pomodoro/hourglass";
import { Pomodoro } from "@/lib/pomodoro";
import { MINUTE, SECOND } from "@/utils/times";
import { describe, it, test } from "@jest/globals";
import { act, fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.useFakeTimers();

describe("pomodoro ui", () => {
    let pomodoro: Pomodoro;

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
    });

    beforeEach(() => {
        pomodoro = new Pomodoro();
    });

    test("클릭하면 시작", () => {
        const onTimerSpy = jest.spyOn(pomodoro, "onTimer");

        const { getByTestId } = render(<Hourglass pomodoro={pomodoro} />);

        fireEvent.click(getByTestId("hourglass"));

        expect(onTimerSpy).toHaveBeenCalled();
    });

    describe("2초간 누르면 종료", () => {
        test("web", () => {
            const onTimerSpy = jest.spyOn(pomodoro, "onTimer");
            const offTimerSpy = jest.spyOn(pomodoro, "offTimer");

            const { getByTestId } = render(<Hourglass pomodoro={pomodoro} />);

            fireEvent.click(getByTestId("hourglass"));

            expect(onTimerSpy).toHaveBeenCalled();

            fireEvent.mouseDown(getByTestId("hourglass"));

            act(() => {
                jest.advanceTimersByTime(2000);
            });

            fireEvent.mouseUp(getByTestId("hourglass"));

            expect(offTimerSpy).toHaveBeenCalled();
            expect(pomodoro.getTimerId).toBeUndefined();
            expect(pomodoro.getRemainingTime).toBe(25 * MINUTE);
        });

        test("mobile", () => {
            const onTimerSpy = jest.spyOn(pomodoro, "onTimer");
            const offTimerSpy = jest.spyOn(pomodoro, "offTimer");

            const { getByTestId } = render(<Hourglass pomodoro={pomodoro} />);

            fireEvent.click(getByTestId("hourglass"));

            expect(onTimerSpy).toHaveBeenCalled();

            fireEvent.touchStart(getByTestId("hourglass"));
            act(() => {
                jest.advanceTimersByTime(2000);
            });
            fireEvent.touchEnd(getByTestId("hourglass"));

            expect(offTimerSpy).toHaveBeenCalled();
            expect(pomodoro.getTimerId).toBeUndefined();
            expect(pomodoro.getRemainingTime).toBe(25 * MINUTE);
        });
    });

    test("The background color changes when the stage changes", () => {
        const { getByTestId } = render(<Hourglass pomodoro={pomodoro} />);
        const bgBottomClass = getByTestId("hourglass-bg-bottom").classList;

        fireEvent.click(getByTestId("hourglass"));

        expect(bgBottomClass).toContain("from-focus");

        act(() => {
            jest.advanceTimersByTime(25 * MINUTE);
        });

        expect(bgBottomClass).toContain("from-short-breaks");

        act(() => {
            jest.advanceTimersByTime(25 * MINUTE * 3 + 5 * MINUTE * 3);
        });

        expect(bgBottomClass).toContain("from-long-breaks");
    });

    describe("The gradation represents the progress of the stage", () => {
        test("focus", () => {
            const { getByTestId } = render(<Hourglass pomodoro={pomodoro} />);
            const bgBottomElement = getByTestId("hourglass-bg-bottom");

            // Initial state check
            expect(bgBottomElement).toHaveStyle({ height: "100%" });

            fireEvent.click(getByTestId("hourglass"));

            act(() => {
                jest.advanceTimersByTime(12.5 * MINUTE);
            });

            expect(bgBottomElement).toHaveStyle({ height: "50%" });

            act(() => {
                jest.advanceTimersByTime(12.4 * MINUTE);
            });

            expect(bgBottomElement).toHaveStyle({ height: "0.4%" });
        });

        test("short breaks", () => {
            const { getByTestId } = render(<Hourglass pomodoro={pomodoro} />);
            const bgBottomElement = getByTestId("hourglass-bg-bottom");

            fireEvent.click(getByTestId("hourglass"));

            act(() => {
                jest.advanceTimersByTime(25 * MINUTE);
            });

            // Initial state check
            expect(bgBottomElement).toHaveStyle({ height: "100%" });

            act(() => {
                jest.advanceTimersByTime(2.5 * MINUTE);
            });

            expect(bgBottomElement).toHaveStyle({ height: "50%" });

            act(() => {
                jest.advanceTimersByTime(2.4 * MINUTE);
            });

            expect(bgBottomElement).toHaveStyle({ height: "2%" });
        });

        test("long breaks", () => {
            const { getByTestId } = render(<Hourglass pomodoro={pomodoro} />);
            const bgBottomElement = getByTestId("hourglass-bg-bottom");

            fireEvent.click(getByTestId("hourglass"));

            act(() => {
                jest.advanceTimersByTime(25 * 4 * MINUTE + 5 * 3 * MINUTE);
            });

            // Initial state check
            expect(bgBottomElement).toHaveStyle({ height: "100%" });

            act(() => {
                jest.advanceTimersByTime(10 * MINUTE);
            });

            expect(bgBottomElement).toHaveStyle({ height: "50%" });

            act(() => {
                jest.advanceTimersByTime(9.9 * MINUTE);
            });

            expect(bgBottomElement).toHaveStyle({ height: "0.5%" });
        });
    });

    test("The timer shows the remaining time", () => {
        const { getByTestId, getByText } = render(
            <Hourglass pomodoro={pomodoro} />,
        );

        fireEvent.click(getByTestId("hourglass"));

        act(() => {
            jest.advanceTimersByTime(1 * SECOND);
        });

        expect(getByText("24 : 59")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(27 * MINUTE);
        });

        expect(getByText("02 : 59")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(52 * SECOND);
        });

        expect(getByText("02 : 07")).toBeInTheDocument();
    });

    it("shows complete message when pomodoro completes", () => {
        const { getByTestId, getByText } = render(
            <Hourglass pomodoro={pomodoro} />,
        );

        fireEvent.click(getByTestId("hourglass"));

        act(() => {
            jest.runAllTimers();
        });

        expect(getByText("1 뽀모도로 달성!")).toBeInTheDocument();
    });

    it("shows the progress of a cycle", async () => {
        const { getByTestId, findByText } = render(
            <Hourglass pomodoro={pomodoro} />,
        );

        fireEvent.click(getByTestId("hourglass"));

        expect(await findByText("1 뽀모도로")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(25 * MINUTE);
        });

        expect(await findByText("1 짧은 휴식")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(25 * MINUTE * 3 + 5 * MINUTE * 3);
        });

        expect(await findByText("긴 휴식")).toBeInTheDocument();
    });
});
