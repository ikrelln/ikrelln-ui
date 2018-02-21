export function formatDuration(duration) {
    if (duration < 10000) {
        return duration + "ns";
    }
    duration = duration / 1000
    if (duration < 10000) {
        return duration.toFixed(2) + "ms";
    }
    duration = duration / 1000
    if (duration < 10000) {
        return duration.toFixed(2) + "s";
    }
}

export function statusToColorSuffix(status) {
    let status_suffix;
    switch (status) {
        case "Failure":
        status_suffix = "-danger";
            break;
        case "Skipped":
        status_suffix = "-warning";
            break;
        default:
        status_suffix = "-success";
    }
    return status_suffix;
}
