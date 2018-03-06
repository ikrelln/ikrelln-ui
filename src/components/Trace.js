import React, { Component } from 'react';
import { Loading } from './Loading';
import { formatDuration, statusToColorSuffix, isJson } from '../helper';
import dateFormat from 'dateformat';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import Radium from 'radium';

export class Trace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden_span_children: [],
        };

        this.hideSpanChildren = this.hideSpanChildren.bind(this);
        this.showSpanChildren = this.showSpanChildren.bind(this);
    }

    hideSpanChildren(span_id) {
        var spans_to_hide = [];
        var new_spans = [span_id];
        while (new_spans.length !== 0) {
            var next_new_spans = [];
            // eslint-disable-next-line
            new_spans.forEach(span_id => {
                next_new_spans = next_new_spans.concat(this.props.spans.spans
                    .filter(span => span.parentId === span_id)
                    .map(span => span.id))
            });
            spans_to_hide = spans_to_hide.concat(new_spans);
            new_spans = next_new_spans;
        }
        this.setState((prevState, props) => ({
            hidden_span_children: [...new Set(prevState.hidden_span_children.concat(spans_to_hide))]
        }))
    }

    showSpanChildren(span_id) {
        this.setState((prevState, props) => {
            const index = prevState.hidden_span_children.indexOf(span_id);
            var new_hidden_span_children = prevState.hidden_span_children;
            if (index > -1) {
                new_hidden_span_children.splice(index, 1);
            }
            return {
                hidden_span_children: new_hidden_span_children,
            };
        })
    }

    componentDidMount() {
        if (this.props.spans === undefined) {
            this.props.fetchTrace(this.props.trace_id);
        }
        if (this.props.result === undefined) {
            this.props.fetchTestResultForTrace(this.props.trace_id);
        }
    }

    render() {
        if (this.props.result === undefined) {
            return (<Loading />);
        }
        const spans = this.props.spans === undefined ? [] : this.props.spans.spans;
        let status_class = "alert" + statusToColorSuffix(this.props.result.status);
        const nb_time_separation = 4;

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
                    {this.props.result.environment !== null 
                        ? <div style={{flex: "1", display: "flex", justifyContent: "center"}}>
                            <div style={{paddingRight: "1rem"}}>
                                <i className="fas fa-globe" style={{color: "gray"}}></i>
                            </div>
                            <div>
                                {this.props.result.environment}
                            </div>
                        </div>
                        : null
                    }
                    {this.props.custom_component === undefined
                        ? null
                        : <div style={{flex: "1", margin: "0.2em", border: "1px dashed lightgray", borderRadius: "5px", backgroundColor: "bisque", display: "flex", position: "relative", justifyContent: "center"}}>
                            <i className="fas fa-magic" style={{position: "absolute", top: "5px", left: "5px", color: "grey"}}></i>
                            <div dangerouslySetInnerHTML={this.props.custom_component(this.props.result, spans)} />
                        </div>
                    }
                </div>

                {spans.length === 0 ? <Loading />
                    : <div style={{display: "flex", flexDirection: "column", textAlign: "left"}}>
                        <div style={{display: "flex", justifyContent: "space-evenly"}}>
                            {[...Array(nb_time_separation)].map((x, i) => (
                                <div key={i} style={{fontWeight: "lighter", fontSize: "smaller", fontStyle: "italic", width: "9ch"}}>
                                    {formatDuration(this.props.spans.spans[0].duration / (nb_time_separation + 1) * (i + 1))}
                                </div>
                            ))}
                        </div>
                        {this.props.spans.spans.filter(span => 
                            !this.state.hidden_span_children.includes(span.parentId)
                        ).map(span => (
                            <Span key={span.id} span={span} traceStartTs={this.props.spans.spans[0].timestamp}
                                traceDuration={this.props.spans.spans[0].duration} nb_time_separation={nb_time_separation}
                                hideChildren={() => this.hideSpanChildren(span.id)} showChildren={() => this.showSpanChildren(span.id)}
                                isHidden={this.state.hidden_span_children.includes(span.id)}
                                hasChildren={this.props.spans.spans.filter(other_span => other_span.parentId ===span.id).length > 0} />
                        ))}
                    </div>
                }
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
    
        this.toggleTags = this.toggleTags.bind(this);
        this.toggleChildren = this.toggleChildren.bind(this);
    }
    
    toggleTags() {
        this.setState({
            modal: !this.state.modal
        });
    }

    toggleChildren() {
        this.props.isHidden ? this.props.showChildren() : this.props.hideChildren();
    }

    render() {
        const children_toggle_class = this.props.isHidden ? "fa-plus" : "fa-minus";

        let left = (this.props.span.timestamp - this.props.traceStartTs) / this.props.traceDuration * 100;
        let width = Math.max(this.props.span.duration / this.props.traceDuration * 100, 0.2);
        let selected_span = this.state.modal ? {border: "1px solid blue"} : {};
        let error_span = this.props.span.tags["error"] ? {backgroundColor: "rgba(211, 18, 18, 0.3)"} : {backgroundColor: "rgba(30, 129, 196, 0.3)"};
        return (
            <div style={{position: "relative", ':hover': {backgroundColor: "rgba(200, 200, 200, 0.2)"}}} onClick={this.toggleTags}>
                <div style={{display: "flex", justifyContent: "space-evenly", position: "absolute", width: "100%", paddingTop: "5px"}}>
                    {[...Array(this.props.nb_time_separation)].map((x, i) =>
                        (<div key={i} style={{fontWeight: "lighter"}}>&middot;</div>)
                    )}
                </div>
                <div key={children_toggle_class} style={{left: left.toFixed(1) + "%", width: width.toFixed(1) + "%",
                            position: "relative", whiteSpace: "nowrap", margin: "1px", padding: "2px",
                            display: "flex", alignItems: "center", ...selected_span, ...error_span}}>
                    {this.props.hasChildren ?
                        <div style={{paddingRight: "0.3em"}} onClick={(event) => {
                            this.toggleChildren();
                            event.stopPropagation();
                        }}>
                            <i className={"fas " + children_toggle_class} style={{color: "gray", fontSize: "smaller"}}></i>
                        </div>
                        : null
                    }
                    {this.props.span.remoteEndpoint !== null ? 
                        <span className="badge badge-pill badge-info" style={{fontWeight: "inherit" }}>{this.props.span.remoteEndpoint.serviceName}</span>
                        : null
                    }
                    <div style={{padding: "0px 2px"}}>{this.props.span.name}</div>
                    <div style={{fontStyle: "italic", fontSize: "0.7rem"}}>{formatDuration(this.props.span.duration)}</div>
                    <Modal isOpen={this.state.modal} toggle={this.toggleTags} className={this.props.className}
                        size={Object.keys(this.props.span.tags).filter((key, index) => isJson(this.props.span.tags[key])).length > 0 ? "lg" : ""}>
                        <ModalHeader>
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <div>{this.props.span.name}</div>
                                <div style={{fontStyle: "italic"}}>Tags</div>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div style={{display: "flex", justifyContent: "space-between", fontSize: "smaller", fontWeight: "bolder", borderBottom: "2px solid darkgray", marginBottom: "0.7rem"}}>
                                <div style={{flexGrow: 0}}>Span Time Informations</div>
                            </div>
                            <div style={{display: "flex", justifyContent: "space-between", fontSize: "smaller", borderBottom: "1px solid lightgray", padding: "0.2rem 0", backgroundColor: "#FEFEFE"}}>
                                <div style={{flexGrow: 0, width: "150px"}}>Beginning</div>
                                <div style={{flexGrow: 2}}>{dateFormat(new Date(this.props.span.timestamp / 1000), "isoDateTime")}</div>
                            </div>
                            <div style={{display: "flex", justifyContent: "space-between", fontSize: "smaller", borderBottom: "1px solid lightgray", padding: "0.2rem 0", backgroundColor: "#F9F9F9"}}>
                                <div style={{flexGrow: 0, width: "150px"}}>Beginning in span</div>
                                <div style={{flexGrow: 2}}>{formatDuration(this.props.span.timestamp - this.props.traceStartTs)}</div>
                            </div>
                            <div style={{display: "flex", justifyContent: "space-between", fontSize: "smaller", borderBottom: "1px solid lightgray", padding: "0.2rem 0", backgroundColor: "#FEFEFE"}}>
                                <div style={{flexGrow: 0, width: "150px"}}>Duration</div>
                                <div style={{flexGrow: 2}}>{formatDuration(this.props.span.duration)}</div>
                            </div>
                            {this.props.span.remoteEndpoint !== null ? 
                                <div style={{display: "flex", justifyContent: "space-between", fontSize: "smaller", borderBottom: "1px solid lightgray", padding: "0.2rem 0", backgroundColor: "#FEFEFE"}}>
                                    <div style={{flexGrow: 0}}><Link to={"/ikrelln/reports/" + this.props.span.remoteEndpoint.serviceName + "#" + this.props.span.name}>Endpoint Report</Link></div>
                                </div>                        
                                : null}
                            <div style={{display: "flex", justifyContent: "space-between", fontSize: "smaller", fontWeight: "bolder", borderBottom: "2px solid darkgray", marginTop: "1rem", marginBottom: "0.7rem"}}>
                                <div style={{flexGrow: 0, width: "150px"}}>Key</div>
                                <div style={{flexGrow: 2}}>Value</div>
                            </div>
                            {Object.keys(this.props.span.tags).sort().map((key, index) => 
                                <div key={key} style={{display: "flex", justifyContent: "space-between", fontSize: "smaller", borderBottom: "1px solid lightgray",
                                    padding: "0.2rem 0", backgroundColor: index % 2 === 1 ? "#F9F9F9" : "#FEFEFE"}}>
                                    <div style={{flexGrow: 0, width: "150px"}}>{key}</div>
                                    {isJson(this.props.span.tags[key])
                                        ? <div style={{flexGrow: 2, border: "1px dashed darkgray", borderRadius: "3px", backgroundColor: "#F5F5F5", overflow: "auto", padding: "0.1rem 0"}}>
                                            <pre style={{marginBottom: "0"}}>{JSON.stringify(JSON.parse(this.props.span.tags[key]), null, 2).replace(/\\n/g, '\n') }</pre>
                                        </div>
                                        : <div style={{flexGrow: 2}}>{this.props.span.tags[key].replace(/\n/g, '<br />')}</div>
                                    }
                                </div>
                            )}
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        );

    }
}

Span = Radium(Span);

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