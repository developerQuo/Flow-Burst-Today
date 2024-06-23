import { useActionSchedule } from "@/hooks/useActionSchedule";
import { useRemainTime } from "@/hooks/useRemainTime";
import { Pomodoro } from "@/lib/pomodoro";
import classNames from "classnames";

type InputProps = {
    pomodoro: Pomodoro;
};

export default function SandColor({ pomodoro }: InputProps) {
    const getActionSchedule = useActionSchedule(pomodoro);
    const duration =
        getActionSchedule === "shortBreaks"
            ? Pomodoro.shortBreakDuration
            : getActionSchedule === "longBreaks"
              ? Pomodoro.longBreakDuration
              : Pomodoro.focusSessionDuration;
    const height = `${(useRemainTime(pomodoro) / duration) * 100}%`;

    return (
        <div
            data-testid="hourglass-bg-color"
            className={classNames(
                "absolute bottom-0 w-full bg-gradient-to-t transition-all duration-1000 ease-linear",
                {
                    "from-focus": getActionSchedule === "focus",
                    "from-short-breaks": getActionSchedule === "shortBreaks",
                    "from-long-breaks": getActionSchedule === "longBreaks",
                    "to-red-50": getActionSchedule === "focus",
                    "to-green-50": getActionSchedule === "shortBreaks",
                    "to-blue-50": getActionSchedule === "longBreaks",
                },
            )}
            style={{
                height,
            }}
        ></div>
    );
}
