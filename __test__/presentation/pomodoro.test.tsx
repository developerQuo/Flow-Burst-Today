import DrainingCircle from '@/components/pomodoro/circle';
import { Pomodoro } from '@/utils/timer';
import { describe, expect, it, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';

describe('pomodoro ui', () => {
	let pomodoro: Pomodoro;

	beforeEach(() => {
		pomodoro = new Pomodoro();
	});

	describe('function', () => {
		it('starts the pomodoro that pressing the circle', () => {
			const pomodoroSpy = jest.spyOn(pomodoro, 'onTimer');
			const handlePressMock = jest.fn().mockImplementation(() => {
				pomodoro.onTimer();
			});
			const circle = render(
				<DrainingCircle
					handlePress={handlePressMock}
					handleLongPress={jest.fn()}
					handleReleasePress={jest.fn()}
				/>
			);

			fireEvent.click(circle.container.firstChild!);

			expect(handlePressMock).toHaveBeenCalled();
			expect(pomodoroSpy).toHaveBeenCalled();
		});

		describe('terminates the pomodoro that pressing the circle for 2 seconds', () => {
			test('web', () => {
				jest.useFakeTimers();
				const pomodoroSpy = jest.spyOn(pomodoro, 'offTimer');
				let longPressTimer: NodeJS.Timeout | undefined = undefined;
				const handleLongPressMock = jest.fn().mockImplementation(() => {
					longPressTimer = setTimeout(() => {
						pomodoro.offTimer();
					}, 2000);
				});
				const { getByTestId } = render(
					<DrainingCircle
						handlePress={jest.fn()}
						handleLongPress={handleLongPressMock}
						handleReleasePress={() => {
							if (longPressTimer) {
								clearTimeout(longPressTimer);
							}
						}}
					/>
				);

				fireEvent.mouseDown(getByTestId('draining-circle'));

				expect(longPressTimer).not.toBeUndefined();

				jest.runAllTimers();

				expect(handleLongPressMock).toHaveBeenCalled();
				expect(pomodoroSpy).toHaveBeenCalled();
			});

			test('web', () => {
				jest.useFakeTimers();
				const pomodoroSpy = jest.spyOn(pomodoro, 'offTimer');
				let longPressTimer: NodeJS.Timeout | undefined = undefined;
				const handleLongPressMock = jest.fn().mockImplementation(() => {
					longPressTimer = setTimeout(() => {
						pomodoro.offTimer();
					}, 2000);
				});
				const { getByTestId } = render(
					<DrainingCircle
						handlePress={jest.fn()}
						handleLongPress={handleLongPressMock}
						handleReleasePress={() => {
							if (longPressTimer) {
								clearTimeout(longPressTimer);
							}
						}}
					/>
				);

				fireEvent.mouseDown(getByTestId('draining-circle'));
				jest.advanceTimersByTime(1000);

				expect(longPressTimer).not.toBeUndefined();

				fireEvent.mouseUp(getByTestId('draining-circle'));
				expect(pomodoroSpy).not.toHaveBeenCalled();
			});

			test.todo('mobile');
		});

		it.todo('resets the timer that double clicking the watch');
	});

	describe('presentation', () => {
		test.todo('The background color changes when the stage changes');

		test.todo(
			'The filled color of the circle represents the progress of the stage'
		);
	});
});
