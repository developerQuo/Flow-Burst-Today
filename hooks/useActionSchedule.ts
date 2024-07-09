import { Listener } from "@/lib/observer";
import { Pomodoro } from "@/lib/pomodoro";
import { useSyncExternalStore } from "react";

export function useActionSchedule(pomodoro: Pomodoro) {
    const subscribe = (callback: Listener) => {
        pomodoro.actionScheduleObserver.subscribe(callback);
        return () => pomodoro.actionScheduleObserver.unsubscribe(callback);
    };

    return useSyncExternalStore(
        subscribe,
        () => pomodoro.actionSchedule,
        () => pomodoro.actionSchedule,
    );
}
