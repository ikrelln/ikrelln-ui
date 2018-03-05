import { RECEIVE_REPORTS, RECEIVE_REPORT } from "../actions/reports";


const reports = (state = { report_list: undefined }, action) => {
    switch (action.type) {
        case RECEIVE_REPORTS:
            return Object.assign({}, state, {
                report_list: action.reports
            })
        case RECEIVE_REPORT:
            var test = {};
            test[action.report.name] = action.report;
            return Object.assign({}, state, {
                report_details: Object.assign({}, state.report_details, test)
            })
        default:
            return state
    }
}

export default reports
