import { combineReducers } from 'redux'
import testSuites from './testSuites'
import testDetails from './testDetails'

const iKrelln = combineReducers({
    testSuites,
    testDetails,
})

export default iKrelln
