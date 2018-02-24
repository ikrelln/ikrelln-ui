import { connect } from 'react-redux'
import TestResultsList from '../components/TestResults';
import { fetchTestResults, fetchAndFilterTestResults, fetchEnvironments } from '../actions/testResults';

const mapStateToProps = state => {
    return {
        test_results: state.testResults.results,
        filter: state.testResults.filter,
        environments: state.testResults.environments,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTestResults: (status, environment, test_id) => dispatch(fetchTestResults(status, environment, test_id)),
        fetchAndFilterTestResults: (status, environment, test_id) => dispatch(fetchAndFilterTestResults(status, environment, test_id)),
        fetchEnvironments: () => dispatch(fetchEnvironments()),
    }
}

const TestResults = connect(
    mapStateToProps,
    mapDispatchToProps
)(TestResultsList)

export default TestResults
