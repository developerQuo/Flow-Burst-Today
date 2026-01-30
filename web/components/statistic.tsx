import classNames from "classnames";

type InputProps = {
    isModal?: boolean;
};

export default function Statistic({ isModal }: InputProps) {
    return (
        <main
            className={classNames("flex justify-center", {
                "h-full": isModal,
                "h-screen": !isModal,
            })}
        >
            <div className="self-center text-xl font-semibold">
                to be continue...
            </div>
        </main>
    );
}
