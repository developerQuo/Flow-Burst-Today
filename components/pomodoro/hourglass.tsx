import { Pomodoro } from "@/utils/timer";
import { useMemo, useRef } from "react";

export type InputProps = {
    pomodoro: Pomodoro;
};

export default function Hourglass({ pomodoro }: InputProps) {
    const longPressTimer = useRef<NodeJS.Timeout | undefined>(undefined);

    const handlePress = () => {
        alert("clicked");
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

    const [bgColor, hours] = useMemo(() => {
        console.log(pomodoro.getActionSchedule);
        switch (pomodoro.getActionSchedule) {
            case "focus":
                return ["bg-focus", "25:00"];
            case "shortBreaks":
                return ["bg-shortBreaks", "5:00"];
            case "longBreaks":
                return ["bg-longBreaks", "20:00"];
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
                <div className="text-2xl font-bold text-white">{hours}</div>
            </div>
        </>
    );
}
