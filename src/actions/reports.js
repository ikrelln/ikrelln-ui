export const REQUEST_REPORTS = 'REQUEST_REPORTS'
function requestReports() {
    return {
        type: REQUEST_REPORTS
    }
}
export const RECEIVE_REPORTS = 'RECEIVE_REPORTS'
function receiveReports(json) {
    return {
        type: RECEIVE_REPORTS,
        reports: json
    }
}
export function fetchReports() {
    return dispatch => {
        dispatch(requestReports())
        return fetch('/api/v1/reports')
            .then(response => response.json())
            .then(json => dispatch(receiveReports(json)))
    }
}

export const REQUEST_REPORT = 'REQUEST_REPORT'
function requestReport() {
    return {
        type: REQUEST_REPORT
    }
}
export const RECEIVE_REPORT = 'RECEIVE_REPORT'
function receiveReport(json, environment) {
    return {
        type: RECEIVE_REPORT,
        report: json,
        environment
    }
}
export function fetchReport(group, name, environment) {
    var env_filter = "";
    if (environment !== "")
        env_filter = "?environment=" + environment;
    return dispatch => {
        dispatch(requestReport())
        return fetch('/api/v1/reports/' + group + '/' + name + env_filter)
            .then(response => response.json())
            .then(json => dispatch(receiveReport(json, environment)))
    }
}
