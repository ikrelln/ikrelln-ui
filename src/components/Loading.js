import React, { Component } from 'react';

export class Loading extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            overDelay: false,
        };
    }

    componentDidMount() {
        setTimeout(
            () => this.setState({overDelay: true}),
            3000
        );
    }

    render() {
        return (
            <div style={{padding: "20px"}}>
                <div className="loader"></div>
                {this.state.overDelay 
                    ? <div style={{margin: "2em", fontSize: "larger"}}>
                        <div style={{margin: "1em"}}>This is getting too long.</div>
                        <div style={{margin: "1em"}}>The data you requested is not available.</div>
                    </div>
                    : null
                }
            </div>
        )
    }
}
