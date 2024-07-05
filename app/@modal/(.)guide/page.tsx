import Guide from "@/components/guide";
import { Modal } from "@/components/modal";

export default function Page() {
    return (
        <Modal title="유저 가이드">
            <Guide isModal />
        </Modal>
    );
}
