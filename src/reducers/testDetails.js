import { REQUEST_TEST_RESULTS, RECEIVE_TEST_RESULTS, RECEIVE_TEST_RESULT_FOR_TRACE, RECEIVE_TRACE, RECEIVE_TEST } from '../actions/testDetails';


const testDetails = (state = { testResults: [], traces: [], tests: [] }, action) => {
    switch (action.type) {
        case REQUEST_TEST_RESULTS:
            return Object.assign({}, state, {
                isFetching: true,
            })
        case RECEIVE_TEST_RESULTS:
            return Object.assign({}, state, {
                isFetching: false,
                testResults: action.testResults,
                lastUpdated: action.receivedAt
            })
        case RECEIVE_TEST_RESULT_FOR_TRACE:
            if (state.testResults.find(tr => tr.trace_id === action.testResult[0].trace_id) !== undefined) {
                return state;
            }
            return Object.assign({}, state, {
                testResults: [...state.testResults, action.testResult[0]],
            })
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
