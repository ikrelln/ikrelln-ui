import { RECEIVE_TEST_COMPONENT, RECEIVE_RESULT_COMPONENT } from "../actions/custom";


const custom = (state = { test_component: undefined, result_component: undefined }, action) => {
    switch (action.type) {
        case RECEIVE_TEST_COMPONENT:
            return Object.assign({}, state, {
                test_component: action.script,
            })
        case RECEIVE_RESULT_COMPONENT:
            return Object.assign({}, state, {
                result_component: action.script,
            })
        default:
            return state
    }
}

export default custom
