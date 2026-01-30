import { useFormStatus } from "react-dom";

type InputProps = {
    isSubmitted: boolean;
};

export function SubmitButton({ isSubmitted }: InputProps) {
    const { pending } = useFormStatus();

    return (
        <button
            className="btn btn-primary mt-4"
            type="submit"
            disabled={pending || isSubmitted}
        >
            {pending ? (
                <span className="loading loading-spinner"></span>
            ) : (
                <span>제출</span>
            )}
        </button>
    );
}
