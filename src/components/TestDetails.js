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
                        <NavLink className={"nav-link" + (this.props.test.test.last_results.length > 0 ? "" : " disabled")} to={"/ikrelln/tests/" + this.props.test.test.test_id + "/results/latest"}>Latest Trace</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (this.props.test.test.last_results.length > 1 ? "" : " disabled")} exact to={"/ikrelln/tests/" + this.props.test.test.test_id + "/results"}>All Executions</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (this.props.test.test.last_results.length > 0 ? "" : " disabled")} to={"/ikrelln/tests/" + this.props.test.test.test_id + "/results/na/concurrent"}>At The Same Time</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={"nav-link" + (this.props.test.test.children.length > 0 ? "" : " disabled")} to={"/ikrelln/tests/" + this.props.test.test.test_id + "/children"}>Sub Tests</NavLink>
                    </li>
                </ul>
                <Switch>
                    <Route path="/ikrelln/tests/:test_id/results/:trace_id/concurrent" render={({match}) => {
                            return (<div>display all tests that were running at the same time, with option to filter by environment</div>);
                    }} />
                    <Route path="/ikrelln/tests/:test_id/results/:trace_id1/compare/:trace_id2" render={({match}) => {
                        return (<TraceComparator base={match.params.trace_id1} with={match.params.trace_id2} />)}} />
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
                        return (<Previous key={this.props.test.test.test_id} test_id={this.props.test.test.test_id} previous={this.props.test.test.last_results} />)
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

class Previous extends Component {
    render() {
        console.log(this.props.previous);
        return (
            <div>
                {this.props.previous.map(test_result => (
                    <TestResult key={test_result.trace_id} trace_id={test_result.trace_id} test_result={test_result} compare_to={this.props.previous[0].trace_id}/>
                ))}
            </div>
        );
    }    
}