import React, { Component } from 'react';
import { Loading } from './Loading';
import { Redirect } from 'react-router-dom';

export class TraceRedirect extends Component {
    componentDidMount() {
        this.props.fetchTestResultForTrace(this.props.trace_id);
    }
    
    render() {
        if (this.props.testResult === undefined) {
            return (<Loading />);
        }

        return (
            <Redirect to={"/ikrelln/tests/" + this.props.testResult.test_id + "/results/" + this.props.testResult.trace_id}/>
        );

    }
}
