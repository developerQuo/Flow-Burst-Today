import Feedback from "@/components/pomodoro/feedback";
import { Modal } from "@/components/pomodoro/modal";

export default function Page() {
    return (
        <Modal title="문의하기">
            <Feedback isModal />
        </Modal>
    );
}
