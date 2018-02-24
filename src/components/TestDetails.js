import React, { Component } from 'react';
import Trace, { TraceComparator } from '../containers/Trace';
import { Route, Switch, Redirect, NavLink, Link } from 'react-router-dom';
import { Loading } from './Loading';
import TestResults from '../containers/TestResults';
import { statusToColorSuffix } from '../helper';
import dateFormat from 'dateformat';

export class TestDetails extends Component {
    componentDidMount() {
        if (this.props.test === undefined) {
            this.props.fetchTest(this.props.test_id);
        }
    }
    
    render() {
        if (this.props.test === undefined) {
            return (<Loading />);
        }

        return (
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <div style={{display: "flex"}}>
                                <div style={{paddingRight: "1rem"}}>
                                    <i className="fas fa-map-marker-alt" style={{color: "gray"}}></i>
                                </div>
                                <Link to={"/ikrelln/tests/root"}>root</Link>
                            </div>
                        </li>
                        {this.props.test.test.path.map(item => (
                            <li className="breadcrumb-item" key={item.id}>
                                <Link to={"/ikrelln/tests/" + item.id}>{item.name}</Link>
                            </li>
                        ))}
                        <li className="breadcrumb-item active">{this.props.test.test.name}</li>
                    </ol>
                </nav>
                <ShortHistory results={this.props.test.test.last_results} />
                <ul className="nav nav-tabs" style={{margin: "5px"}}>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (this.props.test.test.last_results.length > 0 ? "" : " disabled")} 
                            to={"/ikrelln/tests/" + this.props.test.test.test_id + "/results/latest"}>
                            Latest Trace
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (this.props.test.test.last_results.length > 1 ? "" : " disabled")} exact 
                            to={"/ikrelln/tests/" + this.props.test.test.test_id + "/results"}>
                            <div style={{display: "flex"}}>
                                <div style={{paddingRight: "1rem"}}>
                                    <i className="fas fa-reply-all" style={{color: "gray"}}></i>
                                </div>
                                <div>
                                    Previous Executions
                                </div>
                            </div>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (this.props.test.test.children.length > 0 ? "" : " disabled")} 
                            to={"/ikrelln/tests/" + this.props.test.test.test_id + "/children"}>
                            <div style={{display: "flex"}}>
                                <div style={{paddingRight: "1rem"}}>
                                    <i className="fas fa-sitemap" style={{color: "gray"}}></i>
                                </div>
                                <div>
                                    Sub Tests
                                </div>
                            </div>
                        </NavLink>
                    </li>
                </ul>
                <Switch>
                    <Route path="/ikrelln/tests/:test_id/results/:trace_id/concurrent" render={({match}) => {
                            return (<div>display all tests that were running at the same time, with option to filter by environment</div>);
                    }} />
                    <Route path="/ikrelln/tests/:test_id/results/:trace_id1/compare/:trace_id2" render={({match}) => {
                        return (<TraceComparator base={match.params.trace_id1} with={match.params.trace_id2} />)
                    }} />
                    <Route path="/ikrelln/tests/:test_id/results/:trace_id1/compare" render={({match}) => {
                        return <TestResults key={this.props.test.test.test_id} test_id_filter={this.props.test.test.test_id} compare_to={{trace_id: match.params.trace_id1, name: "selected"}}/>;
                    }} />
                    <Route path="/ikrelln/tests/:test_id/results/:trace_id" render={({match}) => {
                        let trace_id;
                        if (match.params.trace_id === "latest") {
                            trace_id = this.props.test.test.last_results[0].trace_id;
                        } else {
                            trace_id = match.params.trace_id;
                        }
                        return (<Trace key={trace_id} trace_id={trace_id} />)
                    }} />
                    <Route path="/ikrelln/tests/:test_id/results" render={() => {
                        return <TestResults key={this.props.test.test.test_id} test_id_filter={this.props.test.test.test_id} compare_to={{trace_id: this.props.test.test.last_results[0].trace_id, name: "latest"}}/>;
                    }} />
                    <Route path="/ikrelln/tests/:test_id/children" render={() => {
                        return (<Children key={this.props.test.test.test_id} children={this.props.test.test.children} />)
                    }} />
                    <Route render={() => <Redirect to={
                        this.props.test.test.last_results.length > 0 ?
                            "/ikrelln/tests/" + this.props.test.test.test_id + "/results/latest"
                            : "/ikrelln/tests/" + this.props.test.test.test_id + "/children"
                    }/>} />
                </Switch>
            </div>
        );
    }
}

class Children extends Component {
    render() {
        return (
            <div>
                {this.props.children.map(testChild => (
                    <TestChild key={testChild.id} test={testChild} />
                ))}
            </div>
        );
    }
}

class TestChild extends Component {
    render() {
        return (
            <div>
                <Link to={"/ikrelln/tests/" + this.props.test.id}>{this.props.test.name}</Link>
            </div>
        );
    }
}

class ShortHistory extends Component {
    render() {
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                {this.props.results.map(tr => {
                    let status_class = "btn" + statusToColorSuffix(tr.status);
                    let label = dateFormat(new Date(tr.date / 1000), "isoDateTime");
                    if ((tr.environment !== undefined) && (tr.environment !== null)) {
                        label += " - " + tr.environment;
                    }
                    return (
                        <div key={tr.trace_id} style={{padding: "0 .2rem"}}>
                            <Link className={"btn btn-xs " + status_class} to={"/ikrelln/tests/" + tr.test_id + "/results/" + tr.trace_id}>
                                {label}
                            </Link>
                        </div>
                    )
                })}
            </div>
        )
    }
}
