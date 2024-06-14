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

        it("resets the timer that double clicking the watch", () => {});
    });

    describe("presentation", () => {
        test.todo("The background color changes when the stage changes");

        test.todo(
            "The filled color of the circle represents the progress of the stage",
        );

        test("The timer shows the remaining time", () => {
            const { getByTestId, getByText } = render(
                <Hourglass pomodoro={pomodoro} />,
            );

            act(() => {
                fireEvent.click(getByTestId("hourglass"));
                jest.advanceTimersByTime(1 * SECOND);
            });

            expect(getByText("24:59")).toBeInTheDocument();

            act(() => {
                jest.advanceTimersByTime(5 * MINUTE);
            });

            expect(getByText("19:59")).toBeInTheDocument();

            act(() => {
                jest.advanceTimersByTime(22 * MINUTE);
            });

            expect(getByText("02:59")).toBeInTheDocument();

            act(() => {
                jest.advanceTimersByTime(52 * SECOND);
            });

            expect(getByText("02:07")).toBeInTheDocument();
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

        it("shows initial timer when pomodoro terminates", () => {});

        it.todo("shows the progress of a cycle");
    });
});
