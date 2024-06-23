import { useActionSchedule } from "@/hooks/useActionSchedule";
import { Pomodoro } from "@/lib/pomodoro";
import classNames from "classnames";
import { useRef } from "react";

type InputProps = {
    children: React.ReactNode[];
    startTimerCallback: () => void;
    terminateTimerCallback: () => void;
    pomodoro: Pomodoro;
};

export default function Screen({
    children,
    startTimerCallback,
    terminateTimerCallback,
    pomodoro,
}: InputProps) {
    const getActionSchedule = useActionSchedule(pomodoro);
    const timerForResetting = useRef<NodeJS.Timeout | undefined>(undefined);
    const isResetting = useRef(false);

    const startTimer = () => {
        if (isResetting.current) {
            return;
        }

        startTimerCallback();
    };

    const resetTimerMouseDown = () => {
        timerForResetting.current = setTimeout(() => {
            terminateTimerCallback();
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
                className={classNames(
                    `relative flex h-screen w-full flex-col items-center overflow-hidden bg-gradient-to-t`,
                    {
                        "text-orange-700": getActionSchedule === "focus",
                        "text-green-700": getActionSchedule === "shortBreaks",
                        "text-blue-700": getActionSchedule === "longBreaks",
                        "to-red-200": getActionSchedule === "focus",
                        "to-green-200": getActionSchedule === "shortBreaks",
                        "to-blue-200": getActionSchedule === "longBreaks",
                        "from-red-50": getActionSchedule === "focus",
                        "from-green-50": getActionSchedule === "shortBreaks",
                        "from-blue-50": getActionSchedule === "longBreaks",
                    },
                )}
                onClick={startTimer}
                onMouseDown={resetTimerMouseDown}
                onMouseUp={resetTimerMouseUp}
            >
                {children}
            </div>
        </>
    );
}
