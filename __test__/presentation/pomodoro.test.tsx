import Hourglass from "@/components/pomodoro/hourglass";
import { Pomodoro } from "@/utils/timer";
import { MINUTE } from "@/utils/times";
import { describe, it, test } from "@jest/globals";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.useFakeTimers();

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

            test("web (click)", () => {
                const { getByTestId } = render(
                    <Hourglass pomodoro={pomodoro} />,
                );

                fireEvent.mouseDown(getByTestId("hourglass"));

                expect(offTimerSpy).not.toHaveBeenCalled();

                jest.runAllTimers();

                expect(offTimerSpy).toHaveBeenCalled();
            });

            test("web (release click)", () => {
                const { getByTestId } = render(
                    <Hourglass pomodoro={pomodoro} />,
                );

                fireEvent.mouseDown(getByTestId("hourglass"));

                jest.advanceTimersByTime(1000);

                expect(offTimerSpy).not.toHaveBeenCalled();

                fireEvent.mouseUp(getByTestId("hourglass"));

                expect(offTimerSpy).not.toHaveBeenCalled();
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
            const { getByText } = render(<Hourglass pomodoro={pomodoro} />);

            // start the timer
            pomodoro.onTimer();

            // 5 min later
            jest.advanceTimersByTime(5 * MINUTE);

            // expect to find 20:00 text in the component
            expect(getByText("20:00")).toBeInTheDocument();

            // 22 min later
            jest.advanceTimersByTime(22 * MINUTE);

            // expect to find 3:00 text in the component
            expect(getByText("3:00")).toBeInTheDocument();
        });
    });
});
