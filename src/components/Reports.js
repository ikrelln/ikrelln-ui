import React, { Component } from 'react';
import { Loading } from './Loading';
import { Link, Switch, Route } from 'react-router-dom';
import { statusToColorSuffix } from '../helper';

export class Reports extends Component {
    componentDidMount() {
        if (this.props.reports === undefined) {
            this.props.fetchReports();
        }
    }
    
    render() {
        if (this.props.reports === undefined) {
            return (<Loading />);
        }

        return (
            <div>
                <Switch>
                    <Route path="/ikrelln/reports/:report_name" render={({match}) => {
                        if ((this.props.report_details === undefined) || (this.props.report_details[match.params.report_name] === undefined)) {
                            this.props.fetchReport(match.params.report_name);
                            return (
                                <h2>{match.params.report_name}</h2>
                            );
                        } else {
                            return (
                                <div>
                                    <h2>{match.params.report_name}</h2>
                                    <div>
                                        {Object.keys(this.props.report_details[match.params.report_name].categories).map(cat => {
                                            return (<div key={cat} style={{display: "flex"}}>
                                                <div style={{fontWeight: "bolder", flex: "1", minWidth: "400px", maxWidth: "400px"}}>{cat}</div>
                                                <div style={{display: "flex", flex: "4", flexWrap: "wrap", justifyContent: "space-evenly"}}>
                                                    {this.props.report_details[match.params.report_name].categories[cat].map(
                                                        test => <Link key={test.test_id} className={"btn btn-xs " + "btn" + statusToColorSuffix(test.status)}
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
                    }} />
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
