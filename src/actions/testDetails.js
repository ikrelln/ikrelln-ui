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

export const REQUEST_TEST_CHILDREN = 'REQUEST_TEST_CHILDREN'
function requestTestChildren() {
    return {
        type: REQUEST_TEST_CHILDREN
    }
}
export const RECEIVE_TEST_CHILDREN = 'RECEIVE_TEST_CHILDREN'
function receiveTestChildren(test_id, json) {
    return {
        type: RECEIVE_TEST_CHILDREN,
        children: {
            test_id,
            children: json
        },
        receivedAt: Date.now()
    }
}
export function fetchTestChildren(test_id) {
    return dispatch => {
        dispatch(requestTestChildren())
        return fetch('/api/v1/tests?parentId=' + test_id)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            })
            .then(response => response.json())
            .then(json => dispatch(receiveTestChildren(test_id, json)))
            .catch(() => {})
    }
}
