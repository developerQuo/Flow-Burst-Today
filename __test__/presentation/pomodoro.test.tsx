import DrainingCircle from '@/components/pomodoro/circle';
import { Pomodoro } from '@/utils/timer';
import { describe, expect, it, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';

jest.useFakeTimers();

describe('pomodoro ui', () => {
	let pomodoro: Pomodoro;

	beforeEach(() => {
		pomodoro = new Pomodoro();
	});

	describe('function', () => {
		it('starts the pomodoro that pressing the circle', () => {
			const onTimerSpy = jest.spyOn(pomodoro, 'onTimer');

			const { getByTestId } = render(<DrainingCircle pomodoro={pomodoro} />);

			fireEvent.click(getByTestId('draining-circle'));

			expect(onTimerSpy).toHaveBeenCalled();
		});

		describe('terminates the pomodoro that pressing the circle for 2 seconds', () => {
			let offTimerSpy: jest.SpyInstance;

			beforeEach(() => {
				offTimerSpy = jest.spyOn(pomodoro, 'offTimer');
			});

			test('web (click)', () => {
				const { getByTestId } = render(<DrainingCircle pomodoro={pomodoro} />);

				fireEvent.mouseDown(getByTestId('draining-circle'));

				expect(offTimerSpy).not.toHaveBeenCalled();

				jest.runAllTimers();

				expect(offTimerSpy).toHaveBeenCalled();
			});

			test('web (release click)', () => {
				const { getByTestId } = render(<DrainingCircle pomodoro={pomodoro} />);

				fireEvent.mouseDown(getByTestId('draining-circle'));

				jest.advanceTimersByTime(1000);

				expect(offTimerSpy).not.toHaveBeenCalled();

				fireEvent.mouseUp(getByTestId('draining-circle'));

				expect(offTimerSpy).not.toHaveBeenCalled();
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
