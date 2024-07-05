import { useMemo } from "react";
import { useActionSchedule } from "@/hooks/useActionSchedule";
import useTimerContext from "@/hooks/useTimerContext";

export default function ActionSchedule() {
    const { pomodoro } = useTimerContext();
    const getActionSchedule = useActionSchedule(pomodoro);
    const actionScheduleText = useMemo(() => {
        return getActionSchedule === "focus"
            ? `${pomodoro.getFocusCalledTimes + 1} 집중`
            : getActionSchedule === "shortBreaks"
              ? `${pomodoro.getBreakCalledTimes + 1} 짧은 휴식`
              : `긴 휴식`;
    }, [
        getActionSchedule,
        pomodoro.getBreakCalledTimes,
        pomodoro.getFocusCalledTimes,
    ]);
    return (
        <span className="z-10 my-8 text-2xl font-semibold">
            {actionScheduleText}
        </span>
    );
}
