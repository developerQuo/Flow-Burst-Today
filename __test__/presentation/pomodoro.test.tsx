import { describe, expect, it, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';

describe('pomodoro ui', () => {
	describe('function', () => {
		it.todo('starts the pomodoro that pressing the circle');

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
