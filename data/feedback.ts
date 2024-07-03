export const mailCategoryMapper = {
    error: "에러",
    question: "문의",
    feedback: "피드백",
    etc: "기타",
};

export type MailCategoryKey = keyof typeof mailCategoryMapper;
