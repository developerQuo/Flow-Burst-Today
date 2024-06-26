import classNames from "classnames";

type InputProps = {
    isModal?: boolean;
};

export default function Guide({ isModal }: InputProps) {
    return (
        <main
            className={classNames("", {
                "h-full": isModal,
                "h-screen": !isModal,
            })}
        >
            <div className="w-full text-center text-2xl font-semibold">
                유저 가이드
            </div>
            <br />
            <p className="text-lg">사용 방법</p>
            <ul style={{ listStyleType: "disc" }}>
                <li>
                    {boldText("25분간 집중")}하고, {boldText("5분간 휴식")}.
                    <br />
                    (마지막 휴식은 20분)
                </li>
                <li>이렇게 {boldText("4번, 총 2시간")}씩 일에 집중해보세요.</li>
                <li>
                    한번에 쭉 이어서 진행하고, 중간에 실패하면 처음부터 다시!
                </li>
            </ul>
            <br />
            <p className="text-lg">주의사항</p>

            <ul style={{ listStyleType: "disc" }}>
                <li>
                    {boldText("앱 화면을 켜두세요!")} 화면이 꺼지면 타이머가
                    정상적으로 작동하지 않습니다.
                </li>
            </ul>
        </main>
    );
}

function boldText(text: string) {
    return <span className="font-semibold">{text}</span>;
}
