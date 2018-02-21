export const REQUEST_TEST_SUITES = 'REQUEST_TEST_SUITES'
function requestTestSuites() {
    return {
        type: REQUEST_TEST_SUITES
    }
}

export const RECEIVE_TEST_SUITES = 'RECEIVE_TEST_SUITES'
function receiveTestSuites(json) {
    return {
        type: RECEIVE_TEST_SUITES,
        testSuites: json,
        receivedAt: Date.now()
    }
}

export function fetchTestSuites() {
    return dispatch => {
        dispatch(requestTestSuites())
        return fetch('/api/v1/tests')
            .then(response => response.json())
            .then(json => dispatch(receiveTestSuites(json)))
    }
}
