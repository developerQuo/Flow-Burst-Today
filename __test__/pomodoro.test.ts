import { describe, expect, it, test } from '@jest/globals';
import { Pomodoro, timerStart } from '@/utils/timer';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('pomodoro function', () => {
	describe('timer', () => {
		it('starts the timer for custom time', () => {
			const minute = 60 * 1000;
			timerStart(25 * minute, jest.fn());

			expect(setTimeout).toHaveBeenCalledTimes(1);
			expect(setTimeout).toHaveBeenLastCalledWith(
				expect.any(Function),
				25 * minute
			);

			expect(setTimeout).not.toHaveBeenCalledTimes(2);
			expect(setTimeout).not.toHaveBeenLastCalledWith(
				expect.any(Function),
				5 * minute
			);
		});

		test('Focus sessions and breaks alternate continuosly', () => {
			const pomodoro = new Pomodoro();

			pomodoro.start();

			expect(pomodoro.state).toBe('shortBreak');

			pomodoro.start();

			expect(pomodoro.state).toBe('focusSession');

			pomodoro.start();

			expect(pomodoro.state).toBe('shortBreak');
		});

		test('Pomodoro has 4 focus sessions each of 25 minute, 4 breaks each of several minutes', () => {});

		test.todo(
			'The breaks consist of 3 short breaks each of 5 minute and a last break of 20 min'
		);

		it('presents the progress of timer', () => {});

		describe('resets times', () => {
			test.todo('ongoing');

			test.todo('cycle');
		});
	});

	describe('start signal', () => {
		it.todo('starts the timer with vibration in mobile');

		it.todo('starts the timer with sound effect');
	});

	describe('staistic', () => {
		it.todo('records number of forced shutdowns');

		it.todo('records duration of pomodoro');

		it.todo('records the progress of cycle');
	});
});
