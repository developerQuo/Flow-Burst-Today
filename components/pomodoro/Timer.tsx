"use client";
import { useRemainTime } from "@/hooks/useRemainTime";
import { Pomodoro } from "@/lib/pomodoro";
import { formatRemainingTime } from "@/utils/times";

type InputProps = {
    pomodoro: Pomodoro;
};

export default function Timer({ pomodoro }: InputProps) {
    const remainingTime = useRemainTime(pomodoro);
    return (
        <div className="z-10 my-auto text-6xl font-bold text-white">
            {formatRemainingTime(remainingTime)}
        </div>
    );
}
