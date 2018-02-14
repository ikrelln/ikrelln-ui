import React, { Component } from 'react';
import './App.css';
import TestSuiteFilter from './containers/TestSuiteFilter';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">i'Krelln</h1>
        </header>
        <TestSuiteFilter />
      </div>
    );
  }
}

export default App;
