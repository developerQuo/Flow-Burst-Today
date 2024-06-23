import { Listener } from "@/lib/observer";
import { Pomodoro } from "@/lib/pomodoro";
import { useSyncExternalStore } from "react";

export function useActionSchedule(pomodoro: Pomodoro) {
    const subscribe = (callback: Listener) => {
        pomodoro.getActionScheduleObserver.subscribe(callback);
        return () => pomodoro.getActionScheduleObserver.unsubscribe(callback);
    };

    return useSyncExternalStore(
        subscribe,
        () => pomodoro.getActionSchedule,
        () => pomodoro.getActionSchedule,
    );
}
