import React, { Component } from 'react';
import './App.css';
import TestSuiteFilter from './containers/TestSuiteFilter';
import Link from 'react-router-dom/Link';
import { Route, Switch } from 'react-router-dom';
import TestResults from './containers/TestResults';
import TestDetails from './containers/TestDetails';
import TraceRedirect from './containers/TraceRedirect';
import { fetchTest, fetchTestResultForTrace } from './actions/testDetails';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">i'Krelln</h1>
        </header>
        <Link to="/results">Results</Link> - <Link to="/tests">Tests</Link> - <Link to="/setup">Set Up</Link>
        <Switch>
          <Route path="/trace/:trace_id" render={({match}) => {
              this.props.store.dispatch(fetchTestResultForTrace(match.params.trace_id));
              return (<TraceRedirect trace_id={match.params.trace_id} />)
            }} />
          <Route path="/tests/:test_id" render={({match}) => {
            this.props.store.dispatch(fetchTest(match.params.test_id));
            return (<TestDetails test_id={match.params.test_id} match={match} />)
          }} />
          <Route path="/results" component={TestResults} />
          <Route path="/tests" component={TestSuiteFilter} />
          <Route path="/setup" render={() => <h1>setup</h1>} />
          <Route component={TestResults} />
        </Switch>
      </div>
    );
  }
}

export default App;
