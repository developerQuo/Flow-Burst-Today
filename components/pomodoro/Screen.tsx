import { useActionSchedule } from "@/hooks/useActionSchedule";
import { Pomodoro } from "@/lib/pomodoro";
import classNames from "classnames";
import { useRef } from "react";

type InputProps = {
    children: React.ReactNode[];
    startTimerCallback: () => Promise<void>;
    terminateTimerCallback: () => Promise<void>;
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

    const startTimer = async () => {
        if (isResetting.current) {
            return;
        }

        await startTimerCallback();
    };

    const startResetTimer = () => {
        // 2초가 되기 전에 실행되면 제거됨.
        timerForResetting.current = setTimeout(async () => {
            await terminateTimerCallback();
            isResetting.current = true;
        }, 2000);
    };

    const endResetTimer = () => {
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
                    `relative flex h-screen w-full flex-col items-center overflow-hidden`,
                    {
                        "text-orange-700": getActionSchedule === "focus",
                        "text-green-700": getActionSchedule === "shortBreaks",
                        "text-blue-700": getActionSchedule === "longBreaks",
                    },
                )}
                onClick={startTimer}
                onMouseDown={startResetTimer}
                onMouseUp={endResetTimer}
                onTouchStart={startResetTimer}
                onTouchEnd={endResetTimer}
            >
                {children}
            </div>
        </>
    );
}
