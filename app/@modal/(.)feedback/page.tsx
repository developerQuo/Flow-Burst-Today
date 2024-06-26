import Feedback from "@/components/pomodoro/feedback";
import { Modal } from "@/components/pomodoro/modal";

export default function Page() {
    return (
        <Modal>
            <Feedback isModal />
        </Modal>
    );
}
