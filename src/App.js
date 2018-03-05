import React, { Component } from 'react';
import './App.css';
import { Route, Switch, NavLink, matchPath, Redirect } from 'react-router-dom';
import TestResults from './containers/TestResults';
import TestDetails from './containers/TestDetails';
import TraceRedirect from './containers/TraceRedirect';
import Reports from './containers/Reports';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">i'Krelln</h1>
        </header>
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <NavLink className="nav-link" to="/ikrelln/results">Results</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/ikrelln/tests/root" isActive={(match, location) => {
              let match_dynamic = matchPath(location.pathname, {
                path: '/ikrelln/tests/:test_id',
                exact: false,
                strict: false
              });
              return !!match_dynamic;
            }}>Tests</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/ikrelln/reports">Reports</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/ikrelln/setup">Set Up</NavLink>
          </li>
        </ul>
        <div className="App-body">
          <Switch>
            <Route path="/ikrelln/trace/:trace_id" render={({match}) => {
                return (<TraceRedirect trace_id={match.params.trace_id} />)
              }} />
            <Route path="/ikrelln/tests/:test_id" render={({match}) => {
              return (<TestDetails key={match.params.test_id} test_id={match.params.test_id} match={match} />)
            }} />
            <Route path="/ikrelln/results" component={TestResults} />
            <Route path="/ikrelln/reports" component={Reports} />
            <Route path="/ikrelln/setup" render={() => <h1>Setup</h1>} />
            <Route render={() => <Redirect to="/ikrelln/results" />} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
