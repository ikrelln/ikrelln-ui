import { connect } from 'react-redux'
import { Reports as component } from '../components/Reports';
import { fetchReports, fetchReport } from '../actions/reports';
import { fetchEnvironments } from '../actions/testResults';


const mapStateToProps = (state, props) => {
    return {
        reports: state.reports.report_list,
        report_details: state.reports.report_details,
        environments: state.testResults.environments,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchReports: () => dispatch(fetchReports()),
        fetchReport: (name, environment) => dispatch(fetchReport(name, environment)),
        fetchEnvironments: () => dispatch(fetchEnvironments()),
    }
}

const Reports = connect(
    mapStateToProps,
    mapDispatchToProps
)(component)

export default Reports
