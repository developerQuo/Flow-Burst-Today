import { MailCategoryKey, mailCategoryMapper } from "@/data/feedback";
import { ReactNode } from "react";

const options = Object.keys(mailCategoryMapper) as MailCategoryKey[];

type InputProps = {
    children?: ReactNode;
    formAction: (payload: FormData) => void;
};

export default function Form({ children, formAction }: InputProps) {
    return (
        <form action={formAction} className="form-control gap-y-2">
            <div className="form-control">
                <label htmlFor="email" className="label label-text">
                    이메일
                </label>
                <input
                    name="userEmail"
                    type="email"
                    id="email"
                    className="input input-bordered w-full"
                    required
                />
            </div>
            <div className="form-control">
                <label htmlFor="category" className="label label-text">
                    유형
                </label>
                <select
                    name="category"
                    id="category"
                    className="select select-bordered w-full"
                >
                    {options.map((key: MailCategoryKey) => (
                        <option key={key} value={key}>
                            {mailCategoryMapper[key]}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-control">
                <label htmlFor="content" className="label label-text">
                    내용
                </label>
                <textarea
                    name="content"
                    id="content"
                    className="textarea textarea-bordered h-28 w-full"
                    maxLength={600}
                    required
                />
            </div>
            {children}
        </form>
    );
}
