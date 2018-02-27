import { connect } from 'react-redux'
import { TestDetails as component } from '../components/TestDetails';
import { fetchTest, fetchTestChildren, fetchTrace, fetchTestResultForTrace } from '../actions/testDetails';

const mapStateToProps = (state, props) => {
    return {
        test: state.testDetails.tests.find(td => td.test_id === props.test_id),
        children: state.testDetails.tests.filter(td => 
            props.test_id === "root" ? td.path.length === 0
                : td.path.find(p => p.id === props.test_id) !== undefined),
        custom_component: state.custom.test_component,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTest: (test_id) => dispatch(fetchTest(test_id)),
        fetchTestChildren: (test_id) => dispatch(fetchTestChildren(test_id)),
        fetchTrace: (trace_id) => dispatch(fetchTrace(trace_id)),
        fetchTestResult: (trace_id) => dispatch(fetchTestResultForTrace(trace_id))
    }
}

const TestDetails = connect(
    mapStateToProps,
    mapDispatchToProps
)(component)

export default TestDetails
