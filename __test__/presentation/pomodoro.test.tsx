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
			const circle = render(<DrainingCircle handlePress={handlePressMock} />);

			fireEvent.click(circle.container.firstChild!);

			expect(handlePressMock).toHaveBeenCalled();
			expect(pomodoroSpy).toHaveBeenCalled();
		});

		it.todo('terminates the pomodoro that pressing the circle for 2 seconds');

		it.todo('resets the timer that double clicking the watch');
	});

	describe('presentation', () => {
		test.todo('The background color changes when the stage changes');

		test.todo(
			'The filled color of the circle represents the progress of the stage'
		);
	});
});
