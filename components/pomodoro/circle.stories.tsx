import { Pomodoro } from "@/utils/timer";
import DrainingCircle, { InputProps } from "./circle";
import { StoryFn } from "@storybook/react";

export default {
    component: DrainingCircle,
    title: "DrainingCircle",
};

const Template: StoryFn<InputProps> = (args: InputProps) => (
    <main className="flex min-h-screen items-center justify-center">
        <DrainingCircle {...args} />
    </main>
);

export const Focus = Template.bind({});
Focus.args = {
    pomodoro: new Pomodoro(),
};

export const ShortBreaks = Template.bind({});
ShortBreaks.args = {
    pomodoro: new Pomodoro(0, 1),
};

export const LongBreaks = Template.bind({});
LongBreaks.args = {
    pomodoro: new Pomodoro(0, 4, 3),
};
