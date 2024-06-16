export const SECOND = 1 * 1000;
export const MINUTE = 60 * SECOND;

export function formatRemainingTime(remainingTime: number) {
    const seconds = (remainingTime % (1 * MINUTE)) / (1 * SECOND);
    const minutes = Math.floor(remainingTime / (1 * MINUTE));

    return `${formatTime(minutes)} : ${formatTime(seconds)}`;
}

function formatTime(time: number) {
    return time.toString().padStart(2, "0");
}
