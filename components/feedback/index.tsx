"use client";

import classNames from "classnames";
import Form from "./Form";
import { SubmitButton } from "./Button";
import { useFormState } from "react-dom";
import { submitFeedbackAction } from "@/actions";

type InputProps = {
    isModal?: boolean;
};

export default function Feedback({ isModal }: InputProps) {
    const [result, formAction] = useFormState(submitFeedbackAction, {
        success: false,
        message: "",
    });

    return (
        <main
            className={classNames("flex justify-center", {
                "h-full": isModal,
                "h-screen": !isModal,
            })}
        >
            <div className="self-center text-xl font-semibold">
                <Form formAction={formAction}>
                    <p
                        className={classNames("self-center text-lg", {
                            "text-error": !result.success,
                            "text-success": result.success,
                        })}
                    >
                        {result.message}
                    </p>
                    <SubmitButton isSubmitted={result.success} />
                </Form>
            </div>
        </main>
    );
}
