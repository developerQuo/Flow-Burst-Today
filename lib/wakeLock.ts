export type WakeLockSentinelType = WakeLockSentinel | null;

// 타이머 시작되면 화면 유지, 완료나 대기 시간에는 화면 유지 x
export default async function wakeLock(): Promise<WakeLockSentinelType> {
    let wakeLockSentinel: WakeLockSentinelType = null;

    const requestWakeLock = async () => {
        try {
            wakeLockSentinel = await navigator.wakeLock.request("screen");
        } catch (error) {
            alert(`Failed the Wake Lock API.`);
        }
    };

    if ("wakeLock" in navigator) {
        await requestWakeLock();
    } else {
        alert(
            `브라우저가 Wake Lock API를 지원하지 않습니다. 브라우저를 최신으로 업데이트하세요.`,
        );
    }

    return wakeLockSentinel;
}
