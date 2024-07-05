"use client";

import Hourglass from "@/components/pomodoro/hourglass";
import { Pomodoro } from "@/lib/pomodoro";
import { TimerContext } from "@/store/timer";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-between">
            <TimerContext.Provider value={{ pomodoro: new Pomodoro() }}>
                <Hourglass />
            </TimerContext.Provider>
        </main>
    );
}
