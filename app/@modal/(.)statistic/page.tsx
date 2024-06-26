import { Modal } from "@/components/pomodoro/modal";
import Statistic from "@/components/pomodoro/statistic";

export default function Page() {
    return (
        <Modal>
            <Statistic isModal />
        </Modal>
    );
}
