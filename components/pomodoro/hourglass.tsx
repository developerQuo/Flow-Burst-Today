import { useRemainTime } from "@/hooks/useRemainTime";
import { Pomodoro } from "@/lib/pomodoro";
import { formatRemainingTime } from "@/utils/times";
import { useRef, useState } from "react";

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

    return (
        <>
            <div
                data-testid="hourglass"
                className={`flex h-60 w-40 items-center justify-center ${pomodoro.getColor}`}
                onClick={startTimer}
                onMouseDown={resetTimerMouseDown}
                onMouseUp={resetTimerMouseUp}
            >
                <div className="text-2xl font-bold text-white">
                    {formatRemainingTime(remainingTime)}
                </div>
                <span ref={isCompleted} hidden>
                    complete
                </span>
            </div>
        </>
    );
}
