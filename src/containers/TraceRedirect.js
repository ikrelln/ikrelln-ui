import { connect } from 'react-redux'
import { TraceRedirect as component } from '../components/TraceRedirect';
import { fetchTestResultForTrace } from '../actions/testDetails';

const mapStateToProps = (state, props) => {
    return {
        testResult: state.testDetails.testResults.find(tr => tr.trace_id === props.trace_id),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTestResultForTrace: (trace_id) => dispatch(fetchTestResultForTrace(trace_id)),
    }
}

const TraceRedirect = connect(
    mapStateToProps,
    mapDispatchToProps
)(component)

export default TraceRedirect
