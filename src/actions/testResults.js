export const REQUEST_TEST_RESULTS = 'REQUEST_TEST_RESULTS'
function requestTestResults() {
    return {
        type: REQUEST_TEST_RESULTS
    }
}
export const RECEIVE_TEST_RESULTS = 'RECEIVE_TEST_RESULTS'
function receiveTestResults(json) {
    return {
        type: RECEIVE_TEST_RESULTS,
        results: json,
        receivedAt: Date.now()
    }
}
export function fetchTestResults(status) {
    if (status === undefined)
        status = "Any";
    return dispatch => {
        dispatch(requestTestResults())
        return fetch('/api/v1/testresults?status=' + status)
            .then(response => response.json())
            .then(json => dispatch(receiveTestResults(json)))
    }
}

export const FILTER_TEST_RESULTS = 'FILTER_TEST_RESULTS'
function filterTestResults(status) {
    return {
        type: FILTER_TEST_RESULTS,
        status
    }    
}
export function fetchAndFilterTestResults(status) {
    if (status === undefined)
        status = "Any";
    return dispatch => {
        dispatch(filterTestResults(status))
        dispatch(requestTestResults())
        return fetch('/api/v1/testresults?status=' + status)
            .then(response => response.json())
            .then(json => dispatch(receiveTestResults(json)))
    }
}
