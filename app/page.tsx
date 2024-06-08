"use client";

import Hourglass from "@/components/pomodoro/hourglass";
import { Pomodoro } from "@/utils/timer";
import { useState } from "react";

export default function Home() {
    const [pomodoro] = useState(new Pomodoro());
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            Pomodoro
            <Hourglass pomodoro={pomodoro} />
        </main>
    );
}
