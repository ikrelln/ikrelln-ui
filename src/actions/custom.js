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
        // eslint-disable-next-line
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
        // eslint-disable-next-line
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

export const REQUEST_SCRIPTS = 'REQUEST_SCRIPTS'
function requestScripts() {
    return {
        type: REQUEST_SCRIPTS
    }
}
export const RECEIVE_SCRIPTS = 'RECEIVE_SCRIPTS'
function receiveScripts(json) {
    return {
        type: RECEIVE_SCRIPTS,
        scripts: json
    }
}
export function fetchScripts() {
    return dispatch => {
        dispatch(requestScripts())
        return fetch('/api/v1/scripts')
            .then(response => response.json())
            .then(json => dispatch(receiveScripts(json)))
    }
}

export const REQUEST_SAVE_SCRIPT = 'REQUEST_SAVE_SCRIPT'
function requestSaveScript() {
    return {
        type: REQUEST_SAVE_SCRIPT
    }
}
export const RECEIVE_SAVE_SCRIPT = 'RECEIVE_SAVE_SCRIPT'
function receiveSaveScript() {
    return {
        type: RECEIVE_SAVE_SCRIPT,
    }
}
export function saveScript(script) {
    return dispatch => {
        dispatch(requestSaveScript())
        return fetch('/api/v1/scripts', {
                body: JSON.stringify(script),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
            })
            .then(response => response.json())
            .then(json => dispatch(receiveSaveScript(json)))
            .then(dispatch(fetchScripts()))
    }
}

export const REQUEST_DELETE_SCRIPT = 'REQUEST_DELETE_SCRIPT'
function requestDeleteScript() {
    return {
        type: REQUEST_DELETE_SCRIPT
    }
}
export const RECEIVE_DELETE_SCRIPT = 'RECEIVE_DELETE_SCRIPT'
function receiveDeleteScript() {
    return {
        type: RECEIVE_DELETE_SCRIPT,
    }
}
export function deleteScript(script_id) {
    return dispatch => {
        dispatch(requestDeleteScript())
        return fetch('/api/v1/scripts/' + script_id, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(json => dispatch(receiveDeleteScript(json)))
            .then(dispatch(fetchScripts()))
    }
}

export const REQUEST_UPDATE_SCRIPT = 'REQUEST_UPDATE_SCRIPT'
function requestUpdateScript() {
    return {
        type: REQUEST_UPDATE_SCRIPT
    }
}
export const RECEIVE_UPDATE_SCRIPT = 'RECEIVE_UPDATE_SCRIPT'
function receiveUpdateScript() {
    return {
        type: RECEIVE_UPDATE_SCRIPT,
    }
}
export function updateScript(script) {
    return dispatch => {
        dispatch(requestUpdateScript())
        return fetch('/api/v1/scripts/' + script.id, {
                body: JSON.stringify(script),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'PUT',
            })
            .then(response => response.json())
            .then(json => dispatch(receiveUpdateScript(json)))
            .then(dispatch(fetchScripts()))
    }
}
