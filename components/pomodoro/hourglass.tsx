import { Pomodoro } from "@/utils/timer";
import { useRef } from "react";

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

    return (
        <>
            <div
                data-testid="hourglass"
                className="h-60 w-60 rounded-full border bg-gray-400"
                onClick={handlePress}
                onMouseDown={handleLongPress}
                onMouseUp={handleReleasePress}
            ></div>
        </>
    );
}
