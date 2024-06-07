import { Pomodoro } from '@/utils/timer';
import { useRef } from 'react';

type InputProps = {
	pomodoro: Pomodoro;
};

export default function DrainingCircle({ pomodoro }: InputProps) {
	const longPressTimer = useRef<NodeJS.Timeout | undefined>(undefined);

	const handlePress = () => {
		pomodoro.onTimer();
	};

	const handleLongPress = () => {
		longPressTimer.current = setTimeout(() => {
			pomodoro.offTimer();
		}, 2000);
	};

	const handleReleasePress = () => {
		if (longPressTimer?.current) {
			clearTimeout(longPressTimer.current);
		}
	};

	return (
		<div
			data-testid="draining-circle"
			className="w-40 h-40 rounded-full"
			onClick={handlePress}
			onMouseDown={handleLongPress}
			onMouseUp={handleReleasePress}
		></div>
	);
}
