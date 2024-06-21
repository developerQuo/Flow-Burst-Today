"use client";
import { Pomodoro } from "@/lib/pomodoro";
import { useRef } from "react";

type InputProps = {
    children: React.ReactNode[];
    pomodoro: Pomodoro;
};

export default function Screen({ children, pomodoro }: InputProps) {
    const timerForResetting = useRef<NodeJS.Timeout | undefined>(undefined);
    const isResetting = useRef(false);
    const isCompleted = useRef<HTMLSpanElement>(null);

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
                className={`relative flex h-screen w-full flex-col items-center overflow-hidden`}
                onClick={startTimer}
                onMouseDown={resetTimerMouseDown}
                onMouseUp={resetTimerMouseUp}
            >
                {children}
                <span className="z-10" ref={isCompleted} hidden>
                    complete
                </span>
            </div>
        </>
    );
}
