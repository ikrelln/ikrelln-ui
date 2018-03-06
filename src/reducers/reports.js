import { RECEIVE_REPORTS, RECEIVE_REPORT } from "../actions/reports";


const reports = (state = { report_list: undefined }, action) => {
    switch (action.type) {
        case RECEIVE_REPORTS:
            return Object.assign({}, state, {
                report_list: action.reports
            })
        case RECEIVE_REPORT:
            var new_report = {};
            new_report[action.environment + "-" + action.report.name] = action.report;
            return Object.assign({}, state, {
                report_details: Object.assign({}, state.report_details, new_report)
            })
        default:
            return state
    }
}

export default reports
