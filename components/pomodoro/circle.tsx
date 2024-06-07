type InputProps = {
	handlePress: () => void;
	handleLongPress: () => void;
	handleReleasePress: () => void; // 누르다가 손 떼는 경우. timer 제거.
};

export default function DrainingCircle({
	handlePress,
	handleLongPress,
	handleReleasePress,
}: InputProps) {
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
