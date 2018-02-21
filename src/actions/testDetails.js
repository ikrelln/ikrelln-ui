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
        testResults: json,
        receivedAt: Date.now()
    }
}
export function fetchTestResults() {
    return dispatch => {
        dispatch(requestTestResults())
        return fetch('/api/v1/testresults')
            .then(response => response.json())
            .then(json => dispatch(receiveTestResults(json)))
    }
}

export const REQUEST_TEST_RESULT_FOR_TRACE = 'REQUEST_TEST_RESULT_FOR_TRACE'
function requestTestResultForTrace() {
    return {
        type: REQUEST_TEST_RESULT_FOR_TRACE
    }
}
export const RECEIVE_TEST_RESULT_FOR_TRACE = 'RECEIVE_TEST_RESULT_FOR_TRACE'
function receiveTestResultForTrace(trace_id, json) {
    return {
        type: RECEIVE_TEST_RESULT_FOR_TRACE,
        testResult: json,
        traceId: trace_id,
    }
}
export function fetchTestResultForTrace(trace_id) {
    return dispatch => {
        dispatch(requestTestResultForTrace())
        return fetch('/api/v1/testresults?traceId=' + trace_id)
            .then(response => response.json())
            .then(json => dispatch(receiveTestResultForTrace(trace_id, json)))
    }
}

export const REQUEST_TRACE = 'REQUEST_TRACE'
function requestTrace() {
    return {
        type: REQUEST_TRACE
    }
}
export const RECEIVE_TRACE = 'RECEIVE_TRACE'
function receiveTrace(trace_id, json) {
    return {
        type: RECEIVE_TRACE,
        trace: {
            trace_id,
            spans: json
        },
        receivedAt: Date.now()
    }
}
export function fetchTrace(trace_id) {
    return dispatch => {
        dispatch(requestTrace())
        return fetch('/api/v1/trace/' + trace_id)
            .then(response => response.json())
            .then(json => dispatch(receiveTrace(trace_id, json)))
    }
}

export const REQUEST_TEST = 'REQUEST_TEST'
function requestTest() {
    return {
        type: REQUEST_TEST
    }
}
export const RECEIVE_TEST = 'RECEIVE_TEST'
function receiveTest(test_id, json) {
    return {
        type: RECEIVE_TEST,
        test: {
            test_id,
            test: json
        },
        receivedAt: Date.now()
    }
}
export function fetchTest(test_id) {
    return dispatch => {
        dispatch(requestTest())
        return fetch('/api/v1/tests/' + test_id)
            .then(response => response.json())
            .then(json => dispatch(receiveTest(test_id, json)))
    }
}
