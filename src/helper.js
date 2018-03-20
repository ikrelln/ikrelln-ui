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

export function isJson(str) {
    if (str.indexOf("{") === -1) {
        return false;
    }
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export const sortBykey = (key) => (a, b) => {
    if (a[key] < b[key])
        return 1;
    if (a[key] === b[key])
        return 0;
    return -1;
};

export function randomId(length = 10) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
