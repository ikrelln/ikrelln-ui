import { connect } from 'react-redux'
import { TestTimeline as component } from '../components/TestTimeline';
import { fetchTestResults, fetchAndFilterTestResults, fetchEnvironments, clearFilterTestResults } from '../actions/testResults';
import { fetchTestResultForTrace } from '../actions/testDetails';

const mapStateToProps = (state, props) => {
    return {
        main_result: state.testResults.results.find(tr => tr.trace_id === props.trace_id),
        test_results: state.testResults.results,
        filter: state.testResults.filter,
        environments: state.testResults.environments,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTestResultForTrace: (trace_id) => dispatch(fetchTestResultForTrace(trace_id)),
        fetchTestResults: (status, environment, test_id, ts) => dispatch(fetchTestResults(status, environment, test_id, ts)),
        fetchAndFilterTestResults: (status, environment, test_id, ts) => dispatch(fetchAndFilterTestResults(status, environment, test_id, ts)),
        fetchEnvironments: () => dispatch(fetchEnvironments()),
        clearFilter: () => dispatch(clearFilterTestResults()),
    }
}

const TestTimeline = connect(
    mapStateToProps,
    mapDispatchToProps
)(component)

export default TestTimeline
