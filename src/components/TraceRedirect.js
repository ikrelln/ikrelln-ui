import React, { Component } from 'react';
import { Loading } from './Loading';
import { Redirect } from 'react-router-dom';

export class TraceRedirect extends Component {
    render() {
        if (this.props.testResult === undefined) {
            return (<Loading />);
        }

        return (
            <Redirect to={"/tests/" + this.props.testResult.test_id + "/trace/" + this.props.testResult.trace_id}/>
        );

    }
}
