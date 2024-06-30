import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeedBackForm from "@/components/feedback/Form";

// UI 껍데기부터 만들어보자. 그 다음에 상호작용.
describe("feedback", () => {
    test("input fields are submitted when the form submitted", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ message: "Form submitted" }),
            } as Response),
        );

        // select - 오류/문의/기타/피드백
        // textarea - 내용
        // email - 연락 받을 메일 주소

        // render해서 폼 요청 결과 비교하기
        const { findByRole, findByLabelText } = render(<FeedBackForm />);

        userEvent.type(await findByLabelText("이메일"), "test@pomodoro.com");

        userEvent.click(await findByLabelText("유형"));
        userEvent.click(await findByRole("option", { selected: true }));

        userEvent.type(await findByLabelText("내용"), "피드백 테스트");

        userEvent.click(await findByRole("button"));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: "test@pomodoro.com",
                    category: "error",
                    content: "피드백 테스트",
                }),
            });
        });

        (global.fetch as jest.Mock<Promise<Response>, []>).mockClear();
    });

    test.todo("새로 생성시 나에게 알림");

    test.todo("requests are saved to DB");
});
