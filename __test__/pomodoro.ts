describe('pomodoro function', () => {
	describe('timer', () => {
		it('starts the timer for custom time');

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
