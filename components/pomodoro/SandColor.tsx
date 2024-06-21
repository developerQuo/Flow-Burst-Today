"use client";
import { useRemainTime } from "@/hooks/useRemainTime";
import { Pomodoro } from "@/lib/pomodoro";
import classNames from "classnames";

type InputProps = {
    pomodoro: Pomodoro;
};

export default function SandColor({ pomodoro }: InputProps) {
    const duration =
        pomodoro.getActionSchedule === "shortBreaks"
            ? Pomodoro.shortBreakDuration
            : pomodoro.getActionSchedule === "longBreaks"
              ? Pomodoro.longBreakDuration
              : Pomodoro.focusSessionDuration;
    const height = `${(useRemainTime(pomodoro) / duration) * 100}%`;

    return (
        <div
            data-testid="hourglass-bg-color"
            className={classNames(
                "absolute bottom-0 w-full bg-gradient-to-t to-yellow-100 transition-all duration-1000 ease-linear",
                {
                    "from-focus": pomodoro.getActionSchedule === "focus",
                    "from-short-breaks":
                        pomodoro.getActionSchedule === "shortBreaks",
                    "from-long-breaks":
                        pomodoro.getActionSchedule === "longBreaks",
                },
            )}
            style={{
                height,
            }}
        ></div>
    );
}
