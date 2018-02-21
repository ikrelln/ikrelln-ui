import { connect } from 'react-redux'
import { TestDetails as component } from '../components/TestDetails';
import { fetchTrace, fetchTestResultForTrace } from '../actions/testDetails';

const mapStateToProps = (state, props) => {
    return {
        test: state.testDetails.tests.find(tr => tr.test_id === props.test_id),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTrace: (trace_id) => dispatch(fetchTrace(trace_id)),
        fetchTestResult: (trace_id) => dispatch(fetchTestResultForTrace(trace_id))
    }
}

const TestDetails = connect(
    mapStateToProps,
    mapDispatchToProps
)(component)

export default TestDetails
