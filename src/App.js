import React, { Component } from 'react';
import './App.css';
import { Route, Switch, NavLink, matchPath } from 'react-router-dom';
import TestResults from './containers/TestResults';
import TestDetails from './containers/TestDetails';
import TraceRedirect from './containers/TraceRedirect';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">i'Krelln</h1>
        </header>
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <NavLink className="nav-link" to="/results">Results</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/tests/root" isActive={(match, location) => {
              let match_dynamic = matchPath(location.pathname, {
                path: '/tests/:test_id',
                exact: false,
                strict: false
              });
              return !!match_dynamic;
            }}>Tests</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/reports">Reports</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/setup">Set Up</NavLink>
          </li>
        </ul>
        <div>
          <Switch>
            <Route path="/trace/:trace_id" render={({match}) => {
                return (<TraceRedirect trace_id={match.params.trace_id} />)
              }} />
            <Route path="/tests/:test_id" render={({match}) => {
              return (<TestDetails key={match.params.test_id} test_id={match.params.test_id} match={match} />)
            }} />
            <Route path="/results" component={TestResults} />
            <Route path="/reports" render={() => <h1>Reports</h1>} />
            <Route path="/setup" render={() => <h1>Setup</h1>} />
            <Route component={TestResults} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
