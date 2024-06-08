"use client";

import DrainingCircle from "@/components/pomodoro/circle";
import { Pomodoro } from "@/utils/timer";
import { useState } from "react";

export default function Home() {
    const [pomodoro] = useState(new Pomodoro());
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            Pomodoro
            <DrainingCircle pomodoro={pomodoro} />
        </main>
    );
}
