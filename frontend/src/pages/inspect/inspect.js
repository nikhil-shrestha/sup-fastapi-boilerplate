import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import './inspect.scss';

import InspectManageNetwork from '../inspectManage';

class Inspect extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }

    }


    render() {

        return (
            <div className="five-g-inspect">
                <div className="fgd-top-head">
                    <span>Inspect</span>
                </div>
                <Switch> 
                    <Route path={this.props.match.path} render={(props) => { return <InspectManageNetwork {...props} /> }} />
                    <Redirect to={this.props.match.path} />

                </Switch>
            </div>
        )
    }
}

export default Inspect;