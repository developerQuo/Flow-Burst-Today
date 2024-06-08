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

    const bgColor = useMemo(() => {
        console.log(pomodoro.getActionSchedule);
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
                className={`h-40 w-40 ${bgColor}`}
                onClick={handlePress}
                onMouseDown={handleLongPress}
                onMouseUp={handleReleasePress}
            ></div>
        </>
    );
}
