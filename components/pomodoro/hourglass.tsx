import { useRemainTime } from "@/hooks/useRemainTime";
import { Pomodoro } from "@/lib/pomodoro";
import { formatRemainingTime } from "@/utils/times";
import { useMemo, useRef } from "react";

export type InputProps = {
    pomodoro: Pomodoro;
};

export default function Hourglass({ pomodoro }: InputProps) {
    const longPressTimer = useRef<NodeJS.Timeout | undefined>(undefined);
    const isLongPress = useRef(false);

    const remainingTime = useRemainTime(pomodoro);

    const handlePress = () => {
        if (isLongPress.current) {
            return;
        }
        pomodoro.onTimer();
    };

    const handleLongPress = () => {
        longPressTimer.current = setTimeout(() => {
            pomodoro.offTimer();
            isLongPress.current = true;
        }, 2000);
    };

    const handleReleasePress = () => {
        if (longPressTimer?.current) {
            clearTimeout(longPressTimer.current);

            // block call click
            setTimeout(() => {
                isLongPress.current = false;
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

    return (
        <>
            <div
                data-testid="hourglass"
                className={`flex h-60 w-40 items-center justify-center ${bgColor}`}
                onClick={handlePress}
                onMouseDown={handleLongPress}
                onMouseUp={handleReleasePress}
            >
                <div className="text-2xl font-bold text-white">
                    {formatRemainingTime(remainingTime)}
                </div>
            </div>
        </>
    );
}
