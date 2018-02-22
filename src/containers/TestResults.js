import { connect } from 'react-redux'
import TestResultsList from '../components/TestResults';
import { TestResult as component } from '../components/TestResults';
import { fetchTestResults, fetchTestResultForTrace } from '../actions/testDetails';

const mapStateToProps = state => {
    return {
        testDetails: state.testDetails
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTestResults: () => dispatch(fetchTestResults()),
    }
}

const TestResults = connect(
    mapStateToProps,
    mapDispatchToProps
)(TestResultsList)

export default TestResults

const mapStateToPropsTestResult = (state, props) => {
    return {
        testResult: state.testDetails.testResults.find(tr => tr.trace_id === props.trace_id),
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
