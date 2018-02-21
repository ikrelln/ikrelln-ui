import React, { Component } from 'react';

export class Trace extends Component {
    render() {
        if (this.props.spans === undefined) {
            return null;
        }
        if (this.props.testResult === undefined) {
            return null;
        }

        var status_class = "test-success";
        switch (this.props.testResult.status) {
            case "Failure":
                status_class = "test-failure";
                break;
            case "Skipped":
                status_class = "test-skipped";
                break;
        }

        return (
            <div>
                <h2 className={status_class}>{this.props.testResult.status}</h2>
                <div style={{display: "flex", flexDirection: "column", textAlign: "left", margin: "20px"}}>
                    {this.props.spans.spans.map(span => (
                        <Span key={span.id} span={span} traceStartTs={this.props.spans.spans[0].timestamp}
                            traceEndTs={this.props.spans.spans[0].timestamp + this.props.spans.spans[0].duration}
                            traceDuration={this.props.spans.spans[0].duration}/>
                    ))}
                </div>
            </div>
        );

    }
}

class Span extends Component {
    render() {
        let left = (this.props.span.timestamp - this.props.traceStartTs) / this.props.traceDuration * 100;
        let right = (this.props.span.timestamp + this.props.span.duration - this.props.traceStartTs) / this.props.traceDuration * 100;
        let width = Math.max(this.props.span.duration / this.props.traceDuration * 100, 0.2);
        return (
            <div className="test-neutral" style={{left: left.toFixed(1) + "%", width: width.toFixed(1) + "%",
                         position: "relative", whiteSpace: "nowrap", margin: "1px"}}>
                {this.props.span.name}
            </div>
        );

    }
}