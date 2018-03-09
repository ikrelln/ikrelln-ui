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
            environment: this.props.environments.length === 0 ? "" : this.props.environments[0]
        };
        this.handleEnvironmentChange = this.handleEnvironmentChange.bind(this);
    }

    handleEnvironmentChange(environment) {
        this.setState({environment: environment.target.value});
    }

    componentDidMount() {
        if (this.props.reports === undefined) {
            this.props.fetchReports();
        }
        if (this.props.environments.length === 0) {
            this.props.fetchEnvironments();
        }
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.environments.length === 0) && (nextProps.environments.length !== 0)) {
            this.setState({environment: nextProps.environments[0]});
        }
    }

    
    render() {
        if (this.props.reports === undefined) {
            return (<Loading />);
        }

        return (
            <div>
                <Switch>
                    <Route path="/ikrelln/reports/:report_name" render={({match}) => 
                        <div>
                                <div className="input-group" style={{margin: "0 1rem"}}>
                                    <div className="input-group-prepend">
                                        <label className="input-group-text">Environment</label>
                                    </div>
                                    <select className="custom-select" id="input-test-result-status-filter" onChange={this.handleEnvironmentChange} value={this.state.environment}>
                                        {this.props.environments.map(env => <option key={env}>{env}</option>)}
                                    </select>
                                </div>
                            <Report key={this.state.environment + "-" + match.params.report_name}
                                environment={this.state.environment} report_name={match.params.report_name} fetchReport={this.props.fetchReport}
                                report={this.props.report_details === undefined ? undefined : this.props.report_details[this.state.environment + "-" + match.params.report_name]} />
                        </div>
                    } />
                    <Route path="/ikrelln/reports" render={({match}) => {
                        return (
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <h1>Reports</h1>
                                <div style={{display: "flex", flexWrap: "wrap"}}>
                                    {this.props.reports.map(report => 
                                        <Link key={report.name} to={"/ikrelln/reports/" + report.name} 
                                            style={{flex: "1", margin: "0.5em", padding: "0.5em", minWidth: "15em", minHeight: "5em",
                                                display: "flex", flexDirection: "column", border: "1px dashed grey", borderRadius: "10px", justifyContent: "center"}}>
                                            <div style={{textTransform: "capitalize"}}>{report.name}</div>
                                            <div style={{fontSize: "xx-small", fontStyle: "italic"}}>{report.last_update}</div>
                                        </Link>
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
            redirected: false,
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
            this.props.fetchReport(this.props.report_name, this.props.environment);
        } else {
            const hash = window.location.hash;
            if ((!this.state.redirected) || ((hash !== "") && (this.state.current_hash !== hash))) {
                window.location.hash = "";
                setTimeout(function(){ 
                    window.location.hash = hash;
                 }, 300);
                 this.setState({
                    redirected: true,
                    current_hash: hash,
                });
            }
        }
    }

    componentDidUpdate() {
        const hash = window.location.hash;
        if ((!this.state.redirected) || ((hash !== "") && (this.state.current_hash !== hash))) {
            window.location.hash = "";
            setTimeout(function(){ 
                window.location.hash = hash;
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
                <h2 style={{textTransform: "capitalize"}}>{this.props.report_name}</h2>
                <div>
                    {Object.keys(this.props.report.categories).sort().map((cat, index) => {
                        let tests = this.props.report.categories[cat];
                        let showing = this.state.full_categories.includes(cat) ? tests : tests.slice(0, tests_to_show);
                        return (
                            <div key={cat} id={cat} style={{display: "flex", borderBottom: "1px solid gray", padding: "0.7em 0",
                                backgroundColor: index % 2 === 1 ? "#F9F9F9" : "#FEFEFE", ':hover': {backgroundColor: "rgba(180, 180, 180, 0.2)"}}}>
                                <div style={{fontWeight: "bolder", flex: "1", minWidth: "400px", maxWidth: "400px", display: "flex", alignItems: "center"}}>
                                    <Link to={"/ikrelln/reports/" + this.props.report_name + "#" + cat} style={{textAlign: "left"}}>{cat}</Link>
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
                                            <Popover placement="left" isOpen={(this.state.over_test === test.trace_id) && (this.state.over_category === index)} 
                                                target={"#t-" + index + "-" + test.trace_id} toggle={this.toggle}>
                                                <PopoverHeader>{test.name}</PopoverHeader>
                                                <PopoverBody>
                                                    <div>
                                                        {test.path.map(item => 
                                                            <div key={item}>> {item}</div>
                                                        )}
                                                        <div style={{fontSize: "smaller", fontStyle: "italic"}}>
                                                            {dateFormat(new Date(test.date / 1000), "isoDateTime")}
                                                        </div>
                                                        <div style={{fontSize: "smaller"}}>
                                                            took {formatDuration(test.duration)}
                                                        </div>
                                                    </div>
                                                </PopoverBody>
                                            </Popover>
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
