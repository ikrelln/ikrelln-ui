import { combineReducers } from 'redux'
import custom from './custom'
import testDetails from './testDetails'
import testResults from './testResults'

const iKrelln = combineReducers({
    custom,
    testDetails,
    testResults,
})

export default iKrelln
