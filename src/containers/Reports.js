import { connect } from 'react-redux'
import { Reports as component } from '../components/Reports';
import { fetchReports, fetchReport } from '../actions/reports';


const mapStateToProps = (state, props) => {
    return {
        reports: state.reports.report_list,
        report_details: state.reports.report_details,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchReports: () => dispatch(fetchReports()),
        fetchReport: (group, name, environment) => dispatch(fetchReport(group, name, environment)),
    }
}

const Reports = connect(
    mapStateToProps,
    mapDispatchToProps
)(component)

export default Reports
