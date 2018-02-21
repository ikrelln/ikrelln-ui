import { connect } from 'react-redux'
import TestResultsList from '../components/TestResults';

const mapStateToProps = state => {
    return {
        testDetails: state.testDetails
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}

const TestResults = connect(
    mapStateToProps,
    mapDispatchToProps
)(TestResultsList)

export default TestResults
