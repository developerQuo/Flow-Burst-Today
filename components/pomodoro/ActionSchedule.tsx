import { ActionSchedule as ActionScheduleType } from "@/lib/pomodoro";

type InputProps = {
    actionSchedule: ActionScheduleType;
    focusCalledTimes: number;
    breakCalledTimes: number;
};

export default function ActionSchedule({
    actionSchedule,
    focusCalledTimes,
    breakCalledTimes,
}: InputProps) {
    const actionScheduleText =
        actionSchedule === "focus"
            ? `${focusCalledTimes + 1} 뽀모도로`
            : actionSchedule === "shortBreaks"
              ? `${breakCalledTimes + 1} 짧은 휴식`
              : `긴 휴식`;
    return (
        <span className="z-10 my-8 text-2xl font-semibold text-white">
            {actionScheduleText}
        </span>
    );
}
