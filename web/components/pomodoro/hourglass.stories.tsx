import { Pomodoro } from "@/lib/pomodoro";
import Hourglass from "./hourglass";
import { StoryFn } from "@storybook/react";
import { TimerContext } from "@/store/timer";

export default {
    component: Hourglass,
    title: "Hourglass",
};

type InputProps = {
    pomodoro: Pomodoro;
};

const Template: StoryFn<InputProps> = ({ pomodoro }: InputProps) => (
    <main className="flex min-h-screen items-center justify-center">
        <TimerContext.Provider value={{ pomodoro }}>
            <Hourglass />
        </TimerContext.Provider>
    </main>
);

export const Focus = Template.bind({});
Focus.args = {
    pomodoro: new Pomodoro(),
};

export const ShortBreaks = Template.bind({});
ShortBreaks.args = {
    pomodoro: new Pomodoro(1),
};

export const LongBreaks = Template.bind({});
LongBreaks.args = {
    pomodoro: new Pomodoro(4, 3),
};
