import { RECEIVE_TEST_RESULT_FOR_TRACE } from '../actions/testDetails';
import { RECEIVE_TEST_RESULTS, RECEIVE_ENVIRONMENTS, FILTER_TEST_RESULTS, CLEAR_FILTER_TEST_RESULTS } from '../actions/testResults';
import { sortBykey } from '../helper';

const sortByDate = sortBykey("date");

const testResults = (state = { results: [], environments: [], filter: {} }, action) => {
    switch (action.type) {
        case RECEIVE_TEST_RESULTS:
            var new_test_results = state.results.slice();
            action.results.forEach(new_tr => {
                if (state.results.find(tr => tr.trace_id === new_tr.trace_id) === undefined) {
                    new_test_results.push(new_tr);
                }
            });
            new_test_results.sort(sortByDate);
            return Object.assign({}, state, {
                results: new_test_results.filter(tr => tr !== undefined),
            })
        case RECEIVE_TEST_RESULT_FOR_TRACE:
            if (state.results.find(tr => tr.trace_id === action.testResult[0].trace_id) !== undefined) {
                return state;
            }
            var new_test_results = [...state.results, action.testResult[0]];
            new_test_results.sort(sortByDate);
            return Object.assign({}, state, {
                results: new_test_results.filter(tr => tr !== undefined),
            })
        case FILTER_TEST_RESULTS:
            return Object.assign({}, state, {
                filter: action.filter,
            })
        case CLEAR_FILTER_TEST_RESULTS:
            return Object.assign({}, state, {
                filter: {},
            })
        case RECEIVE_ENVIRONMENTS:
            return Object.assign({}, state, {
                environments: action.environments,
            })
        default:
            return state
    }
}

export default testResults
