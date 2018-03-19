import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import { Loading } from './Loading';
import dateFormat from 'dateformat';
import { formatDuration, statusToColorSuffix } from '../helper';

export class TestTimeline extends Component {
    componentDidMount() {
        this.props.fetchTestResults(this.props.filter.status, this.props.filter.environment, this.props.test_id_filter);
        if (this.props.environments.length === 0) {
            this.props.fetchEnvironments();
        }
        if (this.props.main_result === undefined) {
            this.props.fetchTestResultForTrace(this.props.trace_id);
        }
    }

    componentWillUnmount() {
        this.props.clearFilter();
    }

    render() {
        if (this.props.main_result === undefined)
            return <Loading />

        const delta = this.props.main_result.duration * 0.25;
        const startTime = this.props.main_result.date - delta;
        const endTime = this.props.main_result.date + this.props.main_result.duration + delta;

        return (
            <div>
                <TestResultFilter fetchAndFilterTestResults={this.props.fetchAndFilterTestResults} environments={this.props.environments}
                    filter={{test_id: this.props.test_id_filter, ...this.props.filter}} />
                <TestResultInTime key={this.props.main_result.trace_id} test_result={this.props.main_result} trace_id={this.props.main_result.trace_id}
                            globalStartTime={startTime} globalEndTime={endTime} />
                <hr />
                {this.props.test_results.filter(tr => {
                    if (this.props.filter.environment === undefined)
                        return true;
                    return (this.props.filter.environment === tr.environment);
                }).filter(tr => {
                    return tr.trace_id !== this.props.main_result.trace_id;
                }).filter(tr => {
                    return tr.date > (startTime);
                }).filter(tr => {
                    return tr.date < (endTime);
                }).filter(tr => {
                    return tr.status !== "Skipped"
                }).reverse().map(test_result => (
                    <TestResultInTime key={test_result.trace_id} test_result={test_result} trace_id={test_result.trace_id}
                            globalStartTime={startTime} globalEndTime={endTime} />
                ))}
            </div>
        );
    }
}

class TestResultInTime extends Component {
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

        const globalDuration = this.props.globalEndTime - this.props.globalStartTime;
        const left = Math.max((this.props.test_result.date - this.props.globalStartTime) / globalDuration * 100, 0);
        const width = Math.min(Math.max(this.props.test_result.duration / globalDuration * 100, 0.2), 100 - left);

        return (
            <div className={"alert " + status_class} style={{left: left + "%", width: width + "%"}}>
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
                </div>
            </div>
        );
    }
}

class TestResultFilter extends Component {
    constructor(props) {
        super(props);
    
        this.handleEnvironmentChange = this.handleEnvironmentChange.bind(this);
    }
    
    handleEnvironmentChange(event) {
        this.props.fetchAndFilterTestResults(this.props.filter.status, event.target.value === "Any" ? undefined : event.target.value, this.props.filter.test_id, this.props.filter.ts);
    }

    render() {
        return (
            <div style={{display: "flex", marginBottom: "1rem", justifyContent: "left"}}>
                <div className="input-group" style={{margin: "0 1rem"}}>
                    <div className="input-group-prepend">
                        <label className="input-group-text">By Environment</label>
                    </div>
                    <select className="custom-select" id="input-test-result-status-filter" onChange={this.handleEnvironmentChange} value={this.props.filter.environment}>
                        <option>Any</option>
                        {this.props.environments.map(env => <option key={env}>{env}</option>)}
                    </select>
                </div>
            </div>
        );
    }
}
