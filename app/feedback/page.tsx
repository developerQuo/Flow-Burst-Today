import Feedback from "@/components/feedback";

export default function FeedbackPage() {
    return (
        <div className="p-8">
            <div className="h-12 w-full text-center text-2xl font-semibold">
                오류/문의/기타/피드백 하기
            </div>
            <Feedback />
        </div>
    );
}
