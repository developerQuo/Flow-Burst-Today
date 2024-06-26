import Statistic from "@/components/pomodoro/statistic";

export default function StatisticPage() {
    return (
        <div className="p-8">
            <div className="h-12 w-full text-center text-2xl font-semibold">
                뽀모도로 달성
            </div>
            <Statistic />
        </div>
    );
}
