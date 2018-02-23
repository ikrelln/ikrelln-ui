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
        return (
            <div>
                <TestResultFilter fetchAndFilterTestResults={this.props.fetchAndFilterTestResults} status={this.props.status_filter}/>
                {this.props.test_results.filter(tr => {
                    if (this.props.status_filter === "Any")
                        return true;
                    return (this.props.status_filter === tr.status);
                }).map(test_result => (
                    <TestResult key={test_result.trace_id} test_result={test_result} trace_id={test_result.trace_id}/>
                ))}
            </div>
        );
    }
}

export default TestResultsList;


export class TestResult extends Component {
    componentDidMount() {
        if (this.props.test_result === undefined) {
            this.props.fetchTestResultForTrace(this.props.trace_id);
        }
    }

    render() {
        if (this.props.test_result === undefined) {
            return (<Loading />);
        }

        let status_class = "alert" + statusToColorSuffix(this.props.test_result.status);

        return (
            <div className={"alert " + status_class}>
                <div style={{display: "flex", justifyContent: "space-around"}}>
                    <div style={{flex: "10"}}>
                        <Link className="alert-link" to={"/ikrelln/tests/" + this.props.test_result.test_id + "/results/" + this.props.test_result.trace_id}>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb" style={{padding: "0rem", margin: "0rem", backgroundColor: "inherit"}}>
                                    {this.props.test_result.path.map(item => (
                                        <li className="breadcrumb-item" key={item}>{item}</li>
                                    ))}
                                    <li className="breadcrumb-item">
                                        {this.props.test_result.name}
                                    </li>
                                </ol>
                            </nav>
                        </Link>
                    </div>
                    <div style={{flex: "2"}}>
                        {dateFormat(new Date(this.props.test_result.date / 1000), "isoDateTime")}
                    </div>
                    <div style={{flex: "1"}}>
                        {formatDuration(this.props.test_result.duration)}
                    </div>
                    <div style={{flex: "1"}}>
                        {this.props.test_result.environment}
                    </div>
                    {(this.props.compare_to !== undefined) && (this.props.compare_to !== this.props.test_result.trace_id) ? 
                        (<div style={{flex: "1"}}>
                            <Link to={"/ikrelln/tests/" + this.props.test_result.test_id + "/results/" + this.props.compare_to + "/compare/" + this.props.test_result.trace_id}>Compare to latest</Link>
                        </div>)
                        : null}
                </div>
            </div>
        );
    }
}

class TestResultFilter extends Component {
    constructor(props) {
        super(props);
    
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(event) {
        this.props.fetchAndFilterTestResults(event.target.value);
    }

    render() {
        return (
        <div>
            <div className="input-group mb-3">
            <div className="input-group-prepend">
                <label className="input-group-text">Filter by status</label>
            </div>
            <select className="custom-select" id="input-test-result-status-filter" onChange={this.handleChange} value={this.props.status}>
                <option>Any</option>
                <option>Success</option>
                <option>Failure</option>
                <option>Skipped</option>
            </select>
            </div>
        </div>);
    }
}