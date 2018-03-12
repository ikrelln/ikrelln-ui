import React, { Component } from 'react';
import { Route, Switch, Redirect, NavLink } from 'react-router-dom';
import dateFormat from 'dateformat';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/styles/hljs';
import { Card, CardHeader, CardText, CardBody, Button, Input } from 'reactstrap';

export class Setup extends Component {
    componentDidMount() {
        if (this.props.scripts.length === 0) {
            this.props.fetchScripts();
        }
    }
    
    render() {
        const ui_test_script = this.props.scripts.filter(script => script.script_type === 'UITestResult')[0];
        const report_scripts = this.props.scripts.filter(script => script.script_type === 'ReportFilterTestResult')
        return (
            <div>
                <ul className="nav nav-tabs" style={{margin: "5px"}}>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={"/ikrelln/setup/uimod"}>
                            UI Scripts
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={"/ikrelln/setup/reportfilter"}>
                            Report Scripts
                        </NavLink>
                    </li>
                </ul>
                <Switch>
                    <Route path="/ikrelln/setup/uimod" render={({match}) => {
                        if (ui_test_script === undefined)
                            return <div style={{textAlign: "left"}}><Script type="UITestResult" language="javascript" saveScript={this.props.saveScript}/></div>
                        return <div style={{textAlign: "left"}}><Script style={{textAlign: "left"}} script={ui_test_script} language="javascript"
                            deleteScript={() => this.props.deleteScript('UITestResult')} saveScript={this.props.updateScript}/></div>;
                    }} />
                    <Route path="/ikrelln/setup/reportfilter" render={({match}) => {
                        return <div style={{textAlign: "left"}}>
                            {report_scripts.map(script => <Script key={script.id} script={script} language="python" 
                                deleteScript={() => this.props.deleteScript(script.id)} saveScript={this.props.updateScript}/>) 
                            }
                            <Script key={report_scripts.length} type="ReportFilterTestResult" language="python" saveScript={this.props.saveScript} />
                            </div>;
                    }} />
                    <Route render={() => <Redirect to="/ikrelln/setup/uimod"/>} />
                </Switch>
            </div>
        );
    }
}

class Script extends Component {
    constructor(props) {
        super(props);

        if (props.script === undefined) {
            this.state = {
                edit: true,
                name: "",
                source: "",
                status: "Enabled",
                text_area_length: 7,
            };
        } else {
            const matches_newlines = props.script.source.match(/\n/g);
            this.state = {
                edit: false,
                name: props.script.name,
                source: props.script.source,
                status: props.script.status,
                text_area_length: matches_newlines === null ? 2 : (matches_newlines.length + 1),
            };
        }

        this.switchEnable = this.switchEnable.bind(this);
        this.edit = this.edit.bind(this);
        this.editName = this.editName.bind(this);
        this.editSource = this.editSource.bind(this);
        this.saveEdit = this.saveEdit.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.script === undefined) {
            this.state = {
                edit: true,
                name: "",
                source: "",
                status: "Enabled",
                text_area_length: 7,
            };
        } else {
            const matches_newlines = nextProps.script.source.match(/\n/g);
            this.setState({
                edit: false,
                name: nextProps.script.name,
                source: nextProps.script.source,
                status: nextProps.script.status,
                text_area_length: matches_newlines === null ? 2 : (matches_newlines.length + 1),
            });
        }
    }


    switchEnable() {
        if ((!this.state.edit) && (this.props.script !== undefined)) {
            let script = {
                ...this.props.script
            };

            script.status = this.state.status === "Enabled" ? "Disabled" : "Enabled";

            this.props.saveScript(script);    
        }

        this.setState((prevState) => ({
            status: prevState.status === "Enabled" ? "Disabled" : "Enabled",
        }));
    }

    edit() {
        this.setState({
            edit: true,
        });
    }

    cancelEdit() {
        this.setState({
            edit: false,
            name: this.props.script.name,
            source: this.props.script.source,
        });
    }

    saveEdit() {
        let script = {
            ...this.props.script
        };
        script.source = this.state.source;
        if (this.props.type !== undefined)
            script.script_type = this.props.type;
        script.name = this.state.name;
        script.status = this.state.status;

        this.props.saveScript(script);

        this.setState({
            edit: false,
        });
    }

    editName(event) {
        this.setState({
            name: event.target.value,
        })
    }
    editSource(event) {
        this.setState({
            source: event.target.value,
        })
    }

    render() {
        const date_added = this.props.script === undefined ? undefined : this.props.script.date_added;
        return (
            <Card style={{marginBottom: "1em"}}>
                <CardHeader>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            {this.state.edit
                                ? <Input placeholder="Script Name" value={this.state.name} onChange={this.editName}/>
                                : <div style={{textTransform: "capitalize", fontSize: "large", marginRight: "1em"}}>{this.state.name}</div>
                            }
                            {date_added === undefined ? null
                                : <div style={{fontSize: "smaller", fontStyle: "italic", fontWeight: "lighter"}}>{dateFormat(new Date(date_added), "isoDateTime")}</div>
                            }
                        </div>
                        <div>
                            <div className="switch" onClick={this.switchEnable}>
                                <input type="checkbox" checked={this.state.status === "Enabled"} onChange={() => {}} />
                                <span className="slider round"></span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <CardText>
                        {this.state.edit
                            ? <textarea className="form-control" placeholder="Script Source" onChange={this.editSource} value={this.state.source} rows={this.state.text_area_length}
                                style={{fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace", fontSize: "87.5%"}}/>
                            : <SyntaxHighlighter language='python' style={docco}>{this.state.source}</SyntaxHighlighter>
                        }
                    </CardText>
                    {this.props.script === undefined 
                        ? <Button className="btn-sm btn-success" style={{marginRight: "0.5em"}} onClick={this.saveEdit}>Save</Button>
                        : <div style={{display: "flex"}}>
                            {this.state.edit ? 
                                <div>
                                    <Button className="btn-sm btn-success" style={{marginRight: "0.5em"}} onClick={this.saveEdit}>Save</Button>
                                    <Button className="btn-sm btn-warning" style={{marginRight: "0.5em"}} onClick={this.cancelEdit}>Cancel</Button>
                                </div>
                                : <Button className="btn-sm btn-info" style={{marginRight: "0.5em"}} onClick={this.edit}>Edit</Button>
                            }
                            <Button className="btn-sm btn-danger" onClick={this.props.deleteScript}>Delete</Button>
                        </div>
                    }
                </CardBody>
            </Card>
        );
    }
}
