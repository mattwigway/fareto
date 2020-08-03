/** seconds since midnight to HH:MM */
export function secondsToTime (seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/** HH:MM to seconds since midnight */
export function timeToSeconds (time) {
    const spl = time.split(':')
    const hours = parseInt(spl[0])
    const minutes = parseInt(spl[1])
    return hours * 3600 + minutes * 60
}