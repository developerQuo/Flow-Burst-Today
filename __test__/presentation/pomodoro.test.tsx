import Pomodoro from '@/app/pomodoro/page';
import DrainingCircle from '@/components/pomodoro/circle';
import { describe, expect, it, test } from '@jest/globals';
import { findByTestId, fireEvent, render } from '@testing-library/react';

describe('pomodoro ui', () => {
	describe('function', () => {
		it('starts the pomodoro that pressing the circle', () => {
			const handlePressSpy = jest
				.spyOn(DrainingCircle.prototype, 'handlePress')
				.mockImplementation(jest.fn());
			const circle = render(<DrainingCircle />);

			fireEvent.click(circle.container);

			expect(handlePressSpy).toHaveBeenCalled();
			// TODO: 이벤트 핸들러 호출만 확인하는 걸로 충분한지 고민
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
