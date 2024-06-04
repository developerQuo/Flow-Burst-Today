export function timerStart(duration: number, timeoutCallback: Function) {
	const timerId = setTimeout(() => {
		timeoutCallback();
	}, duration);

	return clearTimeout(timerId);
}
const SECOND = 1 * 1000;
const MINUTE = 60 * SECOND;

export class Pomodoro {
	public cycle: number;
	public focusCalledTimes: number;
	public breakCalledTimes: number;

	private focusSessionTimes = 25 * MINUTE;
	private shortBreakTimes = 5 * MINUTE;
	private longBreakTimes = 20 * MINUTE;

	private currentState: 'focusSession' | 'shortBreak' | 'longBreak' =
		'focusSession';

	constructor() {
		this.cycle = 0;
		this.focusCalledTimes = 0;
		this.breakCalledTimes = 0;
	}

	public start() {
		console.log(this.focusCalledTimes, this.breakCalledTimes);
		if (this.currentState === 'focusSession') {
			// ring & vibrate device
			let remainingTimes = this.focusSessionTimes;
			timerStart(this.focusSessionTimes, () => {
				remainingTimes--;
				if (remainingTimes == 0) {
					this.focusCalledTimes++;
					this.currentState =
						this.breakCalledTimes === 3 ? 'longBreak' : 'shortBreak';
					this.start();
				}
			});
		} else if (this.currentState === 'shortBreak') {
			let remainingTimes = this.shortBreakTimes;
			timerStart(this.shortBreakTimes, () => {
				remainingTimes--;
				if (remainingTimes == 0) {
					this.breakCalledTimes++;
					this.currentState = 'focusSession';
					this.start();
				}
			});
		} else {
			let remainingTimes = this.longBreakTimes;
			timerStart(this.longBreakTimes, () => {
				remainingTimes--;
				if (remainingTimes == 0) {
					this.cycle++;
					this.focusCalledTimes = 0;
					this.breakCalledTimes = 0;
					this.currentState = 'focusSession';
				}
			});
		}
	}
}
