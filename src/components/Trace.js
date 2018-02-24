import React, { Component } from 'react';
import { Loading } from './Loading';
import { formatDuration, statusToColorSuffix } from '../helper';
import dateFormat from 'dateformat';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';

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
                <div style={{display: "flex"}}>
                    <div className={"alert  " + status_class} style={{fontSize: "1.5rem", fontWeight: "bold", flex: 1}}>{this.props.result.status}</div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0.6rem", marginLeft: "0.4rem"}} className="alert alert-secondary">
                        <i className="fas fa-wrench" style={{position: "absolute", top: "5px", left: "5px", color: "grey"}}></i>
                        <Link style={{alignSelf: "flex-end"}} to={"/ikrelln/tests/" + this.props.result.test_id + "/results/" + this.props.result.trace_id + "/compare"}>
                            Compare to...
                        </Link>
                        <Link style={{alignSelf: "flex-end"}} to={"/ikrelln/tests/" + this.props.result.test_id + "/results/" + this.props.result.trace_id + "/concurrent"}>
                            At The Same Time
                        </Link>
                    </div>
                </div>
                <div style={{display: "flex", marginBottom: "1rem"}}>
                    <div style={{flex: "2", display: "flex", justifyContent: "center"}}>
                        <div style={{paddingRight: "1rem"}}>
                            <i className="fas fa-calendar-alt" style={{color: "gray"}}></i>
                        </div>
                        <div>
                            {dateFormat(new Date(this.props.result.date / 1000), "isoDateTime")}
                        </div>
                    </div>
                    <div style={{flex: "1", display: "flex", justifyContent: "center"}}>
                        <div style={{paddingRight: "1rem"}}>
                            <i className="fas fa-stopwatch" style={{color: "gray"}}></i>
                        </div>
                        <div>
                            {formatDuration(this.props.result.duration)}
                        </div>
                    </div>
                    <div style={{flex: "1", display: "flex", justifyContent: "center"}}>
                        <div style={{paddingRight: "1rem"}}>
                            <i className="fas fa-globe" style={{color: "gray"}}></i>
                        </div>
                        <div>
                            {this.props.result.environment}
                        </div>
                    </div>
                </div>

                <div style={{display: "flex", flexDirection: "column", textAlign: "left"}}>
                    <div style={{display: "flex", justifyContent: "space-evenly"}}>
                        <div style={{fontWeight: "lighter", fontSize: "smaller", fontStyle: "italic"}}>
                            {formatDuration(this.props.spans.spans[0].duration / 5)}
                        </div>
                        <div style={{fontWeight: "lighter", fontSize: "smaller", fontStyle: "italic"}}>
                            {formatDuration(this.props.spans.spans[0].duration / 5 * 2)}
                        </div>
                        <div style={{fontWeight: "lighter", fontSize: "smaller", fontStyle: "italic"}}>
                            {formatDuration(this.props.spans.spans[0].duration / 5 * 3)}
                        </div>
                        <div style={{fontWeight: "lighter", fontSize: "smaller", fontStyle: "italic"}}>
                            {formatDuration(this.props.spans.spans[0].duration / 5 * 4)}
                        </div>
                    </div>
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
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };
    
        this.toggle = this.toggle.bind(this);
    }
    
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        let left = (this.props.span.timestamp - this.props.traceStartTs) / this.props.traceDuration * 100;
        let width = Math.max(this.props.span.duration / this.props.traceDuration * 100, 0.2);
        let selected_span = this.state.modal ? {border: "1px solid blue"} : {};
        let error_span = this.props.span.tags["error"] ? {backgroundColor: "rgba(211, 18, 18, 0.3)"} : {backgroundColor: "rgba(30, 129, 196, 0.3)"};
        return (
            <div>
                <div style={{display: "flex", justifyContent: "space-evenly", position: "absolute", left: "20px", right: "20px"}}>
                    <div>.</div>
                    <div>.</div>
                    <div>.</div>
                    <div>.</div>
                </div>
                <div style={{left: left.toFixed(1) + "%", width: width.toFixed(1) + "%",
                            position: "relative", whiteSpace: "nowrap", margin: "1px", padding: "2px",
                            display: "flex", alignItems: "center", ...selected_span, ...error_span}} onClick={this.toggle}>
                    {this.props.span.remoteEndpoint !== null ? 
                        <span className="badge badge-pill badge-info" style={{fontWeight: "inherit" }}>{this.props.span.remoteEndpoint.serviceName}</span>
                        : null
                    }
                    <div style={{padding: "0px 2px"}}>{this.props.span.name}</div>
                    <div style={{fontStyle: "italic", fontSize: "0.7rem"}}>{formatDuration(this.props.span.duration)}</div>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div>{this.props.span.name}</div>
                            <div style={{fontStyle: "italic"}}>Tags</div>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {Object.keys(this.props.span.tags).map((key, index) => 
                            <div key={key} style={{display: "flex", justifyContent: "space-between"}}>
                                <div>{key}</div>
                                <div>{this.props.span.tags[key]}</div>
                            </div>
                        )}
                    </ModalBody>
                    </Modal>
                </div>
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