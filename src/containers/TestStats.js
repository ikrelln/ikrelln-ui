import { connect } from 'react-redux'
import { TestStats as component } from '../components/TestStats';
import { fetchTestResults, fetchEnvironments } from '../actions/testResults';

const mapStateToProps = (state, props) => {
    return {
        test_results: state.testResults.results.filter(tr => tr.test_id === props.test_id),
        environments: state.testResults.environments,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTestResults: (status, environment, test_id, ts) => dispatch(fetchTestResults(status, environment, test_id, ts)),
        fetchEnvironments: () => dispatch(fetchEnvironments()),
    }
}

const TestStats = connect(
    mapStateToProps,
    mapDispatchToProps
)(component)

export default TestStats
