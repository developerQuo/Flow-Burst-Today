import { Observer } from "@/utils/observer";
import { MINUTE, SECOND } from "@/utils/times";

export class Pomodoro extends Observer {
    private cycle: number;
    private focusCalledTimes: number;
    private breakCalledTimes: number;

    private focusSessionDuration = 25 * MINUTE;
    private shortBreakDuration = 5 * MINUTE;
    private longBreakDuration = 20 * MINUTE;

    private timerId: NodeJS.Timeout | undefined;
    private remainingTime: number;

    constructor(
        cycle: number | undefined = 0,
        focusCalledTimes: number | undefined = 0,
        breakCalledTimes: number | undefined = 0,
    ) {
        super();

        this.cycle = cycle;
        this.focusCalledTimes = focusCalledTimes;
        this.breakCalledTimes = breakCalledTimes;

        this.remainingTime = this.focusSessionDuration;
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
        if (this.getActionSchedule === "focus") {
            this.timerStart(this.focusSessionDuration, () => {
                this.focusCalledTimes++;
                this.timerId = undefined;
                this.onTimer();
            });
        }
        if (this.getActionSchedule === "shortBreaks") {
            this.timerStart(this.shortBreakDuration, () => {
                this.breakCalledTimes++;
                this.timerId = undefined;
                this.onTimer();
            });
        }
        if (this.getActionSchedule === "longBreaks") {
            this.timerStart(this.longBreakDuration, () => {
                this.cycle++;
                this.timerId = undefined;
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
        this.remainingTime = duration;

        const timer = () => {
            this.timerId = setTimeout(() => {
                this.remainingTime -= 1 * SECOND;
                this.notifyListeners();

                if (this.remainingTime > 0) {
                    timer();
                } else {
                    timeoutCallback();
                }
            }, 1 * SECOND);
        };

        timer();
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

    get getRemainingTime() {
        return this.remainingTime;
    }

    get getActionSchedule(): "focus" | "shortBreaks" | "longBreaks" {
        if (!((this.focusCalledTimes + this.breakCalledTimes) % 2))
            return "focus";

        if (this.breakCalledTimes < 3) return "shortBreaks";

        return "longBreaks";
    }
}
