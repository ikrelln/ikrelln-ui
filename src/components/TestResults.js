import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import { Loading } from './Loading';
import dateFormat from 'dateformat';
import { formatDuration, statusToColorSuffix } from '../helper';
import Datetime from 'react-datetime';

class TestResultsList extends Component {
    componentDidMount() {
        this.props.fetchTestResults(this.props.filter.status, this.props.filter.environment, this.props.test_id_filter);
        if (this.props.environments.length === 0) {
            this.props.fetchEnvironments();
        }
    }

    componentWillUnmount() {
        this.props.clearFilter();
    }

    render() {
        return (
            <div>
                <TestResultFilter fetchAndFilterTestResults={this.props.fetchAndFilterTestResults} environments={this.props.environments}
                    filter={{test_id: this.props.test_id_filter, ...this.props.filter}} />
                {this.props.test_results.filter(tr => {
                    if ((this.props.filter.status === undefined) || (this.props.filter.status === "Any"))
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
                }).filter(tr => {
                    if (this.props.filter.ts === undefined)
                        return true;
                    return (tr.date < this.props.filter.ts * 1000);
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
        this.handleTsChange = this.handleTsChange.bind(this);
    }
    
    handleStatusChange(event) {
        this.props.fetchAndFilterTestResults(event.target.value, this.props.filter.environment, this.props.filter.test_id, this.props.filter.ts);
    }

    handleEnvironmentChange(event) {
        this.props.fetchAndFilterTestResults(this.props.filter.status, event.target.value === "Any" ? undefined : event.target.value, this.props.filter.test_id, this.props.filter.ts);
    }

    handleTsChange(event) {
        this.setState({timestamp: event})
        this.props.fetchAndFilterTestResults(this.props.filter.status, this.props.filter.environment, this.props.filter.test_id, event);
    }

    render() {
        return (
            <div style={{display: "flex", marginBottom: "1rem", justifyContent: "left"}}>
                <div className="input-group" style={{margin: "0 1rem"}}>
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
                <div className="input-group" style={{margin: "0 1rem"}}>
                    <div className="input-group-prepend">
                        <label className="input-group-text">By Environment</label>
                    </div>
                    <select className="custom-select" id="input-test-result-status-filter" onChange={this.handleEnvironmentChange} value={this.props.filter.environment}>
                        <option>Any</option>
                        {this.props.environments.map(env => <option key={env}>{env}</option>)}
                    </select>
                </div>
                <div className="input-group" style={{margin: "0 1rem"}}>
                    <Datetime onBlur={(value) => this.handleTsChange(value.valueOf())} utc={true} className={"full-width"}
                        renderInput={(props, openCalendar, closeCalendar) => <DateInput props={props} openCalendar={openCalendar} value={this.props.filter.ts}/>}
                        dateFormat="DD/MM/YYYY" timeFormat="hh:mm:ss" viewMode="time" defaultValue={new Date()}/>
                </div>
        </div>);
    }
}

class DateInput extends Component {
    render() {
        return (
            <div className="input-group">
                <div className="input-group-prepend">
                    <label className="input-group-text">Started Before</label>
                </div>
                <input type="text" className="form-control" onClick={this.props.openCalendar} onChange={() => {}}
                    value={this.props.value === undefined ? "now" : dateFormat(new Date(this.props.value), "isoDateTime")} />
            </div>
        );
    }
}
