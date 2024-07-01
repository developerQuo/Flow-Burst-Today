import Feedback from "@/components/feedback";
import { Modal } from "@/components/pomodoro/modal";

export default function Page() {
    return (
        <Modal title="문의하기">
            <Feedback isModal />
        </Modal>
    );
}
