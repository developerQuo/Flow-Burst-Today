import { useRemainTime } from "@/hooks/useRemainTime";
import { Pomodoro } from "@/lib/pomodoro";
import { formatRemainingTime } from "@/utils/times";
import { useMemo, useRef, useState } from "react";

export type InputProps = {
    pomodoro: Pomodoro;
};

export default function Hourglass({ pomodoro }: InputProps) {
    const timerForResetting = useRef<NodeJS.Timeout | undefined>(undefined);
    const isResetting = useRef(false);
    const isCompleted = useRef<HTMLSpanElement>(null);

    const remainingTime = useRemainTime(pomodoro);

    const startTimer = () => {
        if (isResetting.current) {
            return;
        }
        if (isCompleted.current) {
            isCompleted.current.hidden = true;
        }

        pomodoro.onTimer(() => {
            if (isCompleted.current) {
                isCompleted.current.hidden = false;
            }
        });
    };

    const resetTimerMouseDown = () => {
        timerForResetting.current = setTimeout(() => {
            pomodoro.offTimer();
            isResetting.current = true;
        }, 2000);
    };

    const resetTimerMouseUp = () => {
        if (timerForResetting?.current) {
            clearTimeout(timerForResetting.current);

            // block timer starting
            setTimeout(() => {
                isResetting.current = false;
            }, 0);
        }
    };

    const bgColor = useMemo(() => {
        switch (pomodoro.getActionSchedule) {
            case "focus":
                return "bg-focus";
            case "shortBreaks":
                return "bg-shortBreaks";
            case "longBreaks":
                return "bg-longBreaks";
        }
    }, [pomodoro.getActionSchedule]);

    const actionSchedule = useMemo(() => {
        if (pomodoro.getActionSchedule === "focus") {
            return `${pomodoro.getFocusCalledTimes + 1} 뽀모도로`;
        } else if (pomodoro.getActionSchedule === "shortBreaks") {
            return `${pomodoro.getBreakCalledTimes + 1} 짧은 휴식`;
        } else {
            return `긴 휴식`;
        }
    }, [
        pomodoro.getActionSchedule,
        pomodoro.getFocusCalledTimes,
        pomodoro.getBreakCalledTimes,
    ]);
    return (
        <>
            <div
                data-testid="hourglass"
                className={`flex h-screen w-full flex-col items-center ${bgColor}`}
                onClick={startTimer}
                onMouseDown={resetTimerMouseDown}
                onMouseUp={resetTimerMouseUp}
            >
                <span className="my-8 text-2xl font-semibold text-white">
                    {actionSchedule}
                </span>
                <div className="my-auto text-6xl font-bold text-white">
                    {formatRemainingTime(remainingTime)}
                </div>
                <span ref={isCompleted} hidden>
                    complete
                </span>
            </div>
        </>
    );
}
