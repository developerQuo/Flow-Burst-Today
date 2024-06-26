import Guide from "@/components/pomodoro/guide";
import { Modal } from "@/components/pomodoro/modal";

export default function Page() {
    return (
        <Modal>
            <Guide isModal />
        </Modal>
    );
}
