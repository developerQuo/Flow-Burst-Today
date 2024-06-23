import { useRef } from "react";

type InputProps = {
    children: React.ReactNode[];
    startTimerCallback: () => void;
    terminateTimerCallback: () => void;
};

export default function Screen({
    children,
    startTimerCallback,
    terminateTimerCallback,
}: InputProps) {
    const timerForResetting = useRef<NodeJS.Timeout | undefined>(undefined);
    const isResetting = useRef(false);

    const startTimer = () => {
        if (isResetting.current) {
            return;
        }

        startTimerCallback();
    };

    const resetTimerMouseDown = () => {
        timerForResetting.current = setTimeout(() => {
            terminateTimerCallback();
            isResetting.current = true;
        }, 2000);
    };

    const resetTimerMouseUp = () => {
        if (timerForResetting?.current) {
            clearTimeout(timerForResetting.current);

            // block timer starting
            setTimeout(() => {
                isResetting.current = false;
            }, 0);
        }
    };

    return (
        <>
            <div
                data-testid="hourglass"
                className={`relative flex h-screen w-full flex-col items-center overflow-hidden`}
                onClick={startTimer}
                onMouseDown={resetTimerMouseDown}
                onMouseUp={resetTimerMouseUp}
            >
                {children}
            </div>
        </>
    );
}
