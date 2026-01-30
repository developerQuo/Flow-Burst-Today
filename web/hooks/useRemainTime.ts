import { Listener } from "@/lib/observer";
import { Pomodoro } from "@/lib/pomodoro";
import { useSyncExternalStore } from "react";

export function useRemainTime(pomodoro: Pomodoro) {
    const subscribe = (callback: Listener) => {
        pomodoro.remainingTimeObserver.subscribe(callback);
        return () => pomodoro.remainingTimeObserver.unsubscribe(callback);
    };

    return useSyncExternalStore(
        subscribe,
        () => pomodoro.remainingTime,
        () => pomodoro.remainingTime,
    );
}
