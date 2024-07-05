import { useActionSchedule } from "@/hooks/useActionSchedule";
import useTimerContext from "@/hooks/useTimerContext";
import classNames from "classnames";
import { useRef } from "react";

type InputProps = {
    children: React.ReactNode[];
    isCompleted: boolean;
    setIsCompleted: (isCompleted: boolean) => void;
};

export default function Screen({
    children,
    isCompleted,
    setIsCompleted,
}: InputProps) {
    const { pomodoro } = useTimerContext();
    const getActionSchedule = useActionSchedule(pomodoro);
    const timerForResetting = useRef<NodeJS.Timeout | undefined>(undefined);
    const resetInProgress = useRef(false);

    const startTimer = async () => {
        // prevent to start while resetting
        if (resetInProgress.current) {
            return;
        }

        if (isCompleted) {
            setIsCompleted(false);
        }

        pomodoro.onTimer(() => {
            setIsCompleted(true);
        });
        await pomodoro.lockScreenWithWake();
    };

    const startResetTimer = () => {
        // 2초가 되기 전에 실행되면 제거됨.
        timerForResetting.current = setTimeout(async () => {
            pomodoro.offTimer();
            await pomodoro.unLockScreenWithWake();

            resetInProgress.current = true;
        }, 2000);
    };

    const endResetTimer = () => {
        if (timerForResetting?.current) {
            clearTimeout(timerForResetting.current);

            // block timer starting
            setTimeout(() => {
                resetInProgress.current = false;
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
