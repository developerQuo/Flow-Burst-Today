import { TimerContext } from "@/store/timer";
import { useContext } from "react";

export default function useTimerContext() {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error("ContextProvider 범위를 벗어났습니다.");
    }
    return context;
}
