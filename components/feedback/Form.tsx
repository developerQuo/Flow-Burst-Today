import { submitFeedback } from "@/actions";
import { ReactNode } from "react";

type InputProps = {
    children?: ReactNode;
};

export default function Form({ children }: InputProps) {
    return (
        <form action={submitFeedback}>
            <label htmlFor="email">이메일</label>
            <input name="email" type="email" id="email" />
            <label htmlFor="category">유형</label>
            <select name="category" id="category">
                <option value="error">에러</option>
                <option value="question">문의</option>
                <option value="feedback">피드백</option>
                <option value="etc">기타</option>
            </select>
            <label htmlFor="content">내용</label>
            <textarea name="content" id="content" />
            {children}
        </form>
    );
}
