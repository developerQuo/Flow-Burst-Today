// TODO: 타이머 시작되면 화면 유지, 완료나 대기 시간에는 화면 유지 x

export type WakeLockSentinelType = WakeLockSentinel | null;

export default async function wakeLock(): Promise<WakeLockSentinelType> {
    let wakeLockSentinel: WakeLockSentinelType = null;

    const requestWakeLock = async () => {
        try {
            wakeLockSentinel = await navigator.wakeLock.request("screen");
        } catch (error) {
            throw Error(`failed the wake-lock`);
        }
    };

    if ("wakeLock" in navigator) {
        await requestWakeLock();
    }

    return wakeLockSentinel;
}
