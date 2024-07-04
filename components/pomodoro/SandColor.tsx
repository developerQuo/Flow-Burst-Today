import { useActionSchedule } from "@/hooks/useActionSchedule";
import { useRemainTime } from "@/hooks/useRemainTime";
import { Pomodoro } from "@/lib/pomodoro";
import classNames from "classnames";

type InputProps = {
    pomodoro: Pomodoro;
    position: "top" | "bottom";
};

export default function SandColor({ pomodoro, position }: InputProps) {
    const getActionSchedule = useActionSchedule(pomodoro);
    const duration =
        getActionSchedule === "shortBreaks"
            ? Pomodoro.DEFAULT_SHORT_BREAK_DURATION
            : getActionSchedule === "longBreaks"
              ? Pomodoro.DEFAULT_LONG_BREAK_DURATION
              : Pomodoro.DEFAULT_FOCUS_SESSION_DURATION;

    const remainingTime = useRemainTime(pomodoro);

    const height = `${((position === "top" ? duration - remainingTime : remainingTime) / duration) * 100}%`;

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
