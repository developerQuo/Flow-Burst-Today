"use client";

import Hourglass from "@/components/pomodoro/hourglass";
import { Pomodoro } from "@/lib/pomodoro";
import { useMemo } from "react";

export default function Home() {
    const pomodoro = useMemo(() => new Pomodoro(), []);
    return (
        <main className="flex flex-col items-center justify-between">
            <Hourglass pomodoro={pomodoro} />
        </main>
    );
}
