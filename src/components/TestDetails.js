import React, { Component } from 'react';
import Trace, { TraceComparator } from '../containers/Trace';
import { Route, Switch, Redirect, NavLink, Link } from 'react-router-dom';
import { Loading } from './Loading';
import { TestResult } from '../containers/TestResults';

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

        let executions_enabled = this.props.test.test.last_traces.length > 0;
        let children_enabled = this.props.test.test.children.length > 0;

        return (
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to={"/ikrelln/tests/root"}>root</Link>
                        </li>
                        {this.props.test.test.path.map(item => (
                            <li className="breadcrumb-item" key={item.id}>
                                <Link to={"/ikrelln/tests/" + item.id}>{item.name}</Link>
                            </li>
                        ))}
                        <li className="breadcrumb-item active">{this.props.test.test.name}</li>
                    </ol>
                </nav>
                <ul className="nav nav-tabs" style={{margin: "5px"}}>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (executions_enabled ? "" : " disabled")} to={"/ikrelln/tests/" + this.props.test.test.test_id + "/trace/latest"}>Latest Trace</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (executions_enabled ? "" : " disabled")} to={"/ikrelln/tests/" + this.props.test.test.test_id + "/previous"}>Previous Executions</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (children_enabled ? "" : " disabled")} to={"/ikrelln/tests/" + this.props.test.test.test_id + "/children"}>Sub Tests</NavLink>
                    </li>
                </ul>
                <Switch>
                    <Route path="/ikrelln/tests/:test_id/trace/:trace_id/concurrent" render={({match}) => {
                            return (<div>oh hay</div>);
                    }} />
                    <Route path="/ikrelln/tests/:test_id/trace/:trace_id" render={({match}) => {
                        let trace_id;
                        if (match.params.trace_id === "latest") {
                            trace_id = this.props.test.test.last_traces[0];
                        } else {
                            trace_id = match.params.trace_id;
                        }
                        return (<Trace key={trace_id} trace_id={trace_id} />)
                    }} />
                    <Route path="/ikrelln/tests/:test_id/previous" render={() => {
                        return (<Previous key={this.props.test.test.test_id} test_id={this.props.test.test.test_id} previous={this.props.test.test.last_traces} />)
                    }} />
                    <Route path="/ikrelln/tests/:test_id/children" render={() => {
                        return (<Children key={this.props.test.test.test_id} children={this.props.test.test.children} />)
                    }} />
                    <Route path="/ikrelln/tests/:test_id/comparetrace/:trace_id1/:trace_id2" render={({match}) => {
                        return (<TraceComparator base={match.params.trace_id1} with={match.params.trace_id2} />)}} />
                    <Route render={() => <Redirect to={
                        executions_enabled ?
                            "/ikrelln/tests/" + this.props.test.test.test_id + "/trace/" + this.props.test.test.last_traces[0]
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

class Previous extends Component {
    render() {
        return (
            <div>
                {this.props.previous.map(trace_id => (
                    <TestResult key={trace_id} trace_id={trace_id} compare_to={this.props.previous[0]}/>
                ))}
            </div>
        );
    }    
}