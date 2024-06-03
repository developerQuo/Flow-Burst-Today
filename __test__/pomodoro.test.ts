import { timerStart } from '@/utils/timer';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('pomodoro function', () => {
	describe('timer', () => {
		describe('starts the timer for custom time', () => {
			test('25 minute', () => {
				timerStart(25);

				expect(setTimeout).toHaveBeenCalledTimes(1);
				expect(setTimeout).toHaveBeenLastCalledWith(
					expect.any(Function),
					25 * 60 * 1000
				);
			});

			test('5 minute', () => {
				timerStart(5);

				expect(setTimeout).toHaveBeenCalledTimes(1);
				expect(setTimeout).toHaveBeenLastCalledWith(
					expect.any(Function),
					5 * 60 * 1000
				);
			});
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
