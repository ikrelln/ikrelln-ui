import { connect } from 'react-redux'
import TestResultsList from '../components/TestResults';
import { fetchTestResults, fetchAndFilterTestResults } from '../actions/testResults';

const mapStateToProps = state => {
    return {
        test_results: state.testResults.results,
        status_filter: state.testResults.status_filter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTestResults: (status, test_id) => dispatch(fetchTestResults(status, test_id)),
        fetchAndFilterTestResults: (status) => dispatch(fetchAndFilterTestResults(status))
    }
}

const TestResults = connect(
    mapStateToProps,
    mapDispatchToProps
)(TestResultsList)

export default TestResults
