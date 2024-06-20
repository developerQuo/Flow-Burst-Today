import { Listener } from "@/lib/observer";
import { Pomodoro } from "@/lib/pomodoro";
import { useSyncExternalStore } from "react";

export function useRemainTime(pomodoro: Pomodoro) {
    const subscribe = (callback: Listener) => {
        pomodoro.getRemainingTimeObserver.subscribe(callback);
        return () => pomodoro.getRemainingTimeObserver.unsubscribe(callback);
    };

    return useSyncExternalStore(
        subscribe,
        () => pomodoro.getRemainingTime,
        () => pomodoro.getRemainingTime,
    );
}
