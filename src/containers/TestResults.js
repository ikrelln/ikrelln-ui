import { connect } from 'react-redux'
import TestResultsList from '../components/TestResults';
import { fetchTestResults, fetchAndFilterTestResults, fetchEnvironments, clearFilterTestResults } from '../actions/testResults';

const mapStateToProps = state => {
    return {
        test_results: state.testResults.results,
        filter: state.testResults.filter,
        environments: state.testResults.environments,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTestResults: (status, environment, test_id, ts) => dispatch(fetchTestResults(status, environment, test_id, ts)),
        fetchAndFilterTestResults: (status, environment, test_id, ts) => dispatch(fetchAndFilterTestResults(status, environment, test_id, ts)),
        fetchEnvironments: () => dispatch(fetchEnvironments()),
        clearFilter: () => dispatch(clearFilterTestResults()),
    }
}

const TestResults = connect(
    mapStateToProps,
    mapDispatchToProps
)(TestResultsList)

export default TestResults
