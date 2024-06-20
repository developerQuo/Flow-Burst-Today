import { useRemainTime } from "@/hooks/useRemainTime";
import { Pomodoro } from "@/lib/pomodoro";
import { useRef } from "react";
import SandColor from "./SandColor";
import ActionSchedule from "./ActionSchedule";
import Timer from "./Timer";

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
                className={`relative flex h-screen w-full flex-col items-center overflow-hidden`}
                onClick={startTimer}
                onMouseDown={resetTimerMouseDown}
                onMouseUp={resetTimerMouseUp}
            >
                <SandColor
                    actionSchedule={pomodoro.getActionSchedule}
                    remainingTime={remainingTime}
                />
                <ActionSchedule
                    actionSchedule={pomodoro.getActionSchedule}
                    focusCalledTimes={pomodoro.getFocusCalledTimes}
                    breakCalledTimes={pomodoro.getBreakCalledTimes}
                />
                <Timer pomodoro={pomodoro} />
                <span className="z-10" ref={isCompleted} hidden>
                    complete
                </span>
            </div>
        </>
    );
}
