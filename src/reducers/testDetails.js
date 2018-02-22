import { RECEIVE_TRACE, RECEIVE_TEST } from '../actions/testDetails';

const testDetails = (state = { traces: [], tests: [] }, action) => {
    switch (action.type) {
        case RECEIVE_TRACE:
            return Object.assign({}, state, {
                traces: [...state.traces, action.trace],
            })
        case RECEIVE_TEST:
            return Object.assign({}, state, {
                tests: [...state.tests, action.test],
            })
        default:
            return state
    }
}

export default testDetails
