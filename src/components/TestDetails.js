import React, { Component } from 'react';
import Trace from '../containers/Trace';
import { Route, Switch, Redirect, NavLink, Link } from 'react-router-dom';
import { Loading } from './Loading';

export class TestDetails extends Component {
    componentDidMount() {
        this.props.fetchTest(this.props.test_id);
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
                            <Link to={"/tests/root"}>root</Link>
                        </li>
                        {this.props.test.test.path.map(item => (
                            <li className="breadcrumb-item" key={item.id}>
                                <Link to={"/tests/" + item.id}>{item.name}</Link>
                            </li>
                        ))}
                        <li className="breadcrumb-item active">{this.props.test.test.name}</li>
                    </ol>
                </nav>
                <ul className="nav nav-tabs" style={{margin: "5px"}}>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (executions_enabled ? "" : " disabled")} to={"/tests/" + this.props.test.test.test_id + "/trace/" + this.props.test.test.last_traces[0]}>Latest Trace</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (executions_enabled ? "" : " disabled")} to={"/tests/" + this.props.test.test.test_id + "/previous"}>Previous Executions</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (children_enabled ? "" : " disabled")} to={"/tests/" + this.props.test.test.test_id + "/children"}>Sub Tests</NavLink>
                    </li>
                </ul>
                <Switch>
                    <Route path="/tests/:test_id/trace/:trace_id" render={({match}) => {
                        this.props.fetchTrace(match.params.trace_id);
                        this.props.fetchTestResult(match.params.trace_id);
                        return (<Trace trace_id={match.params.trace_id} />)
                    }} />
                    <Route path="/tests/:test_id/children" render={() => {
                        return (<Children children={this.props.test.test.children} />)
                    }} />
                    <Route render={() => <Redirect to={
                        executions_enabled ?
                            "/tests/" + this.props.test.test.test_id + "/trace/" + this.props.test.test.last_traces[0]
                            : "/tests/" + this.props.test.test.test_id + "/children"
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
                <Link to={"/tests/" + this.props.test.id}>{this.props.test.name}</Link>
            </div>
        );
    }
}