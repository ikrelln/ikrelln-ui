import { connect } from 'react-redux'
import TestSuiteList from '../components/TestSuiteList';

const mapStateToProps = state => {
    return {
        testSuites: state.testSuites
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}

const TestSuiteListFilter = connect(
    mapStateToProps,
    mapDispatchToProps
)(TestSuiteList)

export default TestSuiteListFilter
