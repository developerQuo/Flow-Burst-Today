import useTimerContext from "@/hooks/useTimerContext";

export default function Complete() {
    const { pomodoro } = useTimerContext();
    return (
        <span className="z-10 text-4xl font-bold">
            {pomodoro.getCycle} 뽀모도로 달성!
        </span>
    );
}
