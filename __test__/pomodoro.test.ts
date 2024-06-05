import { describe, expect, it, test } from '@jest/globals';
import { Pomodoro, timerStart } from '@/utils/timer';

const minute = 60 * 1000;

describe('pomodoro function', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.spyOn(global, 'setTimeout');
	});

	describe('timer', () => {
		it('starts the timer for custom time', () => {
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

		test('The breaks consist of 3 short breaks each of 5 minute and a last break of 20 min', () => {
			const pomodoro = new Pomodoro();

			expect(pomodoro.cycle).toBe(0);

			pomodoro.startBreaks();
			pomodoro.startBreaks();
			pomodoro.startBreaks();

			jest.runAllTimers();

			expect(pomodoro.breakCalledTimes).toBe(3);
			expect(setTimeout).toHaveBeenCalledTimes(3);
			expect(setTimeout).toHaveBeenLastCalledWith(
				expect.any(Function),
				5 * minute
			);

			pomodoro.startBreaks();
			jest.runAllTimers();

			expect(setTimeout).toHaveBeenLastCalledWith(
				expect.any(Function),
				20 * minute
			);
			expect(pomodoro.cycle).toBe(1);
			expect(pomodoro.breakCalledTimes).toBe(0);
		});

		test('Pomodoro has 4 focus sessions each of 25 minute, 4 breaks each of several minutes', () => {});

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
