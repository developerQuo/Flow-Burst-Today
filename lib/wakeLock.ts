export type WakeLockSentinelType = WakeLockSentinel | null;

// 타이머 시작되면 화면 유지, 완료나 대기 시간에는 화면 유지 x
export default async function wakeLock(): Promise<WakeLockSentinelType> {
    let wakeLockSentinel: WakeLockSentinelType = null;

    const requestWakeLock = async () => {
        try {
            wakeLockSentinel = await navigator.wakeLock.request("screen");
        } catch (error) {
            alert(`화면 꺼짐 방지를 사용할 수 없습니다.`);
        }
    };

    if ("wakeLock" in navigator) {
        await requestWakeLock();
    } else {
        alert(
            `브라우저가 Wake Lock API를 지원하지 않습니다. 브라우저를 최신으로 업데이트하세요.`,
        );
    }

    // 탭 벗어났을 때, wakeLock 재개
    const handleVisibilityChange = async () => {
        if (wakeLock !== null && document.visibilityState === "visible") {
            await requestWakeLock();
        }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return wakeLockSentinel;
}
