import Hourglass from "@/components/pomodoro/hourglass";
import { Pomodoro } from "@/lib/pomodoro";
import { MINUTE, SECOND } from "@/utils/times";
import { describe, it, test } from "@jest/globals";
import { act, fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

jest.useFakeTimers();

// TODO: 같은 동작 두 번 할 때, 두 번 실행되고 있는거 막기
// TODO: useSyncExternalStore, Observeer pattern 이해하기
// TODO: 완료 표시
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

            test("web (release)", () => {
                const onTimerSpy = jest.spyOn(pomodoro, "onTimer");
                const { getByTestId } = render(
                    <Hourglass pomodoro={pomodoro} />,
                );

                fireEvent.click(getByTestId("hourglass"));
                jest.advanceTimersByTime(1000);
                expect(onTimerSpy).toHaveBeenCalled();

                userEvent.pointer({
                    keys: "[MouseLeft]",
                    target: getByTestId("hourglass"),
                });

                jest.advanceTimersByTime(2000);

                userEvent.pointer({
                    keys: "[MouseLeft]",
                    target: getByTestId("hourglass"),
                });

                expect(pomodoro.getTimerId).toBeUndefined();
            });

            test("web (release before 1 seconds)", () => {
                const { getByTestId } = render(
                    <Hourglass pomodoro={pomodoro} />,
                );

                fireEvent.mouseDown(getByTestId("hourglass"));

                jest.advanceTimersByTime(1000);

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
    });
});
