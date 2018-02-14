import React, { Component } from 'react';
import TestSuite from './TestSuite';

class TestSuiteList extends Component {
    render() {
        return (
            <ul>
                {this.props.testSuites.testSuites.map(testSuite => (
                    <TestSuite key={testSuite.id} name={testSuite.name} />
                ))}
            </ul>
        );
    }
}

export default TestSuiteList;
