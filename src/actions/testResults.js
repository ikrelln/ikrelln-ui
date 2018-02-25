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
export const UPDATE_OLDEST_BY_FILTER = 'UPDATE_OLDEST_BY_FILTER'
function updateOldestByFilter(filter, oldest) {
    return {
        type: UPDATE_OLDEST_BY_FILTER,
        filter,
        oldest,
    }
}
export function fetchTestResults(status, environment, test_id, ts) {
    if (status === undefined)
        status = "Any";

    let environment_filter = "";
    if (environment !== undefined)
        environment_filter = "&environment=" + environment;

    let test_id_filter = "";
    if (test_id !== undefined)
        test_id_filter = "&testId=" + test_id;

    let ts_filter = "";
    if (ts !== undefined)
        ts_filter = "&ts=" + ts;

    return dispatch => {
        dispatch(requestTestResults())
        return fetch('/api/v1/testresults?status=' + status + environment_filter + test_id_filter + ts_filter)
            .then(response => response.json())
            .then(json => dispatch(receiveTestResults(json)))
    }
}

export const FILTER_TEST_RESULTS = 'FILTER_TEST_RESULTS'
export function filterTestResults(status, environment, ts) {
    return {
        type: FILTER_TEST_RESULTS,
        filter: {status, environment, ts},
    }    
}
    }    
}
export function fetchAndFilterTestResults(status, environment, test_id, ts) {
    if ((status === undefined) || (status === null))
        status = "Any";
    
    return dispatch => {
        dispatch(filterTestResults(status, environment, ts))
        return fetchTestResults(status, environment, test_id, ts)(dispatch);
    }
}

export const REQUEST_ENVIRONMENTS = 'REQUEST_ENVIRONMENTS'
function requestEnvironments() {
    return {
        type: REQUEST_ENVIRONMENTS
    }
}
export const RECEIVE_ENVIRONMENTS = 'RECEIVE_ENVIRONMENTS'
function receiveEnvironments(json) {
    return {
        type: RECEIVE_ENVIRONMENTS,
        environments: json,
    }
}
export function fetchEnvironments() {
    return dispatch => {
        dispatch(requestEnvironments())
        return fetch('/api/v1/environments')
            .then(response => response.json())
            .then(json => dispatch(receiveEnvironments(json)))
    }
}
