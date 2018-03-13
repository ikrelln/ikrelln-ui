import React, { Component } from 'react';
import { Loading } from './Loading';
import { Link, Switch, Route } from 'react-router-dom';
import { statusToColorSuffix, formatDuration } from '../helper';
import Radium from 'radium';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import dateFormat from 'dateformat';

export class Reports extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            environment: undefined,
            group: window.location.hash === "" ? undefined : window.location.hash.substr(1),
        };

        this.handleEnvironmentChange = this.handleEnvironmentChange.bind(this);
        this.filterByGroup = this.filterByGroup.bind(this);
    }

    handleEnvironmentChange(environment) {
        this.setState({environment: environment});
    }

    componentDidMount() {
        if (this.props.reports === undefined) {
            this.props.fetchReports();
        }
    }

    filterByGroup(group) {
        if (this.state.group !== group) {
            window.location.hash = group;
            this.setState({
                group
            });
        } else {
            window.location.hash = "";
            this.setState({
                group: undefined
            });
        }
    }

    componentWillReceiveProps() {
        if (window.location.hash === "") {
            this.setState({
                group: undefined
            });            
        }
    }

    dateToPeriod(date) {
        const hours = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000 / 60 / 60 / 24);
        if (hours === 0) {
            return "Less than 24 hours ago";
        } else if (hours === 1) {
            return "1 day ago";
        } else {
            return hours + " days ago";
        }

    }

    render() {
        if (this.props.reports === undefined) {
            return (<Loading />);
        }
        const groups = [...new Set(this.props.reports.map(r => r.group))].sort();

        let current_period = "";

        return (
            <div>
                <Switch>
                    <Route path="/ikrelln/reports/:report_group/:report_name" render={({match}) => {
                        const report_key = match.params.report_group + "-" + this.state.environment + "-" + match.params.report_name;
                        return <div>
                            <Report key={report_key} handleEnvironmentChange={this.handleEnvironmentChange} fetchReport={this.props.fetchReport}
                                report_name={match.params.report_name} report_group={match.params.report_group} environment={this.state.environment}
                                report={this.props.report_details === undefined ? undefined : this.props.report_details[report_key]} />
                        </div>
                    }} />
                    <Route path="/ikrelln/reports" render={({match}) => {
                        return (
                            <div style={{display: "flex", flexDirection: "column"}}>
                                {groups.length > 1
                                    ? <div key={this.state.group} style={{display: "flex", justifyContent: "center", padding: "0.5em 0"}}>
                                        {groups.map(group => <div className={"btn btn-sm btn-" + (this.state.group === group ? "info" : this.state.group === undefined ? "primary" : "light")}
                                            style={{textTransform: "capitalize", margin: "0 0.5em"}} key={group} onClick={() => this.filterByGroup(group)}>{group}</div>
                                        )}
                                    </div>
                                    : null
                                }
                                <div style={{display: "flex", flexWrap: "wrap"}} key={this.state.group + "-all"}>
                                    {this.props.reports.filter(report => {
                                        if (this.state.group === undefined)
                                            return true;
                                        return report.group === this.state.group;
                                    }).map(report => 
                                        {
                                            let display_category = false;
                                            const period = this.dateToPeriod(report.last_update);
                                            if (current_period != period) {
                                                display_category = true;
                                                current_period =period
                                            }
                                            return (
                                                <React.Fragment key={"frag" + report.group + "-" + report.name}>
                                                    {display_category ? <div key={period} className="alert alert-info" style={{flex: "0 1 100%", margin: "0.2em 0", padding: "0.2em 0"}}>{period}</div> : null}
                                                    <Link key={report.group + "-" + report.name} to={"/ikrelln/reports/" + report.group + "/" + report.name} 
                                                        style={{flex: "1", margin: "0.5em", padding: "0.5em", minWidth: "15em", minHeight: "7em",
                                                            display: "flex", flexDirection: "column", border: "1px dashed grey", borderRadius: "10px", justifyContent: "center"}}>
                                                        <div style={{flex: "2", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                            <div style={{textTransform: "capitalize"}}>{report.group} - {report.name}</div>
                                                            <div style={{fontSize: "xx-small", fontStyle: "italic"}}>{report.last_update}</div>
                                                        </div>
                                                        <div className="progress">
                                                            {Object.keys(report.summary).sort().map(key => 
                                                                <div className={"progress-bar bg" + statusToColorSuffix(key)} key={key} style={{flex: report.summary[key]}}>{report.summary[key] !== 0 ? report.summary[key] : null}</div>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </React.Fragment>   
                                            )
                                        }
                                    )}
                                </div>
                            </div>
                        );
                    }} />
                </Switch>
            </div>
        );
    }
}

class Report extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            redirected: window.location.hash === "",
            current_hash: "",
            over_test: undefined,
            over_category: undefined,
            full_categories: [],
        }

        this.mouseOverTest = this.mouseOverTest.bind(this);
        this.mouseLeaveTest = this.mouseLeaveTest.bind(this);
        this.showFullCategory = this.showFullCategory.bind(this);
    }

    mouseOverTest(event, category, trace_id) {
        this.setState({
            over_test: trace_id,
            over_category: category
        })
    }
    mouseLeaveTest(event) {
        this.setState({
            over_test: undefined,
            over_category: undefined,
        })
    }
    showFullCategory(category) {
        this.setState((prevState, props) => ({
            full_categories: prevState.full_categories.concat([category])
        }))
    }

    componentDidMount() {
        if (this.props.report === undefined) {
            this.props.fetchReport(this.props.report_group, this.props.report_name, this.props.environment);
        } else {
            const hash = window.location.hash;
            if ((!this.state.redirected) || ((hash !== "") && (this.state.current_hash !== hash))) {
                window.history.replaceState({}, "i'Krelln", window.location.href.split("#")[0])
                setTimeout(function(){ 
                    window.history.replaceState({}, "i'Krelln", window.location.href.split("#")[0] + hash)
                 }, 300);
                 this.setState({
                    redirected: true,
                    current_hash: hash,
                });
            }
        }
    }

    componentDidUpdate() {
        if (this.props.report !== undefined) {
            if ((this.props.environment === undefined) || (!this.props.report.environments.includes(this.props.environment))) {
                this.props.handleEnvironmentChange(this.props.report.environments[0]);
            }
        }
        const hash = window.location.hash;
        if ((!this.state.redirected) || ((hash !== "") && (this.state.current_hash !== hash))) {
            window.history.replaceState({}, "i'Krelln", window.location.href.split("#")[0])
            setTimeout(function(){ 
                window.history.replaceState({}, "i'Krelln", window.location.href.split("#")[0] + hash)
             }, 300);
            this.setState({
                redirected: true,
                current_hash: hash,
            });
        }
    }

    render() {
        if (this.props.report === undefined) {
            return (
                <h2>{this.props.report_name}</h2>
            );
        }

        const tests_to_show = 150;

        return (
            <div>
                <h2 style={{textTransform: "capitalize"}}>{this.props.report_group} - {this.props.report_name}</h2>
                <div>
                    <div className="input-group" style={{margin: "1rem"}}>
                        <div className="input-group-prepend">
                            <label className="input-group-text">Environment</label>
                        </div>
                        <select disabled={this.props.report.environments.length < 2} className="custom-select" id="input-test-result-status-filter" onChange={(event) => this.props.handleEnvironmentChange(event.target.value)} value={this.props.environment}>
                            {this.props.report.environments.map(env => <option key={env}>{env}</option>)}
                        </select>
                    </div>

                    {Object.keys(this.props.report.categories).sort().map((cat, index) => {
                        let tests = this.props.report.categories[cat];
                        let showing = this.state.full_categories.includes(cat) ? tests : tests.slice(0, tests_to_show);                        
                        return (
                            <div key={cat} id={cat} style={{display: "flex", borderBottom: "1px solid gray", padding: "0.7em 0",
                                backgroundColor: this.state.current_hash.substr(1) === cat ? "#E8E8E8" : (index % 2 === 1 ? "#F9F9F9" : "#FEFEFE"), ':hover': {backgroundColor: "rgba(180, 180, 180, 0.2)"}}}>
                                <div style={{fontWeight: "bolder", flex: "1", minWidth: "400px", maxWidth: "400px", display: "flex", alignItems: "center"}}>
                                    <Link to={"/ikrelln/reports/" + this.props.report_group + "/" + this.props.report_name + "#" + cat} style={{textAlign: "left"}}>{cat}</Link>
                                </div>
                                <div style={{display: "flex", flex: "4", flexWrap: "wrap", justifyContent: "flex-start"}}>
                                    {showing.map(test =>
                                        <div id={"t-" + index + "-" + test.trace_id} key={test.trace_id}>
                                            <Link key={test.test_id} onMouseEnter={(event) => this.mouseOverTest(event, index, test.trace_id)} onMouseLeave={this.mouseLeaveTest}
                                                    className={"btn btn-sm btn" + statusToColorSuffix(test.status)}
                                                    to={"/ikrelln/tests/" + test.test_id + "/results/" + test.trace_id} style={{margin: "0.3em"}}>
                                                    {this.state.over_test === test.trace_id
                                                        ? <div style={{width: "1em"}}>x</div>
                                                        : <div style={{width: "1em"}}>&nbsp;</div>
                                                    }
                                            </Link>
                                            { (this.state.over_test === test.trace_id) && (this.state.over_category === index) ? 
                                                <Popover placement="left" isOpen={(this.state.over_test === test.trace_id) && (this.state.over_category === index)} 
                                                    target={"#t-" + index + "-" + test.trace_id} toggle={this.toggle}>
                                                    <PopoverHeader>{test.name}</PopoverHeader>
                                                    <PopoverBody>
                                                        <div>
                                                            <ol className="breadcrumb" style={{padding: "0", backgroundColor: "inherit"}}>
                                                                {test.path.map(item => 
                                                                    <li className="breadcrumb-item" key={item}>{item}</li>
                                                                )}
                                                            </ol>
                                                            <div style={{fontSize: "smaller", fontStyle: "italic"}}>
                                                                {dateFormat(new Date(test.date / 1000), "isoDateTime")}
                                                            </div>
                                                            <div style={{fontSize: "smaller"}}>
                                                                took {formatDuration(test.duration)}
                                                            </div>
                                                        </div>
                                                    </PopoverBody>
                                                </Popover>
                                                : null
                                            }
                                        </div>
                                    )}
                                    {!this.state.full_categories.includes(cat) && tests.length > tests_to_show
                                        ? <div className="btn btn-sm btn-info" style={{margin: "0.3em"}} onClick={(event) => this.showFullCategory(cat)}>
                                            and {tests.length - tests_to_show} more...
                                        </div>
                                        : null
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

Report = Radium(Report);
