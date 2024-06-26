import Guide from "@/components/pomodoro/guide";
import { Modal } from "@/components/pomodoro/modal";

export default function Page() {
    return (
        <Modal title="유저 가이드">
            <Guide isModal />
        </Modal>
    );
}
