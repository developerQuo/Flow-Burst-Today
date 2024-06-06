import { describe, expect, it, test } from '@jest/globals';
import { Pomodoro } from '@/utils/timer';
import { MINUTE } from '@/utils/times';

describe('pomodoro function', () => {
	let pomodoro: Pomodoro;

	beforeEach(() => {
		jest.useFakeTimers();
		jest.spyOn(global, 'setTimeout');

		pomodoro = new Pomodoro();
	});

	describe('start, terminate, reset', () => {
		it('starts the timer for custom time', () => {
			pomodoro.timerStart(25 * MINUTE, jest.fn());

			expect(setTimeout).toHaveBeenCalledTimes(1);
			expect(setTimeout).toHaveBeenLastCalledWith(
				expect.any(Function),
				25 * MINUTE
			);

			expect(setTimeout).not.toHaveBeenCalledTimes(2);
			expect(setTimeout).not.toHaveBeenLastCalledWith(
				expect.any(Function),
				5 * MINUTE
			);
		});

		it('terminates the timer', () => {
			expect(pomodoro.getCycle).toBe(0);
			expect(pomodoro.getFocusCalledTimes).toBe(0);
			expect(pomodoro.getBreakCalledTimes).toBe(0);

			pomodoro.onTimer();

			jest.advanceTimersByTime(35 * MINUTE);

			expect(pomodoro.getCycle).toBe(0);
			expect(pomodoro.getFocusCalledTimes).toBe(1);
			expect(pomodoro.getBreakCalledTimes).toBe(1);

			pomodoro.offTimer();

			expect(pomodoro.getCycle).toBe(0);
			expect(pomodoro.getFocusCalledTimes).toBe(0);
			expect(pomodoro.getBreakCalledTimes).toBe(0);
		});

		it('resets the timer (40 MINUTE)', () => {
			pomodoro.onTimer();

			jest.advanceTimersByTime(40 * MINUTE);

			expect(pomodoro.getFocusCalledTimes).toBe(1);
			expect(pomodoro.getBreakCalledTimes).toBe(1);
			expect(pomodoro.getTimerId).not.toBeUndefined();

			pomodoro.resetTimer();

			expect(pomodoro.getFocusCalledTimes).toBe(0);
			expect(pomodoro.getBreakCalledTimes).toBe(0);
			expect(pomodoro.getTimerId).toBeUndefined();
		});

		test('reset function keeps count of cycle', () => {
			pomodoro.onTimer();

			jest.runAllTimers();

			expect(pomodoro.getCycle).toBe(1);
			expect(pomodoro.getTimerId).not.toBeUndefined();

			pomodoro.onTimer();

			jest.advanceTimersByTime(58 * MINUTE);

			expect(pomodoro.getFocusCalledTimes).toBe(2);
			expect(pomodoro.getBreakCalledTimes).toBe(1);
			expect(pomodoro.getTimerId).not.toBeUndefined();

			pomodoro.resetTimer();

			expect(pomodoro.getCycle).toBe(1);
			expect(pomodoro.getFocusCalledTimes).toBe(0);
			expect(pomodoro.getBreakCalledTimes).toBe(0);
			expect(pomodoro.getTimerId).toBeUndefined();
		});
	});

	test('Pomodoro has a cycle that alternates continuosly 4 focus sessions and 4 breaks', () => {
		const pomodoro = new Pomodoro();

		expect(pomodoro.getCycle).toBe(0);

		pomodoro.onTimer();

		// 1st focus session
		jest.advanceTimersByTime(24 * MINUTE);

		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 25 * MINUTE);

		// 1st break
		jest.advanceTimersByTime(5 * MINUTE);

		expect(setTimeout).toHaveBeenCalledTimes(2);
		expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5 * MINUTE);

		// last break
		jest.runAllTimers();
		expect(setTimeout).toHaveBeenCalledTimes(8);
		expect(setTimeout).toHaveBeenLastCalledWith(
			expect.any(Function),
			20 * MINUTE
		);

		expect(pomodoro.getCycle).toBe(1);
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
