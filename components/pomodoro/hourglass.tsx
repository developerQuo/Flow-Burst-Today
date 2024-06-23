"use client";
import { Pomodoro } from "@/lib/pomodoro";
import SandColor from "./SandColor";
import ActionSchedule from "./ActionSchedule";
import Timer from "./Timer";
import Screen from "./Screen";

export type InputProps = {
    pomodoro: Pomodoro;
};

// TODO: pomodoro를 리듀서로 외부에 만들면 어떻게 되지?
export default function Hourglass({ pomodoro }: InputProps) {
    return (
        <>
            <Screen pomodoro={pomodoro}>
                <SandColor pomodoro={pomodoro} />
                <ActionSchedule pomodoro={pomodoro} />
                <Timer pomodoro={pomodoro} />
            </Screen>
        </>
    );
}
