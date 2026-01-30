export const mailCategoryMapper = {
    feedback: "피드백",
    error: "에러",
    question: "문의",
    etc: "기타",
};

export type MailCategoryKey = keyof typeof mailCategoryMapper;
