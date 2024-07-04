"use client";
import { Pomodoro } from "@/lib/pomodoro";
import SandColor from "./SandColor";
import ActionSchedule from "./ActionSchedule";
import Timer from "./Timer";
import Screen from "./Screen";
import { useState } from "react";

export type InputProps = {
    pomodoro: Pomodoro;
};

// TODO: pomodoro를 리듀서로 외부에 만들면 어떻게 되지?
export default function Hourglass({ pomodoro }: InputProps) {
    const [isCompleted, setIsCompleted] = useState(false);

    const startTimerCallback = async () => {
        if (isCompleted) {
            setIsCompleted(false);
        }

        pomodoro.onTimer(() => {
            setIsCompleted(true);
        });
        await pomodoro.lockScreenWithWake();
    };

    const terminateTimerCallback = async () => {
        pomodoro.offTimer();
        await pomodoro.unLockScreenWithWake();
    };

    return (
        <>
            <Screen
                startTimerCallback={startTimerCallback}
                terminateTimerCallback={terminateTimerCallback}
                pomodoro={pomodoro}
            >
                <SandColor pomodoro={pomodoro} position="top" />
                <SandColor pomodoro={pomodoro} position="bottom" />
                <ActionSchedule pomodoro={pomodoro} />
                <div className="my-auto flex flex-col items-center gap-y-12">
                    {isCompleted && (
                        <span className="z-10 text-4xl font-bold">
                            {pomodoro.getCycle} 뽀모도로 달성!
                        </span>
                    )}
                    <Timer pomodoro={pomodoro} />
                </div>
            </Screen>
        </>
    );
}
