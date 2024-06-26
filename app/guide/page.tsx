import Guide from "@/components/pomodoro/guide";

export default function GuidePage() {
    return (
        <div className="p-8">
            <div className="h-12 w-full text-center text-2xl font-semibold">
                사용자 가이드
            </div>
            <Guide />
        </div>
    );
}
