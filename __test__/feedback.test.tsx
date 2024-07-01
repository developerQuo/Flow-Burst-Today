import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeedBackForm from "@/components/feedback/Form";
import { submitFeedback } from "@/actions";
import "@testing-library/jest-dom";

// UI 껍데기부터 만들어보자. 그 다음에 상호작용.
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

    test.todo("새로 생성시 나에게 알림");
    // 구글 메일로 보내자

    test.todo("requests are saved to DB");
});
