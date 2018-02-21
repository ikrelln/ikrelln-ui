import React, { Component } from 'react';
import Link from 'react-router-dom/Link';

class TestResultsList extends Component {
    render() {
        return (
            <ul>
                {this.props.testDetails.testResults.map(testResult => (
                    <TestResult key={testResult.trace_id} testResult={testResult} />
                ))}
            </ul>
        );
    }
}

export default TestResultsList;


class TestResult extends Component {
    render() {
        var status_class = "test-success";
        switch (this.props.testResult.status) {
            case "Failure":
                status_class = "test-failure";
                break;
            case "Skipped":
                status_class = "test-skipped";
                break;
        }
        return (
            <li>
                <Link className={status_class} to={"/tests/" + this.props.testResult.test_id + "/trace/" + this.props.testResult.trace_id}>{this.props.testResult.name}</Link>
            </li>
        );
    }
}