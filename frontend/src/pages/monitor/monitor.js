import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import "./monitor.scss";

// import MonitorNetwork from '../monitorNetwork';
import MonitorNetworkElement from "../monitorNetworkElement";
import MonitorLogsElement from "../monitorLogs";
// monitorNetworkNew
import MonitorNetworkNew from "../monitorNetworkNew";
import { Container } from "@material-ui/core";

class Monitor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log("tesst", this.props);

    return (
      <div className="five-g-monitor">
        <div className="fgd-top-head">
          <Container maxWidth="xl">
            <span>
              {this.props.location.pathname.includes("/logs/")
                ? " Monitor Logs"
                : "Monitor Network"}
            </span>
          </Container>
        </div>
        <Switch>
          <Route
            exact
            path={this.props.match.path + "/:id"}
            render={(props) => {
              return <MonitorNetworkElement {...props} />;
            }}
          />
          <Route
            exact
            path={this.props.match.path + "/logs/:id"}
            render={(props) => {
              return <MonitorLogsElement {...props} />;
            }}
          />
          <Route
            path={this.props.match.path}
            render={(props) => {
              return <MonitorNetworkNew {...props} />;
            }}
          />
          <Redirect to={this.props.match.path} />
        </Switch>
      </div>
    );
  }
}

export default Monitor;
