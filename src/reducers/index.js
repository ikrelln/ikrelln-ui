import { combineReducers } from 'redux'
import custom from './custom'
import testDetails from './testDetails'
import testResults from './testResults'
import reports from './reports'

const iKrelln = combineReducers({
    custom,
    testDetails,
    testResults,
    reports,
})

export default iKrelln
