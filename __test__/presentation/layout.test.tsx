import Navigation from "@/app/navigation";
import { describe, expect, it, test } from "@jest/globals";
import { fireEvent, render } from "@testing-library/react";

import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

jest.mock("next/router", () => jest.requireActual("next-router-mock"));

describe("navigation", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("presents right nav infomations", async () => {
        const screen = render(<Navigation />);
        const pomodoroElement = await screen.findByText("Pomodoro");
        const guideElement = await screen.findByText("Guide");

        expect(pomodoroElement.getAttribute("href")).toBe("/");
        expect(pomodoroElement.textContent).toBe("Pomodoro");

        expect(guideElement.getAttribute("href")).toBe("/guide");
        expect(guideElement.textContent).toBe("Guide");
    });

    test("user's moved to the link's page by clicking the link", async () => {
        const screen = render(<Navigation />, {
            wrapper: MemoryRouterProvider,
        });
        const guideElement = await screen.findByText("Guide");

        fireEvent.click(guideElement);

        expect(mockRouter.asPath).toEqual("/guide");
    });
});
