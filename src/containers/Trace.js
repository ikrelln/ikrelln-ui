import { connect } from 'react-redux'
import { Trace as component } from '../components/Trace';

const mapStateToProps = (state, props) => {
    return {
        spans: state.testDetails.traces.find(tr => tr.trace_id === props.trace_id),
        testResult: state.testDetails.testResults.find(tr => tr.trace_id === props.trace_id),
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}

const Trace = connect(
    mapStateToProps,
    mapDispatchToProps
)(component)

export default Trace
