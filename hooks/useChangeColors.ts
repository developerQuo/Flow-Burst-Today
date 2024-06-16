import { Listener } from "@/utils/observer";
import { Pomodoro } from "@/lib/pomodoro";
import { useSyncExternalStore } from "react";

export function useChangeColors(pomodoro: Pomodoro) {
    const subscribe = (callback: Listener) => {
        pomodoro.subscribe(callback);
        return () => pomodoro.unsubscribe(callback);
    };

    return useSyncExternalStore(
        subscribe,
        () => pomodoro.getColor,
        () => pomodoro.getColor,
    );
}
