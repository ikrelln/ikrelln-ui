import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import { Loading } from './Loading';
import dateFormat from 'dateformat';
import { formatDuration, statusToColorSuffix } from '../helper';

class TestResultsList extends Component {
    componentDidMount() {
        this.props.fetchTestResults(this.props.filter.status, this.props.filter.environment, this.props.test_id_filter);
        if (this.props.environments.length === 0) {
            this.props.fetchEnvironments();
        }
    }

    render() {
        return (
            <div>
                <TestResultFilter fetchAndFilterTestResults={this.props.fetchAndFilterTestResults} environments={this.props.environments}
                    filter={{test_id: this.props.test_id_filter, ...this.props.filter}} />
                {this.props.test_results.filter(tr => {
                    if (this.props.filter.status === "Any")
                        return true;
                    return (this.props.filter.status === tr.status);
                }).filter(tr => {
                    if (this.props.filter.environment === undefined)
                        return true;
                    return (this.props.filter.environment === tr.environment);
                }).filter(tr => {
                    if (this.props.test_id_filter === undefined)
                        return true;
                    return (tr.test_id === this.props.test_id_filter);
                }).map(test_result => (
                    <TestResult key={test_result.trace_id} test_result={test_result} trace_id={test_result.trace_id} compare_to={this.props.compare_to} />
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
                    {(this.props.compare_to !== undefined) && (this.props.compare_to.trace_id !== this.props.test_result.trace_id) ? 
                        (<div style={{flex: "1"}}>
                            <Link to={"/ikrelln/tests/" + this.props.test_result.test_id + "/results/" + this.props.compare_to.trace_id + "/compare/" + this.props.test_result.trace_id}>Compare to {this.props.compare_to.name}</Link>
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
    
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleEnvironmentChange = this.handleEnvironmentChange.bind(this);
    }
    
    handleStatusChange(event) {
        this.props.fetchAndFilterTestResults(event.target.value, this.props.filter.environment, this.props.filter.test_id);
    }

    handleEnvironmentChange(event) {
        this.props.fetchAndFilterTestResults(this.props.filter.status, event.target.value === "Any" ? undefined : event.target.value, this.props.filter.test_id);
    }

    render() {
        return (
        <div style={{display: "flex"}}>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <label className="input-group-text">By Status</label>
                </div>
                <select className="custom-select" id="input-test-result-status-filter" onChange={this.handleStatusChange} value={this.props.filter.status}>
                    <option>Any</option>
                    <option>Success</option>
                    <option>Failure</option>
                    <option>Skipped</option>
                </select>
            </div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <label className="input-group-text">By Environment</label>
                </div>
                <select className="custom-select" id="input-test-result-status-filter" onChange={this.handleEnvironmentChange} value={this.props.filter.environment}>
                    <option>Any</option>
                    {this.props.environments.map(env => <option key={env}>{env}</option>)}
                </select>
            </div>
        </div>);
    }
}