import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import { Loading } from './Loading';
import dateFormat from 'dateformat';
import { formatDuration, statusToColorSuffix } from '../helper';

class TestResultsList extends Component {
    componentDidMount() {
        this.props.fetchTestResults();
    }

    render() {
        if (this.props.testDetails.testResults.length === 0) {
            return (<Loading />);
        }
        return (
            <div style={{margin: "20px"}}>
                {this.props.testDetails.testResults.map(testResult => (
                    <TestResult key={testResult.trace_id} testResult={testResult} />
                ))}
            </div>
        );
    }
}

export default TestResultsList;


export class TestResult extends Component {
    render() {
        if (this.props.testResult === undefined) {
            return null;
        }

        let status_class = "alert" + statusToColorSuffix(this.props.testResult.status);

        return (
            <div className={"alert " + status_class}>
                <div style={{display: "flex", justifyContent: "space-around"}}>
                    <div style={{flex: "10"}}>
                        <Link className="alert-link" to={"/tests/" + this.props.testResult.test_id + "/trace/" + this.props.testResult.trace_id}>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb" style={{padding: "0rem", margin: "0rem", backgroundColor: "inherit"}}>
                                    {this.props.testResult.path.map(item => (
                                        <li className="breadcrumb-item" key={item}>{item}</li>
                                    ))}
                                    <li className="breadcrumb-item">
                                        {this.props.testResult.name}
                                    </li>
                                </ol>
                            </nav>
                        </Link>
                    </div>
                    <div style={{flex: "2"}}>
                        {dateFormat(new Date(this.props.testResult.date / 1000), "isoDateTime")}
                    </div>
                    <div style={{flex: "1"}}>
                        {formatDuration(this.props.testResult.duration)}
                    </div>
                    <div style={{flex: "1"}}>
                        {this.props.testResult.environment}
                    </div>
                </div>
            </div>
        );
    }
}