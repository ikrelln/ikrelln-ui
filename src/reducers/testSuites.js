import { REQUEST_TEST_SUITES, RECEIVE_TEST_SUITES } from '../actions/testSuites';


const testSuites = (state = { testSuites: [] }, action) => {
    switch (action.type) {
        case REQUEST_TEST_SUITES:
            return Object.assign({}, state, {
                isFetching: true,
            })
        case RECEIVE_TEST_SUITES:
            return Object.assign({}, state, {
                isFetching: false,
                testSuites: action.testSuites,
                lastUpdated: action.receivedAt
            })
        default:
            return state
    }
}

export default testSuites
