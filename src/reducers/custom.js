import { RECEIVE_TEST_COMPONENT, RECEIVE_RESULT_COMPONENT } from "../actions/custom";


const custom = (state = { test_component: undefined, result_component: undefined }, action) => {
    switch (action.type) {
        case RECEIVE_TEST_COMPONENT:
            if (action.script === undefined) {
                return state;
            }
            return Object.assign({}, state, {
                test_component: (test) => {
                    return {
                        __html: action.script(test),
                    };
                },
            })
        case RECEIVE_RESULT_COMPONENT:
            if (action.script === undefined) {
                return state;
            }
            return Object.assign({}, state, {
                result_component: (result, spans) => {
                    return {
                        __html: action.script(result, spans),
                    };
                },
            })
        default:
            return state
    }
}

export default custom
