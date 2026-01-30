import Navigation from "@/app/navigation";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

jest.mock("next/router", () => jest.requireActual("next-router-mock"));

describe("navigation", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("presents right nav infomations", async () => {
        const screen = render(<Navigation />);
        const guideIcon = await screen.findByTestId("guide-icon");
        const statisticIcon = await screen.findByTestId("statistic-icon");
        const feedbackIcon = await screen.findByTestId("feedback-icon");

        expect(guideIcon.parentElement!.getAttribute("href")).toBe("/guide");

        expect(statisticIcon.parentElement!.getAttribute("href")).toBe(
            "/statistic",
        );

        expect(feedbackIcon.parentElement!.getAttribute("href")).toBe(
            "/feedback",
        );
    });

    test("user's moved to the link's page by clicking the link", async () => {
        const screen = render(<Navigation />, {
            wrapper: MemoryRouterProvider,
        });
        const guideIcon = await screen.findByTestId("guide-icon");

        fireEvent.click(guideIcon);

        expect(mockRouter.asPath).toEqual("/guide");
    });
});
