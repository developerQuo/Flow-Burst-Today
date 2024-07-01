import classNames from "classnames";
import Form from "./Form";
import { SubmitButton } from "./Button";

type InputProps = {
    isModal?: boolean;
};

export default function Feedback({ isModal }: InputProps) {
    return (
        <main
            className={classNames("flex justify-center", {
                "h-full": isModal,
                "h-screen": !isModal,
            })}
        >
            <div className="self-center text-xl font-semibold">
                <Form>
                    <SubmitButton />
                </Form>
            </div>
        </main>
    );
}
