import { combineReducers } from 'redux'
import testDetails from './testDetails'
import testResults from './testResults'

const iKrelln = combineReducers({
    testDetails,
    testResults,
})

export default iKrelln
