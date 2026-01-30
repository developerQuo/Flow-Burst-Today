import { useActionSchedule } from "@/hooks/useActionSchedule";
import { useRemainTime } from "@/hooks/useRemainTime";
import useTimerContext from "@/hooks/useTimerContext";
import { Pomodoro } from "@/lib/pomodoro";
import classNames from "classnames";
import { useMemo } from "react";

type InputProps = {
    position: "top" | "bottom";
};

export default function SandColor({ position }: InputProps) {
    const { pomodoro } = useTimerContext();
    const getActionSchedule = useActionSchedule(pomodoro);
    const remainingTime = useRemainTime(pomodoro);

    const height = useMemo(() => {
        const duration =
            getActionSchedule === "shortBreaks"
                ? Pomodoro.DEFAULT_SHORT_BREAK_DURATION
                : getActionSchedule === "longBreaks"
                  ? Pomodoro.DEFAULT_LONG_BREAK_DURATION
                  : Pomodoro.DEFAULT_FOCUS_SESSION_DURATION;

        return `${((position === "top" ? duration - remainingTime : remainingTime) / duration) * 100}%`;
    }, [getActionSchedule, position, remainingTime]);
    return (
        <div
            data-testid={`hourglass-bg-${position}`}
            className={classNames(
                "absolute w-full transition-all duration-1000 ease-linear",
                {
                    "from-focus": getActionSchedule === "focus",
                    "from-short-breaks": getActionSchedule === "shortBreaks",
                    "from-long-breaks": getActionSchedule === "longBreaks",
                    "to-red-50": getActionSchedule === "focus",
                    "to-green-50": getActionSchedule === "shortBreaks",
                    "to-blue-50": getActionSchedule === "longBreaks",
                    "bottom-0": position === "bottom",
                    "top-0": position === "top",
                    "bg-gradient-to-t": position === "bottom",
                    "bg-gradient-to-b": position === "top",
                },
            )}
            style={{
                height,
            }}
        ></div>
    );
}
