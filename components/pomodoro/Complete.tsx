import { memo } from "react";

type InputProps = { cycle: number };

const MemoizedComplete = memo(function Complete({ cycle }: InputProps) {
    return (
        <span className="z-10 text-4xl font-bold">{cycle} 뽀모도로 달성!</span>
    );
});

export default MemoizedComplete;
