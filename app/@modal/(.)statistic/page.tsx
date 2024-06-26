import { Modal } from "@/components/pomodoro/modal";
import Statistic from "@/components/pomodoro/statistic";

export default function Page() {
    return (
        <Modal title="뽀모도로 달성">
            <Statistic isModal />
        </Modal>
    );
}
