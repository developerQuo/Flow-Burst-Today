import { useRemainTime } from "@/hooks/useRemainTime";
import { Pomodoro } from "@/lib/pomodoro";
import { formatRemainingTime } from "@/utils/times";
import { useMemo, useRef } from "react";

export type InputProps = {
    pomodoro: Pomodoro;
};

export default function Hourglass({ pomodoro }: InputProps) {
    const longPressTimer = useRef<NodeJS.Timeout | undefined>(undefined);

    const remainingTime = useRemainTime(pomodoro);

    const handlePress = () => {
        pomodoro.onTimer();
    };

    const handleLongPress = () => {
        longPressTimer.current = setTimeout(() => {
            pomodoro.offTimer();
        }, 2000);
    };

    const handleReleasePress = () => {
        if (longPressTimer?.current) {
            clearTimeout(longPressTimer.current);
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
