import { MailCategoryKey, mailCategoryMapper } from "@/data/feedback";
import { transporter, OAUTH_USER as developerEmail } from "@/lib/mail";

export type MailParam = {
    userEmail: string;
    category: MailCategoryKey;
    content: string;
};

export default async function sendMail({
    userEmail,
    category,
    content,
}: MailParam) {
    const message = {
        from: "dev@pomodoro.com",
        to: developerEmail,
        subject: `뽀모도로 앱 사용자 의견 도착`,
        html: `
        <h2>
          유형
        </h2>
        <p>${mailCategoryMapper[category]}<p/>
        <br />
        <hr />
        <h2>
          내용
        </h2>
        <p>${content}<p/>
        <br />
        <hr />
        <h2>
          사용자 메일
        </h2>
        <p>${userEmail}</p>
      `,
    };

    try {
        await transporter.sendMail(message);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}
