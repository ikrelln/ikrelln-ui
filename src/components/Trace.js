import React, { Component } from 'react';
import { Loading } from './Loading';
import { formatDuration, statusToColorSuffix } from '../helper';
import dateFormat from 'dateformat';

export class Trace extends Component {
    render() {
        if (this.props.spans === undefined) {
            return (<Loading />);
        }
        if (this.props.testResult === undefined) {
            return (<Loading />);
        }

        let status_class = "alert" + statusToColorSuffix(this.props.testResult.status);

        return (
            <div style={{margin: "20px"}}>
                <div className={"alert  " + status_class} style={{fontSize: "1.5rem", fontWeight: "bold"}}>{this.props.testResult.status}</div>
                <div style={{display: "flex"}}>
                    <div style={{flex: "2"}}>
                        {dateFormat(new Date(this.props.testResult.date / 1000), "isoDateTime")}
                    </div>
                    <div style={{flex: "1"}}>
                        {formatDuration(this.props.testResult.duration)}
                    </div>
                    <div style={{flex: "1"}}>
                        {this.props.testResult.environment}
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
