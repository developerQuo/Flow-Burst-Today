import Feedback from "@/components/pomodoro/feedback";

export default function FeedbackPage() {
    return (
        <div className="p-8">
            <div className="h-12 w-full text-center text-2xl font-semibold">
                문의하기
            </div>
            <Feedback />
        </div>
    );
}
