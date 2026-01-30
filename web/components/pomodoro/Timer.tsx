import { useRemainTime } from "@/hooks/useRemainTime";
import useTimerContext from "@/hooks/useTimerContext";
import { formatRemainingTime } from "@/utils/times";

export default function Timer() {
    const { pomodoro } = useTimerContext();
    const remainingTime = useRemainTime(pomodoro);
    return (
        <div className="z-10 mb-40 text-6xl font-bold">
            {formatRemainingTime(remainingTime)}
        </div>
    );
}
