import { RECEIVE_TRACE, RECEIVE_TEST, RECEIVE_TEST_CHILDREN } from '../actions/testDetails';
import { sortBykey } from '../helper';

const sortByName = sortBykey("name");

const testDetails = (state = { traces: [], tests: [] }, action) => {
    switch (action.type) {
        case RECEIVE_TRACE:
            return Object.assign({}, state, {
                traces: [...state.traces, action.trace],
            })
        case RECEIVE_TEST:
            if (action.test.test.error === 'NotFound') {
                return state;
            }
            if ((action.test.test_id === 'root') && (action.test.test.test_id !== action.test.test_id)) {
                return Object.assign({}, state, {
                    tests: [...state.tests, {
                        test_id: 'root',
                        children: [
                            {
                                id: action.test.test.test_id,
                                name: action.test.test.name,
                            },
                        ],
                        path: [],
                        last_results: [],
                    }],
                })    
            }
            return Object.assign({}, state, {
                tests: [...state.tests, action.test.test],
            })
        case RECEIVE_TEST_CHILDREN:
            var new_tests = state.tests.slice();
            action.children.children.forEach(new_test => {
                if (state.tests.find(test => test.test_id === new_test.test_id) === undefined) {
                    new_tests.push(new_test);
                }
            });
            new_tests.sort(sortByName);
            return Object.assign({}, state, {
                tests: new_tests,
            })
        default:
            return state
    }
}

export default testDetails
