export const REQUEST_TEST_COMPONENT = 'REQUEST_TEST_COMPONENT'
function requestTestComponent() {
    return {
        type: REQUEST_TEST_COMPONENT
    }
}
export const RECEIVE_TEST_COMPONENT = 'RECEIVE_TEST_COMPONENT'
function receiveTestComponent(json) {
    return {
        type: RECEIVE_TEST_COMPONENT,
        script: eval(json.source)
    }
}
export function fetchTestComponent() {
    return dispatch => {
        dispatch(requestTestComponent())
        return fetch('/api/v1/scripts/UITest')
            .then(response => response.json())
            .then(json => dispatch(receiveTestComponent(json)))
    }
}

export const REQUEST_RESULT_COMPONENT = 'REQUEST_RESULT_COMPONENT'
function requestResultComponent() {
    return {
        type: REQUEST_RESULT_COMPONENT
    }
}
export const RECEIVE_RESULT_COMPONENT = 'RECEIVE_RESULT_COMPONENT'
function receiveResultComponent(json) {
    return {
        type: RECEIVE_RESULT_COMPONENT,
        script: eval(json.source)
    }
}
export function fetchResultComponent() {
    return dispatch => {
        dispatch(requestResultComponent())
        return fetch('/api/v1/scripts/UITestResult')
            .then(response => response.json())
            .then(json => dispatch(receiveResultComponent(json)))
    }
}
