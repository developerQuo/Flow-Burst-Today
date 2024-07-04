import { Observer } from "@/lib/observer";
import { MINUTE, SECOND } from "@/utils/times";
import wakeLock, { WakeLockSentinelType } from "./wakeLock";

export type ActionSchedule = "focus" | "shortBreaks" | "longBreaks";

export class Pomodoro {
    static DEFAULT_FOCUS_SESSION_DURATION = 25 * MINUTE;
    static DEFAULT_SHORT_BREAK_DURATION = 5 * MINUTE;
    static DEFAULT_LONG_BREAK_DURATION = 20 * MINUTE;

    // cycle
    private cycle: number = 0;
    private focusCalledTimes: number = 0;
    private breakCalledTimes: number = 0;

    // time
    private timerId: NodeJS.Timeout | undefined;
    private remainingTime: number;

    // observer
    private remainingTimeObserver: Observer;
    private actionScheduleObserver: Observer;

    private wakeLockSentinel: WakeLockSentinelType = null;

    constructor() {
        this.remainingTime = Pomodoro.DEFAULT_FOCUS_SESSION_DURATION;
        this.remainingTimeObserver = new Observer();
        this.actionScheduleObserver = new Observer();
    }

    public onTimer(completeCallback: () => void) {
        if (this.timerId) return; // prevent duplicate

        // TODO: 클로저로 리팩토링
        const nextActionTimer = () => {
            if (this.getActionSchedule === "focus") {
                this.startTimer(Pomodoro.DEFAULT_FOCUS_SESSION_DURATION, () => {
                    this.focusCalledTimes++;
                    this.actionScheduleObserver.notifyListeners();
                    this.timerId = undefined;
                    this.alertCompletion();
                    nextActionTimer();
                });
            }
            if (this.getActionSchedule === "shortBreaks") {
                this.startTimer(Pomodoro.DEFAULT_SHORT_BREAK_DURATION, () => {
                    this.breakCalledTimes++;
                    this.actionScheduleObserver.notifyListeners();
                    this.timerId = undefined;
                    this.alertCompletion();
                    nextActionTimer();
                });
            }
            if (this.getActionSchedule === "longBreaks") {
                this.startTimer(Pomodoro.DEFAULT_LONG_BREAK_DURATION, () => {
                    this.cycle++;
                    this.offTimer();
                    this.actionScheduleObserver.notifyListeners();
                    this.alertCompletion();
                    completeCallback();
                });
            }
        };

        nextActionTimer();
    }

    public startTimer(duration: number, timeoutCallback: Function) {
        // 남은 시간 세팅
        this.remainingTime = duration;

        const secondTimer = () => {
            this.timerId = setTimeout(() => {
                this.remainingTime -= 1 * SECOND;
                this.remainingTimeObserver.notifyListeners();

                if (this.remainingTime > 0) {
                    secondTimer();
                } else {
                    timeoutCallback();
                }
            }, 1 * SECOND);
        };

        secondTimer();
    }

    public offTimer() {
        this.resetTimer();
        this.unLockScreenWithWake();
    }

    public resetTimer() {
        this.clearTimer();
        this.intializeCalledTimesDefaultValues();
    }

    private clearTimer() {
        this.remainingTime = Pomodoro.DEFAULT_FOCUS_SESSION_DURATION;
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
        // 벨소리
        const ringingBell = new Audio("sounds/bell.mp3");
        ringingBell.play();

        // 진동
        if ("vibrate" in navigator) {
            navigator.vibrate(200);
        }
    }

    public async lockScreenWithWake() {
        if (this.wakeLockSentinel == null) {
            this.wakeLockSentinel = await wakeLock();
        }
    }

    public async unLockScreenWithWake() {
        if (this.wakeLockSentinel != null) {
            await this.wakeLockSentinel.release();
            this.wakeLockSentinel = null;
        }
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
