import React, { Component } from 'react';
import { Loading } from './Loading';
import { formatDuration, statusToColorSuffix } from '../helper';
import dateFormat from 'dateformat';

export class Trace extends Component {
    componentDidMount() {
        if (this.props.spans === undefined) {
            this.props.fetchTrace(this.props.trace_id);
        }
        if (this.props.result === undefined) {
            this.props.fetchTestResultForTrace(this.props.trace_id);
        }
    }

    render() {
        if (this.props.spans === undefined) {
            return (<Loading />);
        }
        if (this.props.result === undefined) {
            return (<Loading />);
        }

        let status_class = "alert" + statusToColorSuffix(this.props.result.status);

        return (
            <div>
                <div className={"alert  " + status_class} style={{fontSize: "1.5rem", fontWeight: "bold"}}>{this.props.result.status}</div>
                <div style={{display: "flex"}}>
                    <div style={{flex: "2"}}>
                        {dateFormat(new Date(this.props.result.date / 1000), "isoDateTime")}
                    </div>
                    <div style={{flex: "1"}}>
                        {formatDuration(this.props.result.duration)}
                    </div>
                    <div style={{flex: "1"}}>
                        {this.props.result.environment}
                    </div>
                </div>

                <div style={{display: "flex", flexDirection: "column", textAlign: "left"}}>
                    {this.props.spans.spans.map(span => (
                        <Span key={span.id} span={span} traceStartTs={this.props.spans.spans[0].timestamp}
                            traceDuration={this.props.spans.spans[0].duration} />
                    ))}
                </div>
            </div>
        );
    }
}

class Span extends Component {
    render() {
        let left = (this.props.span.timestamp - this.props.traceStartTs) / this.props.traceDuration * 100;
        let width = Math.max(this.props.span.duration / this.props.traceDuration * 100, 0.2);
        return (
            <div className="test-neutral" style={{left: left.toFixed(1) + "%", width: width.toFixed(1) + "%",
                         position: "relative", whiteSpace: "nowrap", margin: "1px", display: "flex", alignItems: "center",
                         padding: "2px"}}>
                {this.props.span.remoteEndpoint !== null ? 
                    <span className="badge badge-pill badge-info" style={{fontWeight: "inherit" }}>{this.props.span.remoteEndpoint.serviceName}</span>
                    : null
                }
                <div style={{padding: "0px 2px"}}>{this.props.span.name}</div>
                <div style={{fontStyle: "italic", fontSize: "0.7rem"}}>{formatDuration(this.props.span.duration)}</div>
            </div>
        );

    }
}

export class TraceComparator extends Component {
    componentDidMount() {
        if (this.props.spansBase === undefined) {
            this.props.fetchTrace(this.props.base);
        }
        if (this.props.testResultBase === undefined) {
            this.props.fetchTestResultForTrace(this.props.base);
        }
        if (this.props.spansWith === undefined) {
            this.props.fetchTrace(this.props.with);
        }
        if (this.props.testResultWith === undefined) {
            this.props.fetchTestResultForTrace(this.props.with);
        }
    }

    render() {
        if (this.props.spansBase === undefined) {
            return (<Loading />);
        }
        if (this.props.testResultBase === undefined) {
            return (<Loading />);
        }
        if (this.props.spansWith === undefined) {
            return (<Loading />);
        }
        if (this.props.testResultWith === undefined) {
            return (<Loading />);
        }

        return (
            <div style={{display: "flex"}}>
                <div style={{width: "50%", paddingRight: "5px"}}>
                    <Trace key={this.props.base} trace_id={this.props.base} spans={this.props.spansBase} result={this.props.testResultBase} />
                </div>
                <div style={{width: "50%", paddingLeft: "5px"}}>
                    <Trace key={this.props.with} trace_id={this.props.with} spans={this.props.spansWith} result={this.props.testResultWith} />
                </div>
                </div>
        );
    }
}