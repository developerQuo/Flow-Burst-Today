import Hourglass from "@/components/pomodoro/hourglass";
import { Pomodoro } from "@/lib/pomodoro";
import { MINUTE, SECOND } from "@/utils/times";
import { describe, it, test } from "@jest/globals";
import { act, fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.useFakeTimers();

// TODO: useSyncExternalStore, Observeer pattern 이해하기
describe("pomodoro ui", () => {
    let pomodoro: Pomodoro;

    beforeEach(() => {
        pomodoro = new Pomodoro();
    });

    describe("function", () => {
        it("starts the pomodoro that pressing the circle", () => {
            const onTimerSpy = jest.spyOn(pomodoro, "onTimer");

            const { getByTestId } = render(<Hourglass pomodoro={pomodoro} />);

            fireEvent.click(getByTestId("hourglass"));

            expect(onTimerSpy).toHaveBeenCalled();
        });

        describe("terminates the pomodoro that pressing the circle for 2 seconds", () => {
            let offTimerSpy: jest.SpyInstance;

            beforeEach(() => {
                offTimerSpy = jest.spyOn(pomodoro, "offTimer");
            });

            describe("web", () => {
                test("long press during 2 seconds", () => {
                    const onTimerSpy = jest.spyOn(pomodoro, "onTimer");
                    const { getByTestId } = render(
                        <Hourglass pomodoro={pomodoro} />,
                    );

                    act(() => {
                        fireEvent.click(getByTestId("hourglass"));

                        jest.advanceTimersByTime(1000);
                    });

                    expect(onTimerSpy).toHaveBeenCalled();

                    fireEvent.mouseDown(getByTestId("hourglass"));

                    act(() => {
                        jest.advanceTimersByTime(2000);
                    });

                    fireEvent.mouseUp(getByTestId("hourglass"));
                    fireEvent.click(getByTestId("hourglass"));

                    expect(pomodoro.getTimerId).toBeUndefined();
                });

                test("release before 2 seconds", () => {
                    const { getByTestId } = render(
                        <Hourglass pomodoro={pomodoro} />,
                    );

                    fireEvent.mouseDown(getByTestId("hourglass"));

                    jest.advanceTimersByTime(1000);

                    expect(offTimerSpy).not.toHaveBeenCalled();
                });
            });

            test.todo("mobile");
        });

        it.todo("resets the timer that double clicking the watch");
    });

    describe("presentation", () => {
        test("The background color changes when the stage changes", () => {
            const { getByTestId } = render(<Hourglass pomodoro={pomodoro} />);

            act(() => {
                fireEvent.click(getByTestId("hourglass"));
            });

            expect(getByTestId("hourglass-bg-color").classList).toContain(
                "from-focus",
            );

            act(() => {
                jest.advanceTimersByTime(25 * MINUTE);
            });

            expect(getByTestId("hourglass-bg-color").classList).toContain(
                "from-shortBreaks",
            );

            act(() => {
                jest.advanceTimersByTime(25 * MINUTE * 3 + 5 * MINUTE * 3);
            });

            expect(getByTestId("hourglass-bg-color").classList).toContain(
                "from-longBreaks",
            );
        });

        test("[focus] The filled color of the circle represents the progress of the stage", () => {
            const { getByTestId } = render(<Hourglass pomodoro={pomodoro} />);

            // Initial state check
            expect(getByTestId("hourglass-bg-color")).toHaveStyle({
                height: "100%",
            });
            expect(getByTestId("hourglass-bg-color")).toHaveClass("from-focus");

            act(() => {
                fireEvent.click(getByTestId("hourglass"));
                jest.advanceTimersByTime(12.5 * MINUTE);
            });

            expect(getByTestId("hourglass-bg-color")).toHaveStyle({
                height: "50%",
            });

            act(() => {
                jest.advanceTimersByTime(12.4 * MINUTE);
            });

            expect(getByTestId("hourglass-bg-color")).toHaveStyle({
                height: "0.4%",
            });
        });

        test("[short breaks] The filled color of the circle represents the progress of the stage", () => {
            const { getByTestId } = render(<Hourglass pomodoro={pomodoro} />);

            act(() => {
                fireEvent.click(getByTestId("hourglass"));
                jest.advanceTimersByTime(25 * MINUTE);
            });

            // Initial state check
            expect(getByTestId("hourglass-bg-color")).toHaveStyle({
                height: "100%",
            });
            expect(getByTestId("hourglass-bg-color")).toHaveClass(
                "from-shortBreaks",
            );

            act(() => {
                jest.advanceTimersByTime(2.5 * MINUTE);
            });

            expect(getByTestId("hourglass-bg-color")).toHaveStyle({
                height: "50%",
            });

            act(() => {
                jest.advanceTimersByTime(2.4 * MINUTE);
            });

            expect(getByTestId("hourglass-bg-color")).toHaveStyle({
                height: "2%",
            });
        });

        test("[long breaks] The filled color of the circle represents the progress of the stage", () => {
            const { getByTestId } = render(<Hourglass pomodoro={pomodoro} />);

            act(() => {
                fireEvent.click(getByTestId("hourglass"));
                jest.advanceTimersByTime(25 * 4 * MINUTE + 5 * 3 * MINUTE);
            });

            // Initial state check
            expect(getByTestId("hourglass-bg-color")).toHaveStyle({
                height: "100%",
            });
            expect(getByTestId("hourglass-bg-color")).toHaveClass(
                "from-longBreaks",
            );

            act(() => {
                jest.advanceTimersByTime(10 * MINUTE);
            });

            expect(getByTestId("hourglass-bg-color")).toHaveStyle({
                height: "50%",
            });

            act(() => {
                jest.advanceTimersByTime(9.9 * MINUTE);
            });

            expect(getByTestId("hourglass-bg-color")).toHaveStyle({
                height: "0.5%",
            });
        });

        test("The timer shows the remaining time", () => {
            const { getByTestId, getByText } = render(
                <Hourglass pomodoro={pomodoro} />,
            );

            act(() => {
                fireEvent.click(getByTestId("hourglass"));
                jest.advanceTimersByTime(1 * SECOND);
            });

            expect(getByText("24 : 59")).toBeInTheDocument();

            act(() => {
                jest.advanceTimersByTime(5 * MINUTE);
            });

            expect(getByText("19 : 59")).toBeInTheDocument();

            act(() => {
                jest.advanceTimersByTime(22 * MINUTE);
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

            expect(getByText("complete")).toHaveProperty("hidden", true);

            fireEvent.click(getByTestId("hourglass"));

            act(() => {
                jest.runAllTimers();
            });

            expect(getByText("complete")).toHaveProperty("hidden", false);
        });

        it.todo("shows initial timer when pomodoro terminates");

        it("shows the progress of a cycle", async () => {
            const { getByTestId, findByText } = render(
                <Hourglass pomodoro={pomodoro} />,
            );

            act(() => {
                fireEvent.click(getByTestId("hourglass"));
            });

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
});
