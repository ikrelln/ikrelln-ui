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
            <div>
                {this.props.testDetails.testResults.map(testResult => (
                    <TestResult key={testResult.trace_id} testResult={testResult} trace_id={testResult.trace_id}/>
                ))}
            </div>
        );
    }
}

export default TestResultsList;


export class TestResult extends Component {
    componentDidMount() {
        if (this.props.testResult === undefined) {
            this.props.fetchTestResultForTrace(this.props.trace_id);
        }
    }

    render() {
        if (this.props.testResult === undefined) {
            return (<Loading />);
        }

        let status_class = "alert" + statusToColorSuffix(this.props.testResult.status);

        return (
            <div className={"alert " + status_class}>
                <div style={{display: "flex", justifyContent: "space-around"}}>
                    <div style={{flex: "10"}}>
                        <Link className="alert-link" to={"/ikrelln/tests/" + this.props.testResult.test_id + "/traces/" + this.props.testResult.trace_id}>
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
                    {(this.props.compare_to !== undefined) && (this.props.compare_to !== this.props.testResult.trace_id) ? 
                        (<div style={{flex: "1"}}>
                            <Link to={"/ikrelln/tests/" + this.props.testResult.test_id + "/traces/" + this.props.compare_to + "/compare/" + this.props.testResult.trace_id}>Compare to latest</Link>
                        </div>)
                        : null}
                </div>
            </div>
        );
    }
}