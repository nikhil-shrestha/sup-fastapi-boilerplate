import { CssBaseline, Container, Paper, Box } from "@material-ui/core";
import React, { Component } from 'react';

import LinearStepper from "./linearStepper";

import './stepperCoreFlow.scss';

class StepperCoreFlow extends Component {
    constructor(props) {
        super(props);
        this.state = {}

    }

    render() {

        return (
            <div className="network_container">
                <CssBaseline />
                <Container component={Box} p={4}>
                    <Paper component={Box} p={3} className="paperComp">
                        <LinearStepper {...this.props} />
                    </Paper>
                </Container>
            </div>
        )
    }

}

export default StepperCoreFlow;