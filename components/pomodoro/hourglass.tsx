import SandColor from "./SandColor";
import ActionSchedule from "./ActionSchedule";
import Timer from "./Timer";
import Screen from "./Screen";
import { useState } from "react";
import Complete from "./Complete";
import useTimerContext from "@/hooks/useTimerContext";

export default function Hourglass() {
    const { pomodoro } = useTimerContext();
    const [isCompleted, setIsCompleted] = useState(false);

    return (
        <Screen isCompleted={isCompleted} setIsCompleted={setIsCompleted}>
            <SandColor position="top" />
            <SandColor position="bottom" />
            <ActionSchedule />
            <div className="my-auto flex flex-col items-center gap-y-12">
                {isCompleted && <Complete cycle={pomodoro.getCycle} />}
                <Timer />
            </div>
        </Screen>
    );
}
