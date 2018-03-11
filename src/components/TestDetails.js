import React, { Component } from 'react';
import Trace, { TraceComparator } from '../containers/Trace';
import { Route, Switch, Redirect, NavLink, Link, matchPath } from 'react-router-dom';
import { Loading } from './Loading';
import TestResults from '../containers/TestResults';
import { statusToColorSuffix } from '../helper';
import dateFormat from 'dateformat';
import TestTimeline from '../containers/TestTimeline';
import Radium from 'radium';
import TestTrends from '../containers/TestTrends';

export class TestDetails extends Component {
    componentDidMount() {
        if (this.props.test === undefined) {
            this.props.fetchTest(this.props.test_id);
        }
        if ((this.props.children.length !== (this.props.test === undefined ? -1 : this.props.test.children.length))) {
            this.props.fetchTestChildren(this.props.test_id);
        }
    }
    
    render() {
        if (this.props.test === undefined) {
            return (<Loading />);
        }

        const latest_trace_id = this.props.test.last_results.length > 0
                ? this.props.test.last_results.sort((a, b) => a.date < b.date)[0].trace_id
                : undefined;

        return (
            <div>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <div style={{display: "flex"}}>
                            <div style={{paddingRight: "1rem"}}>
                                <i className="fas fa-map-marker-alt" style={{color: "gray"}}></i>
                            </div>
                            <Link to={"/ikrelln/tests/root"}>root</Link>
                        </div>
                    </li>
                    {this.props.test.path.map(item => (
                        <li className="breadcrumb-item" key={item.id}>
                            <Link to={"/ikrelln/tests/" + item.id}>{item.name}</Link>
                        </li>
                    ))}
                    <li className="breadcrumb-item active">{this.props.test.name}</li>
                </ol>
                <ShortHistory results={this.props.test.last_results} />
                {this.props.custom_component === undefined
                    ? null
                    : <div style={{margin: "0.2em", border: "1px dashed lightgray", borderRadius: "5px", backgroundColor: "bisque", display: "flex", position: "relative", justifyContent: "center"}}>
                        <i className="fas fa-magic" style={{position: "absolute", top: "5px", left: "5px", color: "grey"}}></i>
                        <div dangerouslySetInnerHTML={this.props.custom_component(this.props.test)} />
                    </div>
                }
                <ul className="nav nav-tabs" style={{margin: "5px"}}>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (this.props.test.last_results.length > 0 ? "" : " disabled")} 
                            to={"/ikrelln/tests/" + this.props.test.test_id + "/results/latest"}
                            isActive={(match, location) => {
                                let match_dynamic = matchPath(location.pathname, {
                                  path: '/ikrelln/tests/:test_id/results/:trace_id',
                                  exact: false,
                                  strict: false
                                });
                                return (match_dynamic != null)
                                    && ((match_dynamic.params.trace_id === "latest")
                                        || (match_dynamic.params.trace_id === latest_trace_id))
                            }}>
                            Latest Trace
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (this.props.test.last_results.length > 1 ? "" : " disabled")} exact 
                            to={"/ikrelln/tests/" + this.props.test.test_id + "/results"}>
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
                        <NavLink className={"nav-link" + (this.props.test.last_results.length > 0 ? "" : " disabled")}
                            to={"/ikrelln/tests/" + this.props.test.test_id + "/trends"}>
                            <div style={{display: "flex"}}>
                                <div style={{paddingRight: "1rem"}}>
                                    <i className="fas fa-stethoscope" style={{color: "gray"}}></i>
                                </div>
                                <div>
                                    Trends
                                </div>
                            </div>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (this.props.test.children.length > 0 ? "" : " disabled")} 
                            to={"/ikrelln/tests/" + this.props.test.test_id + "/children"}>
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
                        return (<TestTimeline trace_id={match.params.trace_id} />);
                    }} />
                    <Route path="/ikrelln/tests/:test_id/results/:trace_id1/compare/:trace_id2" render={({match}) => {
                        return (<TraceComparator base={match.params.trace_id1} with={match.params.trace_id2} />)
                    }} />
                    <Route path="/ikrelln/tests/:test_id/results/:trace_id1/compare" render={({match}) => {
                        return <TestResults key={this.props.test.test_id} test_id_filter={this.props.test.test_id}
                                                compare_to={{trace_id: match.params.trace_id1, name: "selected"}}/>;
                    }} />
                    <Route path="/ikrelln/tests/:test_id/results/:trace_id" render={({match}) => {
                        let trace_id;
                        if (match.params.trace_id === "latest") {
                            trace_id = latest_trace_id;
                        } else {
                            trace_id = match.params.trace_id;
                        }
                        return (<Trace key={trace_id} trace_id={trace_id} />)
                    }} />
                    <Route path="/ikrelln/tests/:test_id/results" render={() => {
                        return <TestResults key={this.props.test.test_id} test_id_filter={this.props.test.test_id}
                                                compare_to={{trace_id: latest_trace_id, name: "latest"}}/>;
                    }} />
                    <Route path="/ikrelln/tests/:test_id/trends" render={() => {
                        return (<TestTrends test_id={this.props.test.test_id} />);
                    }} />
                    <Route path="/ikrelln/tests/:test_id/children" render={() => {
                        return (<Children key={this.props.test.test_id} children={this.props.test.children} childrenFullDetails={this.props.children} />)
                    }} />
                    <Route render={() => <Redirect to={
                        this.props.test.last_results.length > 0 ?
                            "/ikrelln/tests/" + this.props.test.test_id + "/results/latest"
                            : "/ikrelln/tests/" + this.props.test.test_id + "/children"
                    }/>} />
                </Switch>
            </div>
        );
    }
}

class Children extends Component {
    render() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                {this.props.children.map((testChild, index) => (
                    <TestChild key={testChild.id} test={testChild} details={this.props.childrenFullDetails.find(fd => fd.test_id === testChild.id)} style={{backgroundColor: index % 2 === 1 ? "#F9F9F9" : "#FEFEFE"}}/>
                ))}
            </div>
        );
    }
}

class TestChild extends Component {
    render() {
        return (
            <div style={{display: "flex", justifyContent: "flex-start", marginTop: "0.2em", ...this.props.style,
                ':hover': {backgroundColor: "rgba(200, 200, 200, 0.2)"}}}>
                <Link style={{width: "35em", marginRight: "0.5em", textAlign: "right"}}
                    to={"/ikrelln/tests/" + this.props.test.id}>{this.props.test.name}
                </Link>
                {this.props.details !== undefined
                    ? <ShortHistory style={{justifyContent: "flex-start"}} results={this.props.details.last_results.slice(0, 3)} order = "desc" />
                    : null}
                {this.props.details !== undefined ? this.props.details.children.length > 0
                    ? <div style={{flexGrow: 0, width: "10em", fontStyle: "italic", textAlign: "left", fontSize: "smaller", alignSelf: "center"}}>{this.props.details.children.length} children</div>
                    : null : null}
            </div>
        );
    }
}
TestChild = Radium(TestChild);

class ShortHistory extends Component {
    render() {
        return (
            <div style={{display: "flex", justifyContent: "center", ...this.props.style}}>
                {this.props.results.sort(this.props.order === "desc" ? (a, b) => a.date < b.date : (a, b) => a.date > b.date).map(tr => {
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
