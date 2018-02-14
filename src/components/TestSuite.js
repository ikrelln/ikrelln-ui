import React, { Component } from 'react';

class TestSuite extends Component {
    render() {
        return (
            <li>
                {this.props.name}
            </li>
        );
    }
}

export default TestSuite;
