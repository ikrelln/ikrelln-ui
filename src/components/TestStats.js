import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import { Loading } from './Loading';
import dateFormat from 'dateformat';
import { formatDuration, statusToColorSuffix } from '../helper';
import Datetime from 'react-datetime';

export class TestStats extends Component {
    componentDidMount() {
        this.props.fetchTestResults(undefined, undefined, this.props.test_id);
        if (this.props.environments.length === 0) {
            this.props.fetchEnvironments();
        }
    }

    render() {
        const active_envs = [...new Set(this.props.test_results.map(tr => tr.environment))].sort();
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex"}}>
                    <div style={{flex: "1"}}></div>
                    <div style={{flex: "2", fontStyle: "italic"}}>Global</div>
                    <div style={{flex: "2", fontStyle: "italic"}}>Last Month</div>
                    <div style={{flex: "2", fontStyle: "italic"}}>Last Week</div>
                    <div style={{flex: "2", fontStyle: "italic"}}>Last Day</div>
                </div>
                {active_envs.map(env => 
                    <div key={env} style={{display: "flex"}}>
                        <div style={{flex: "1", alignSelf: "center", fontStyle: "italic"}}>{env}</div>
                        <TestStatsPerEnvPerPeriod test_results={this.props.test_results} environment={env} />
                        <TestStatsPerEnvPerPeriod test_results={this.props.test_results} environment={env} hours_to_keep={24 * 30} />
                        <TestStatsPerEnvPerPeriod test_results={this.props.test_results} environment={env} hours_to_keep={24 * 7} />
                        <TestStatsPerEnvPerPeriod test_results={this.props.test_results} environment={env} hours_to_keep={24} />
                    </div>
                )}
                <div style={{display: "flex"}}>
                    <div style={{flex: "1", alignSelf: "center", fontStyle: "italic"}}>All</div>
                    <TestStatsPerEnvPerPeriod test_results={this.props.test_results} />
                    <TestStatsPerEnvPerPeriod test_results={this.props.test_results} hours_to_keep={24 * 30} />
                    <TestStatsPerEnvPerPeriod test_results={this.props.test_results} hours_to_keep={24 * 7} />
                    <TestStatsPerEnvPerPeriod test_results={this.props.test_results} hours_to_keep={24} />
                </div>
            </div>
        );
    }
}

class TestStatsPerEnvPerPeriod extends Component {

    render() {
        const time_limit = new Date();
        if (this.props.hours_to_keep !== undefined) {
            time_limit.setHours(time_limit.getHours() - this.props.hours_to_keep);
        }
        const test_results = this.props.test_results
            .filter(tr => {
                if (this.props.environment === undefined)
                    return true;
                return (this.props.environment === tr.environment);
            }).filter(tr => {
                if (this.props.hours_to_keep === undefined)
                    return true;
                return new Date(tr.date / 1000) > time_limit;
            });
        const nb_tests = test_results.length - test_results.filter(tr => tr.status === "Skipped").length;
        const nb_success = test_results.filter(tr => tr.status === "Success").length;
        const nb_failures = test_results.filter(tr => tr.status === "Failure").length;
        return (
            <div style={{display: "flex", flexDirection: "column", flex: "2", justifyContent: "center", margin: "0.5em",
                 backgroundColor: ["hsl(", ((nb_success / nb_tests) * 120).toString(10), ",80%,50%)"].join("")}}>
                <div style={{display: "flex"}}>
                    <div style={{flex: "2"}}>Nb Executions</div>
                    <div style={{flex: "1", fontWeight: "bolder"}}>{nb_tests}</div>
                </div>
                {nb_tests !== 0 ?
                    <div style={{display: "flex"}}>
                        <div style={{flex: "2"}}>Nb Success</div>
                        <div style={{flex: "1", fontWeight: "bolder"}}>{nb_success}</div>
                    </div>
                    : null
                }
                {nb_tests !== 0 ?
                    <div style={{display: "flex"}}>
                        <div style={{flex: "2"}}>Nb Failures</div>
                        <div style={{flex: "1", fontWeight: "bolder", color: nb_failures > 0 ? "red" : "inherit"}}>{nb_failures}</div>
                    </div>
                    : null
                }
                {nb_tests !== 0 ?
                    <div style={{display: "flex"}}>
                        <div style={{flex: "2"}}>Duration</div>
                        <div style={{flex: "1", fontWeight: "bolder"}}>{formatDuration(test_results.map(tr => tr.duration).reduce((a, b) => a + b, 0) / nb_tests)}</div>
                    </div>
                    : null
                }
            </div>
        );
    }
}
