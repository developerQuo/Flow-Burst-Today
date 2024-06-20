import { ActionSchedule, Pomodoro } from "@/lib/pomodoro";
import classNames from "classnames";

type InputProps = {
    actionSchedule: ActionSchedule;
    remainingTime: number;
};

export default function SandColor({
    actionSchedule,
    remainingTime,
}: InputProps) {
    const duration =
        actionSchedule === "shortBreaks"
            ? Pomodoro.shortBreakDuration
            : actionSchedule === "longBreaks"
              ? Pomodoro.longBreakDuration
              : Pomodoro.focusSessionDuration;
    const height = `${(remainingTime / duration) * 100}%`;

    return (
        <div
            data-testid="hourglass-bg-color"
            className={classNames(
                "absolute bottom-0 w-full bg-gradient-to-t to-yellow-100 transition-all duration-1000 ease-linear",
                {
                    "from-focus": actionSchedule === "focus",
                    "from-short-breaks": actionSchedule === "shortBreaks",
                    "from-long-breaks": actionSchedule === "longBreaks",
                },
            )}
            style={{
                height,
            }}
        ></div>
    );
}
