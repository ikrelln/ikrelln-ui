import { connect } from 'react-redux'
import { TestDetails as component } from '../components/TestDetails';
import { fetchTest, fetchTrace, fetchTestResultForTrace } from '../actions/testDetails';

const mapStateToProps = (state, props) => {
    return {
        test: state.testDetails.tests.find(td => td.test_id === props.test_id),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTest: (test_id) => dispatch(fetchTest(test_id)),
        fetchTrace: (trace_id) => dispatch(fetchTrace(trace_id)),
        fetchTestResult: (trace_id) => dispatch(fetchTestResultForTrace(trace_id))
    }
}

const TestDetails = connect(
    mapStateToProps,
    mapDispatchToProps
)(component)

export default TestDetails
