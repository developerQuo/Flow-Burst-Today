import { MINUTE } from "./times";

export class Pomodoro {
    private cycle: number;
    private focusCalledTimes: number;
    private breakCalledTimes: number;

    private focusSessionDuration = 25 * MINUTE;
    private shortBreakDuration = 5 * MINUTE;
    private longBreakDuration = 20 * MINUTE;

    private timerId: NodeJS.Timeout | undefined;

    constructor(
        cycle: number | undefined = 0,
        focusCalledTimes: number | undefined = 0,
        breakCalledTimes: number | undefined = 0,
    ) {
        this.cycle = cycle;
        this.focusCalledTimes = focusCalledTimes;
        this.breakCalledTimes = breakCalledTimes;
    }

    private clearTimer() {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = undefined;
        }
    }

    private intializeCalledTimesDefaultValues() {
        this.focusCalledTimes = 0;
        this.breakCalledTimes = 0;
    }

    public onTimer() {
        if (this.getUpcomingTask === "focus") {
            this.timerId = this.timerStart(this.focusSessionDuration, () => {
                this.focusCalledTimes++;
                this.onTimer();
            });
        }
        if (this.getUpcomingTask === "shortBreaks") {
            this.timerId = this.timerStart(this.shortBreakDuration, () => {
                this.breakCalledTimes++;
                this.onTimer();
            });
        }
        if (this.getUpcomingTask === "longBreaks") {
            this.timerId = this.timerStart(this.longBreakDuration, () => {
                this.cycle++;
                this.intializeCalledTimesDefaultValues();
                // TODO: save data
            });
        }
    }

    public offTimer() {
        this.resetTimer();
        this.cycle = 0;
        // TODO: save data
    }

    public resetTimer() {
        this.clearTimer();
        this.intializeCalledTimesDefaultValues();
        // TODO: save data
    }

    public timerStart(duration: number, timeoutCallback: Function) {
        return setTimeout(() => {
            timeoutCallback();
        }, duration);
    }

    get getCycle() {
        return this.cycle;
    }

    get getFocusCalledTimes() {
        return this.focusCalledTimes;
    }

    get getBreakCalledTimes() {
        return this.breakCalledTimes;
    }

    get getTimerId() {
        return this.timerId;
    }

    get getUpcomingTask(): "focus" | "shortBreaks" | "longBreaks" {
        if (!((this.focusCalledTimes + this.breakCalledTimes) % 2))
            return "focus";

        if (this.breakCalledTimes < 3) return "shortBreaks";

        return "longBreaks";
    }
}
