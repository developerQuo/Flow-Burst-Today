import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeedBackForm from "@/components/feedback/Form";
import { submitFeedbackAction } from "@/actions";
import sendMail from "@/utils/send-mail";
import "@testing-library/jest-dom";
import createFormData from "@/utils/create-formdata";

jest.mock("@/utils/send-mail", () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mock("next/navigation", () => ({
    __esModule: true,
    redirect: jest.fn(),
}));

describe("feedback", () => {
    test("The fields are filled with input values", async () => {
        const { getByRole } = render(<FeedBackForm />);

        const emailInput = getByRole("textbox", { name: "이메일" });
        await userEvent.type(emailInput, "test@pomodoro.com");

        const categorySelect = getByRole("combobox", { name: "유형" });
        await userEvent.click(categorySelect);
        await userEvent.selectOptions(categorySelect, "피드백");

        const contentInput = getByRole("textbox", { name: "내용" });
        await userEvent.type(contentInput, "피드백 테스트");

        expect(emailInput).toHaveValue("test@pomodoro.com");
        expect(categorySelect).toHaveValue("feedback");
        expect(contentInput).toHaveValue("피드백 테스트");
    });

    describe("새로 생성시 나에게 이메일 전송", () => {
        test("pass", async () => {
            (sendMail as jest.Mock).mockResolvedValue(true);

            const result = await submitFeedbackAction(
                { success: false, message: "" },
                createFormData({
                    userEmail: "test@pomodoro.com",
                    category: "feedback",
                    content: "피드백 테스트",
                }),
            );

            expect(sendMail).toHaveBeenCalledWith({
                userEmail: "test@pomodoro.com",
                category: "feedback",
                content: "피드백 테스트",
            });
            expect(result).toEqual({
                success: true,
                message: "성공적으로 처리되었습니다.",
            });
        });

        test("fail", async () => {
            (sendMail as jest.Mock).mockResolvedValue(false);

            const result = await submitFeedbackAction(
                { success: false, message: "" },
                createFormData({
                    userEmail: "test@pomodoro.com",
                    category: "feedback",
                    content: "피드백 테스트",
                }),
            );

            expect(result).toEqual({
                success: false,
                message: "요청에 실패했습니다.",
            });
        });
    });
});
