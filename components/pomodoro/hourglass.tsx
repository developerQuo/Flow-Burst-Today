import SandColor from "./SandColor";
import ActionSchedule from "./ActionSchedule";
import Timer from "./Timer";
import Screen from "./Screen";
import { useState } from "react";
import Complete from "./Complete";

export default function Hourglass() {
    const [isCompleted, setIsCompleted] = useState(false);

    return (
        <Screen isCompleted={isCompleted} setIsCompleted={setIsCompleted}>
            <SandColor position="top" />
            <SandColor position="bottom" />
            <ActionSchedule />
            <div className="my-auto flex flex-col items-center gap-y-12">
                {isCompleted && <Complete />}
                <Timer />
            </div>
        </Screen>
    );
}
