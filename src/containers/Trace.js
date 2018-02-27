import { connect } from 'react-redux'
import { Trace as component, TraceComparator as componentTraceComparator } from '../components/Trace';
import { fetchTestResultForTrace, fetchTrace } from '../actions/testDetails';

const mapStateToProps = (state, props) => {
    return {
        spans: state.testDetails.traces.find(tr => tr.trace_id === props.trace_id),
        result: state.testResults.results.find(tr => tr.trace_id === props.trace_id),
        custom_component: state.custom.result_component,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTrace: (trace_id) => dispatch(fetchTrace(trace_id)),
        fetchTestResultForTrace: (trace_id) => dispatch(fetchTestResultForTrace(trace_id))
    }
}

const Trace = connect(
    mapStateToProps,
    mapDispatchToProps
)(component)

export default Trace

const mapStateToPropsTraceComparator = (state, props) => {
    return {
        spansBase: state.testDetails.traces.find(tr => tr.trace_id === props.base),
        testResultBase: state.testResults.results.find(tr => tr.trace_id === props.base),
        spansWith: state.testDetails.traces.find(tr => tr.trace_id === props.with),
        testResultWith: state.testResults.results.find(tr => tr.trace_id === props.with),
    }
}
const mapDispatchToPropsTraceComparator = dispatch => {
    return {
        fetchTrace: (trace_id) => dispatch(fetchTrace(trace_id)),
        fetchTestResultForTrace: (trace_id) => dispatch(fetchTestResultForTrace(trace_id))
    }
}
export const TraceComparator = connect(
    mapStateToPropsTraceComparator,
    mapDispatchToPropsTraceComparator
)(componentTraceComparator)
