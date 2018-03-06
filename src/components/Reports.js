import React, { Component } from 'react';
import { Loading } from './Loading';
import { Link, Switch, Route } from 'react-router-dom';
import { statusToColorSuffix } from '../helper';

export class Reports extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            environment: this.props.environments.length === 0 ? "" : this.props.environments[0]
        };
        this.handleEnvironmentChange = this.handleEnvironmentChange.bind(this);
    }

    handleEnvironmentChange(environment) {
        this.setState({environment: environment.target.value});
    }

    componentDidMount() {
        if (this.props.reports === undefined) {
            this.props.fetchReports();
        }
        if (this.props.environments.length === 0) {
            this.props.fetchEnvironments();
        }
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.environments.length === 0) && (nextProps.environments.length !== 0)) {
            this.setState({environment: nextProps.environments[0]});
        }
    }

    
    render() {
        if (this.props.reports === undefined) {
            return (<Loading />);
        }

        return (
            <div>
                <div className="input-group" style={{margin: "0 1rem"}}>
                    <div className="input-group-prepend">
                        <label className="input-group-text">Environment</label>
                    </div>
                    <select className="custom-select" id="input-test-result-status-filter" onChange={this.handleEnvironmentChange} value={this.state.environment}>
                        {this.props.environments.map(env => <option key={env}>{env}</option>)}
                    </select>
                </div>
                <Switch>
                    <Route path="/ikrelln/reports/:report_name" render={({match}) => 
                        <Report key={this.state.environment + "-" + match.params.report_name}
                            environment={this.state.environment} report_name={match.params.report_name} fetchReport={this.props.fetchReport}
                            report={this.props.report_details === undefined ? undefined : this.props.report_details[this.state.environment + "-" + match.params.report_name]} />
                    } />
                    <Route path="/ikrelln/reports" render={({match}) => {
                        return (
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <h1>Reports</h1>
                                {this.props.reports.map(report => 
                                    <Link key={report.name} to={"/ikrelln/reports/" + report.name}>{report.name}</Link>
                                )}
                            </div>
                        );
                    }} />
                </Switch>
            </div>
        );
    }
}

class Report extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            redirected: false,
            current_hash: "",
        }
    }
    
    componentDidMount() {
        if (this.props.report === undefined) {
            this.props.fetchReport(this.props.report_name, this.props.environment);
        } else {
            const hash = window.location.hash;
            if ((!this.state.redirected) || ((hash !== "") && (this.state.current_hash !== hash))) {
                window.location.hash = "";
                setTimeout(function(){ 
                    window.location.hash = hash;
                 }, 300);
                 this.setState({
                    redirected: true,
                    current_hash: hash,
                });
            }
        }
    }

    componentDidUpdate() {
        const hash = window.location.hash;
        if ((!this.state.redirected) || ((hash !== "") && (this.state.current_hash !== hash))) {
            window.location.hash = "";
            setTimeout(function(){ 
                window.location.hash = hash;
             }, 300);
            this.setState({
                redirected: true,
                current_hash: hash,
            });
        }
    }

    render() {
        if (this.props.report === undefined) {
            return (
                <h2>{this.props.report_name}</h2>
            );
        }

        return (
            <div>
                <h2>{this.props.report_name}</h2>
                <div>
                    {Object.keys(this.props.report.categories).sort().map(cat => {
                        return (<div key={cat} style={{display: "flex"}} id={cat}>
                            <div style={{fontWeight: "bolder", flex: "1", minWidth: "400px", maxWidth: "400px"}}>
                                <Link to={"/ikrelln/reports/" + this.props.report_name + "#" + cat}>{cat}</Link>
                            </div>
                            <div style={{display: "flex", flex: "4", flexWrap: "wrap", justifyContent: "space-evenly"}}>
                                {this.props.report.categories[cat].map(
                                    test => <Link key={test.test_id} className={"btn btn-xs btn" + statusToColorSuffix(test.status)}
                                            to={"/ikrelln/tests/" + test.test_id + "/results/" + test.trace_id} style={{margin: "0.3em"}}>
                                            {test.name}
                                        </Link>
                                )}
                            </div>
                        </div>);
                    })}
                </div>
            </div>
        );
    }
}
