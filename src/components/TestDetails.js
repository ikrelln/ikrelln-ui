import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import Trace from '../containers/Trace';
import { Route, Switch } from 'react-router-dom';
import { fetchTrace } from '../actions/testDetails';

export class TestDetails extends Component {
    render() {
        if (this.props.test === undefined) {
            return null;
        }

        return (
            <div>
                <h1>{this.props.test.test.name}</h1>
                <div>
                    <Link to={"/tests/" + this.props.test.test.test_id + "/trace/" + this.props.test.test.last_traces[0]}>Latest Trace</Link> - <Link to={"/tests/" + this.props.test.test.test_id + "/previous"}>Previous Executions</Link>
                </div>
                <Switch>
                    <Route path="/tests/:test_id/trace/:trace_id" render={({match}) => {
                        this.props.fetchTrace(match.params.trace_id);
                        this.props.fetchTestResult(match.params.trace_id);
                        return (<Trace trace_id={match.params.trace_id} />)
                    }} />
                    <Route render={() => <div>oh ay</div>} />
                </Switch>
            </div>
        );
    }
}
