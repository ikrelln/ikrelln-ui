import { connect } from 'react-redux'
import TestResultsList from '../components/TestResults';
import { TestResult as component } from '../components/TestResults';
import { fetchTestResultForTrace } from '../actions/testDetails';
import { fetchTestResults, fetchAndFilterTestResults } from '../actions/testResults';

const mapStateToProps = state => {
    return {
        test_results: state.testResults.results,
        status_filter: state.testResults.status_filter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTestResults: () => dispatch(fetchTestResults()),
        fetchAndFilterTestResults: (status) => dispatch(fetchAndFilterTestResults(status))
    }
}

const TestResults = connect(
    mapStateToProps,
    mapDispatchToProps
)(TestResultsList)

export default TestResults

const mapStateToPropsTestResult = (state, props) => {
    return {
        testResult: state.testResults.results.find(tr => tr.trace_id === props.trace_id),
    }
}
const mapDispatchToPropsTestResult = dispatch => {
    return {
        fetchTestResultForTrace: (trace_id) => dispatch(fetchTestResultForTrace(trace_id)),
    }
}
export const TestResult = connect(
    mapStateToPropsTestResult,
    mapDispatchToPropsTestResult
)(component)
