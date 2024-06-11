import { useRemainTime } from "@/hooks/useRemainTime";
import { Pomodoro } from "@/utils/timer";
import { formatRemainingTime } from "@/utils/times";
import { useEffect, useMemo, useRef, useState } from "react";

export type InputProps = {
    pomodoro: Pomodoro;
};

export default function Hourglass({ pomodoro }: InputProps) {
    const longPressTimer = useRef<NodeJS.Timeout | undefined>(undefined);

    const [bgColor, hours] = useMemo(() => {
        switch (pomodoro.getActionSchedule) {
            case "focus":
                return ["bg-focus", "25:00"];
            case "shortBreaks":
                return ["bg-shortBreaks", "5:00"];
            case "longBreaks":
                return ["bg-longBreaks", "20:00"];
        }
    }, [pomodoro.getActionSchedule]);

    const [timer, setTimer] = useState(hours);
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

    useEffect(() => {
        setTimer(formatRemainingTime(remainingTime));
    }, [remainingTime]);
    return (
        <>
            <div
                data-testid="hourglass"
                className={`flex h-60 w-40 items-center justify-center ${bgColor}`}
                onClick={handlePress}
                onMouseDown={handleLongPress}
                onMouseUp={handleReleasePress}
            >
                <div className="text-2xl font-bold text-white">{timer}</div>
            </div>
        </>
    );
}
