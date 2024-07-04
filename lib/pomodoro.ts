import { Observer } from "@/lib/observer";
import { MINUTE, SECOND } from "@/utils/times";
import wakeLock, { WakeLockSentinelType } from "./wakeLock";

export type ActionSchedule = "focus" | "shortBreaks" | "longBreaks";

export class Pomodoro {
    private cycle: number;
    private focusCalledTimes: number;
    private breakCalledTimes: number;

    static focusSessionDuration = 25 * MINUTE;
    static shortBreakDuration = 5 * MINUTE;
    static longBreakDuration = 20 * MINUTE;

    private timerId: NodeJS.Timeout | undefined;
    private remainingTime: number;

    private remainingTimeObserver: Observer;
    private actionScheduleObserver: Observer;

    constructor(
        cycle: number | undefined = 0,
        focusCalledTimes: number | undefined = 0,
        breakCalledTimes: number | undefined = 0,
    ) {
        this.cycle = cycle;
        this.focusCalledTimes = focusCalledTimes;
        this.breakCalledTimes = breakCalledTimes;

        this.remainingTime = Pomodoro.focusSessionDuration;
        this.remainingTimeObserver = new Observer();
        this.actionScheduleObserver = new Observer();
    }

    private clearTimer() {
        this.remainingTime = Pomodoro.focusSessionDuration;
        this.remainingTimeObserver.notifyListeners();

        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = undefined;
        }
    }

    private intializeCalledTimesDefaultValues() {
        this.focusCalledTimes = 0;
        this.breakCalledTimes = 0;
    }

    private alertCompletion() {
        const audio = new Audio("sounds/bell.mp3");
        audio.play();

        if ("vibrate" in navigator) {
            navigator.vibrate(200);
        }
    }

    private wakeLockSentinel: WakeLockSentinelType = null;

    public async lockScreen() {
        if (this.wakeLockSentinel == null) {
            this.wakeLockSentinel = await wakeLock();
        }
    }

    public async unLockScreen() {
        if (this.wakeLockSentinel != null) {
            await this.wakeLockSentinel.release();
            this.wakeLockSentinel = null;
        }
    }

    public onTimer(completeCallback: Function) {
        if (this.timerId) return; // prevent duplicate

        const nextTimer = () => {
            if (this.getActionSchedule === "focus") {
                this.timerStart(Pomodoro.focusSessionDuration, () => {
                    this.focusCalledTimes++;
                    this.actionScheduleObserver.notifyListeners();
                    this.timerId = undefined;
                    this.alertCompletion();
                    nextTimer();
                });
            }
            if (this.getActionSchedule === "shortBreaks") {
                this.timerStart(Pomodoro.shortBreakDuration, () => {
                    this.breakCalledTimes++;
                    this.actionScheduleObserver.notifyListeners();
                    this.timerId = undefined;
                    this.alertCompletion();
                    nextTimer();
                });
            }
            if (this.getActionSchedule === "longBreaks") {
                this.timerStart(Pomodoro.longBreakDuration, () => {
                    this.cycle++;
                    this.offTimer();
                    this.actionScheduleObserver.notifyListeners();

                    this.alertCompletion();
                    completeCallback?.();
                });
            }
        };

        nextTimer();
    }

    public offTimer() {
        this.unLockScreen();

        this.resetTimer();
    }

    public resetTimer() {
        this.clearTimer();
        this.intializeCalledTimesDefaultValues();
    }

    public timerStart(duration: number, timeoutCallback: Function) {
        this.remainingTime = duration;

        const timer = () => {
            this.timerId = setTimeout(() => {
                this.remainingTime -= 1 * SECOND;
                this.remainingTimeObserver.notifyListeners();

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

    get getRemainingTimeObserver(): Observer {
        return this.remainingTimeObserver;
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

    get getWakeLockSentinel() {
        return this.wakeLockSentinel;
    }
}
