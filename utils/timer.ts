export function timerStart(duration: number, timeoutCallback: Function) {
	const timerId = setTimeout(() => {
		timeoutCallback();
	}, duration);

	return clearTimeout(timerId);
}
