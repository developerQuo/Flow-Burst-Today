import sendMail, { MailParam } from "@/utils/send-mail";
import { z } from "zod";

const schema = z.object({
    userEmail: z.string({
        invalid_type_error: "Invalid Email",
    }),
    category: z.string(),
    content: z.string(),
});

export type SubmitFeedbackState = {
    success: boolean;
    message: string;
};

export async function submitFeedbackAction(
    currentState: SubmitFeedbackState,
    formData: FormData,
) {
    const validatedFields = schema.safeParse({
        userEmail: formData.get("userEmail"),
        category: formData.get("category"),
        content: formData.get("content"),
    });

    let result = false;
    if (validatedFields.success) {
        result = await sendMail(validatedFields.data! as unknown as MailParam);
        // result = true;
    }

    if (result) {
        return { success: true, message: "성공적으로 처리되었습니다." };
    } else {
        return { success: false, message: "요청에 실패했습니다." };
    }
}
