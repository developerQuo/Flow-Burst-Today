import { Observer } from "@/utils/observer";
import { MINUTE, SECOND } from "@/utils/times";

export type ActionSchedule = "focus" | "shortBreaks" | "longBreaks";

export class Pomodoro extends Observer {
    private cycle: number;
    private focusCalledTimes: number;
    private breakCalledTimes: number;

    static focusSessionDuration = 25 * MINUTE;
    static shortBreakDuration = 5 * MINUTE;
    static longBreakDuration = 20 * MINUTE;

    private timerId: NodeJS.Timeout | undefined;
    private remainingTime: number;

    private actionScheduleObserver: Observer;

    constructor(
        cycle: number | undefined = 0,
        focusCalledTimes: number | undefined = 0,
        breakCalledTimes: number | undefined = 0,
    ) {
        super();

        this.cycle = cycle;
        this.focusCalledTimes = focusCalledTimes;
        this.breakCalledTimes = breakCalledTimes;

        this.remainingTime = Pomodoro.focusSessionDuration;
        this.actionScheduleObserver = new Observer();
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

    public onTimer(completeCallback: Function) {
        if (this.timerId) return; // prevent duplicate

        if (this.getActionSchedule === "focus") {
            this.timerStart(Pomodoro.focusSessionDuration, () => {
                this.focusCalledTimes++;
                this.actionScheduleObserver.notifyListeners();
                this.timerId = undefined;
                this.onTimer(completeCallback);
            });
        }
        if (this.getActionSchedule === "shortBreaks") {
            this.timerStart(Pomodoro.shortBreakDuration, () => {
                this.breakCalledTimes++;
                this.actionScheduleObserver.notifyListeners();
                this.timerId = undefined;
                this.onTimer(completeCallback);
            });
        }
        if (this.getActionSchedule === "longBreaks") {
            this.timerStart(Pomodoro.longBreakDuration, () => {
                this.cycle++;
                this.timerId = undefined;
                this.intializeCalledTimesDefaultValues();
                this.actionScheduleObserver.notifyListeners();

                // TODO: save data

                completeCallback?.();
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

    get getActionScheduleObserver(): Observer {
        return this.actionScheduleObserver;
    }

    get getActionSchedule(): ActionSchedule {
        if (!((this.focusCalledTimes + this.breakCalledTimes) % 2))
            return "focus";

        if (this.breakCalledTimes < 3) return "shortBreaks";

        return "longBreaks";
    }

    get getActionScheduleText(): string {
        return this.getActionSchedule === "focus"
            ? `${this.focusCalledTimes + 1} 뽀모도로`
            : this.getActionSchedule === "shortBreaks"
              ? `${this.breakCalledTimes + 1} 짧은 휴식`
              : `긴 휴식`;
    }
}
