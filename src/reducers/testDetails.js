import { RECEIVE_TEST_RESULTS, RECEIVE_TEST_RESULT_FOR_TRACE, RECEIVE_TRACE, RECEIVE_TEST } from '../actions/testDetails';

const sortByDate = (a, b) => {
    if (a['date'] < b['date'])
        return 1;
    if (a['date'] === b['date'])
        return 0;
    return -1;
};

const testDetails = (state = { testResults: [], traces: [], tests: [] }, action) => {
    switch (action.type) {
        case RECEIVE_TEST_RESULTS:
            var new_test_results = state.testResults.slice();
            action.testResults.forEach(new_tr => {
                if (state.testResults.find(tr => tr.trace_id === new_tr.trace_id) === undefined) {
                    new_test_results.push(new_tr);
                }
            });
            new_test_results.sort(sortByDate);
            return Object.assign({}, state, {
                testResults: new_test_results,
            })
        case RECEIVE_TEST_RESULT_FOR_TRACE:
            if (state.testResults.find(tr => tr.trace_id === action.testResult[0].trace_id) !== undefined) {
                return state;
            }
            var new_test_results = [...state.testResults, action.testResult[0]];
            new_test_results.sort(sortByDate);
            return Object.assign({}, state, {
                testResults: new_test_results,
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
