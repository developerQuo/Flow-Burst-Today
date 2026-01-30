import { Pomodoro } from "@/lib/pomodoro";
import { createContext } from "react";

export const TimerContext = createContext<{ pomodoro: Pomodoro }>({
    pomodoro: new Pomodoro(),
});
