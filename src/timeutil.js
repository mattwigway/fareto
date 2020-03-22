/** seconds since midnight to HH:MM */
export function secondsToTime (seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/** HH:MM to seconds since midnight */
export function timeToSeconds (time) {
    const [hours, minutes] = time.split(':')
    return parseInt(hours) * 3600 + parseInt(minutes) * 60
}