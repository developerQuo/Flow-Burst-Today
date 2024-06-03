import { timerStart } from '@/utils/timer';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('pomodoro function', () => {
	describe('timer', () => {
		it('starts the timer for custom time', () => {
			const minute = 60 * 1000;
			timerStart(25, jest.fn());

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

		it('has the cycle of 4 focus, 5 min rest and last rest');

		it('presents the progress of timer');

		describe('resets times', () => {
			test('ongoing');

			test('cycle');
		});
	});

	describe('start signal', () => {
		it('starts the timer with vibration in mobile');

		it('starts the timer with sound effect');
	});

	describe('staistic', () => {
		it('records number of forced shutdowns');

		it('records duration of pomodoro');

		it('records the progress of cycle');
	});
});
