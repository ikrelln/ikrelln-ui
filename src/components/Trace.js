import React, { Component } from 'react';
import { Loading } from './Loading';
import { formatDuration, statusToColorSuffix, isJson, randomId } from '../helper';
import dateFormat from 'dateformat';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import Radium from 'radium';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

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
        if (this.props.spans !== undefined) {
            if (this.props.onlyTopLevel) {
                this.props.spans.spans
                    .filter(span => span.parentId === this.props.trace_id)
                    .map(span => this.hideSpanChildren(span.id));
            }    
        }
    }

    render() {
        if (this.props.result === undefined) {
            return (<Loading />);
        }
        const spans = this.props.spans === undefined ? [] : this.props.spans.spans;
        let status_class = "alert" + statusToColorSuffix(this.props.result.status);
        const nb_time_separation = 4;

        const time_margin_ratio = 1.25;

        return (
            <div>
                <div style={{display: "flex"}}>
                    <div className={"alert  " + status_class} style={{fontSize: "1.5rem", fontWeight: "bold", flex: 1, zIndex: 1005}}>{this.props.result.status}</div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0.6rem", marginLeft: "0.4rem", zIndex: 1005}} className="alert alert-secondary">
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
                    <div style={{flex: "2", display: "flex", justifyContent: "center", zIndex: 1005}}>
                        <div style={{paddingRight: "1rem"}}>
                            <i className="fas fa-calendar-alt" style={{color: "gray"}}></i>
                        </div>
                        <div>
                            {dateFormat(new Date(this.props.result.date / 1000), "isoDateTime")}
                        </div>
                    </div>
                    <div style={{flex: "1", display: "flex", justifyContent: "center", zIndex: 1005}}>
                        <div style={{paddingRight: "1rem"}}>
                            <i className="fas fa-stopwatch" style={{color: "gray"}}></i>
                        </div>
                        <div>
                            {formatDuration(this.props.result.duration)}
                        </div>
                    </div>
                    {this.props.result.environment !== null 
                        ? <div style={{flex: "1", display: "flex", justifyContent: "center", zIndex: 1005}}>
                            <div style={{paddingRight: "1rem"}}>
                                <i className="fas fa-globe" style={{color: "gray"}}></i>
                            </div>
                            <div>
                                {this.props.result.environment}
                            </div>
                        </div>
                        : null
                    }
                    {(this.props.custom_component === undefined) || (spans.length === 0)
                        ? null
                        : <div style={{flex: "1", margin: "0.2em", border: "1px dashed lightgray", borderRadius: "5px", backgroundColor: "bisque", display: "flex", position: "relative", justifyContent: "center", zIndex: 1005}}>
                            <i className="fas fa-magic" style={{position: "absolute", top: "5px", left: "5px", color: "grey"}}></i>
                            <div dangerouslySetInnerHTML={this.props.custom_component(this.props.result, spans)} />
                        </div>
                    }
                </div>

                {spans.length === 0 ? <Loading />
                    : <ScrollSyncPane><div style={{display: "flex", flexDirection: "column", textAlign: "left", overflowX: "scroll"}}>
                        <div style={{display: "flex", justifyContent: "space-evenly", zIndex: 1005}}>
                            {[...Array(nb_time_separation)].map((x, i) => (
                                <div key={i} style={{fontWeight: "lighter", fontSize: "smaller", fontStyle: "italic", width: "9ch"}}>
                                    {formatDuration(this.props.spans.spans[0].duration * time_margin_ratio / (nb_time_separation + 1) * (i + 1))}
                                </div>
                            ))}
                        </div>
                        {this.props.spans.spans.filter(span => 
                            !this.state.hidden_span_children.includes(span.parentId)
                        ).map(span => (
                            <Span key={span.id} span={span} traceStartTs={this.props.spans.spans[0].timestamp}
                                traceDuration={this.props.spans.spans[0].duration * time_margin_ratio} nb_time_separation={nb_time_separation}
                                hideChildren={() => this.hideSpanChildren(span.id)} showChildren={() => this.showSpanChildren(span.id)}
                                isHidden={this.state.hidden_span_children.includes(span.id)}
                                hasChildren={this.props.spans.spans.filter(other_span => other_span.parentId ===span.id).length > 0}
                                notice={span.parentId === null || (this.props.notice !== undefined ? this.props.notice.includes(span.id) || this.props.notice.includes(span.parentId) : false)} />
                        ))}
                    </div></ScrollSyncPane>
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
        let border = this.state.modal ? {border: "1px solid blue"} : {};
        let background = this.props.span.tags["error"] ? {backgroundColor: "rgba(211, 18, 18, 0.3)"} : {backgroundColor: "rgba(30, 129, 196, 0.3)"};
        let background_line = {backgroundColor: "inherit"};
        if (this.props.notice || (this.props.span.display === false)) {
            background_line = {zIndex: 1005}
        }
        let timeline_position = this.props.span.display === false ? {position: "block"} : {position: "absolute"};

        return (
            <div style={{position: "relative", ':hover': {backgroundColor: "rgba(200, 200, 200, 0.2)"}, ...background_line}} onClick={this.toggleTags}>
                <div style={{display: "flex", justifyContent: "space-evenly", width: "100%", paddingTop: "2px", ...timeline_position}}>
                    {[...Array(this.props.nb_time_separation)].map((x, i) =>
                        (<div key={i} style={{fontWeight: "lighter", padding: "2px 0"}}>&middot;</div>)
                    )}
                </div>
                {this.props.span.display === false
                    ? null
                    : <div key={children_toggle_class} style={{left: left.toFixed(1) + "%", width: width.toFixed(1) + "%",
                                position: "relative", whiteSpace: "nowrap", margin: "1px", padding: "2px",
                                display: "flex", alignItems: "center", ...border, ...background}}>
                        {this.props.hasChildren ?
                            <div style={{paddingRight: "0.3em"}} onClick={(event) => {
                                this.toggleChildren();
                                event.stopPropagation();
                            }}>
                                <i className={"fas " + children_toggle_class} style={{color: "darkblue", fontSize: "smaller"}}></i>
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
                                        <div style={{flexGrow: 0}}><Link to={"/ikrelln/reports/endpoints/" + this.props.span.remoteEndpoint.serviceName + "#" + this.props.span.name}>Endpoint Report</Link></div>
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
                }
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

        const spansBaseTopLevel = this.props.spansBase.spans.filter(span => span.parentId === this.props.spansBase.trace_id);
        const spansWithTopLevel = this.props.spansWith.spans.filter(span => span.parentId === this.props.spansWith.trace_id);

        var blank_span = (trace_id, parent_id) => {
            return {
                traceId: trace_id,
                parentId: parent_id,
                id: randomId(),
                display: false,
                tags: [],
                annotations: [],
                binaryAnnotations: [],
                debug: false,
                shared: false,
                timestamp: 0,
                duration: 0,
                kind: "CLIENT",
                localEndpoint: null,
                remoteEndpoint: null,
                name: "",
            }
        }
        var spans_aligned_base = [this.props.spansBase.spans[0]];
        var spans_aligned_with = [this.props.spansWith.spans[0]];
        var notice_base = [];
        var notice_with = [];
        var i_base = 0;
        var i_with = 0;
        while (i_base < spansBaseTopLevel.length) {
            var i_with_current = i_with;
            while (i_with_current < spansWithTopLevel.length) {
                if (spansBaseTopLevel[i_base].name === spansWithTopLevel[i_with_current].name) {
                    break;
                }
                i_with_current += 1;
            }
            if (i_with_current === spansWithTopLevel.length) {
                notice_base.push(spansBaseTopLevel[i_base].id)
                spans_aligned_with.push(blank_span(this.props.spansWith.trace_id, this.props.spansWith.trace_id, this.props.spansWith.spans[0].timestamp));
            } else {
                while (i_with < i_with_current) {
                    notice_with.push(spansWithTopLevel[i_with].id);
                    spans_aligned_base.push(blank_span(this.props.spansBase.trace_id, this.props.spansBase.trace_id, this.props.spansBase.spans[0].timestamp));
                    spans_aligned_with.push(spansWithTopLevel[i_with]);
                    this.props.spansWith.spans
                        .filter(span => span.parentId === spansWithTopLevel[i_with].id)
                        .forEach(span => spans_aligned_with.push(span));
                    i_with += 1;
                }
                if (!Object.equals(spansBaseTopLevel[i_base].tags, spansWithTopLevel[i_with].tags)) {
                    notice_base.push(spansBaseTopLevel[i_base].id)
                    notice_with.push(spansWithTopLevel[i_with].id)
                }
                spans_aligned_with.push(spansWithTopLevel[i_with]);
                this.props.spansWith.spans
                    .filter(span => span.parentId === spansWithTopLevel[i_with].id)
                    .forEach(span => spans_aligned_with.push(span));
                i_with += 1;
            }
            spans_aligned_base.push(spansBaseTopLevel[i_base]);
            this.props.spansBase.spans
                .filter(span => span.parentId === spansBaseTopLevel[i_base].id)
                .forEach(span => spans_aligned_base.push(span));
            i_base += 1;
        }

        return (
            <div style={{position: "relative"}}>
                <div style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#FFFFFF", opacity: 0.8, zIndex: 1000, pointerEvents: "none"}}></div>
                <ScrollSync>
                    <div style={{display: "flex"}}>
                        <div style={{width: "50%", paddingRight: "5px"}}>
                            <Trace key={this.props.base} trace_id={this.props.base} spans={{
                                trace_id: this.props.spansBase.trace_id,
                                spans: spans_aligned_base,
                            }} result={this.props.testResultBase} notice={notice_base} onlyTopLevel={true} />
                        </div>
                        <div style={{width: "50%", paddingLeft: "5px"}}>
                            <Trace key={this.props.with} trace_id={this.props.with} spans={{
                                trace_id: this.props.spansWith.trace_id,
                                spans: spans_aligned_with,
                            }} result={this.props.testResultWith} notice={notice_with} onlyTopLevel={true} />
                        </div>
                    </div>
                </ScrollSync>
            </div>
        );
    }
}

Object.equals = function( x, y ) {
    if ( x === y ) return true;
    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    if ( x.constructor !== y.constructor ) return false;

    for ( var p in x ) {
        if (p === "peer.hostname") continue;
        if ( ! x.hasOwnProperty( p ) ) continue;  
        if ( ! y.hasOwnProperty( p ) ) return false;
        if ( x[ p ] === y[ p ] ) continue;
        if ( typeof( x[ p ] ) !== "object" ) return false;
        if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
    }
  
    for ( p in y ) {
        if (p === "peer.hostname") continue;
        if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
    }

    return true;
  }
