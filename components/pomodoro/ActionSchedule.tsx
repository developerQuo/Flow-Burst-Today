"use client";
import { Pomodoro } from "@/lib/pomodoro";
import { Listener } from "@/lib/observer";
import { useSyncExternalStore } from "react";

type InputProps = { pomodoro: Pomodoro };

export default function ActionSchedule({ pomodoro }: InputProps) {
    const actionScheduleText = useSyncExternalStore(
        (callback: Listener) => {
            pomodoro.getActionScheduleObserver.subscribe(callback);
            return () =>
                pomodoro.getActionScheduleObserver.unsubscribe(callback);
        },
        () => pomodoro.getActionScheduleText,
        () => pomodoro.getActionScheduleText,
    );

    return (
        <span className="z-10 my-8 text-2xl font-semibold text-white">
            {actionScheduleText}
        </span>
    );
}
