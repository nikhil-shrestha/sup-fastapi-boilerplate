import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import "./manage.scss";

import ManageNetwork from "../manageNetwork";
import ManageNetworkNodes from "../manageNetworkNodes";
import AddEdgeNode from "../addEdgeNode";

import ManageAppDeployment from "../manageAppDeployment";
import { Container, Toolbar } from "@material-ui/core";

class Manage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="five-g-manage">
        <div className="fgd-top-head">
          <Container maxWidth={"xl"}>
            <Toolbar>
              <span style={{ marginLeft: "-5px" }}>Manage Network</span>
            </Toolbar>
          </Container>
        </div>
        <Switch>
          <Route
            path={this.props.match.path + "/addedge"}
            render={(props) => {
              return <AddEdgeNode {...props} />;
            }}
          />
          <Route
            path={this.props.match.path + "/gnodes"}
            render={(props) => {
              return <ManageNetworkNodes {...props} />;
            }}
          />

          <Route
            path={this.props.match.path + "/deployment"}
            render={(props) => {
              return <ManageAppDeployment {...props} />;
            }}
          />

          <Route
            path={this.props.match.path}
            render={(props) => {
              return <ManageNetwork {...props} />;
            }}
          />
          <Redirect to={this.props.match.path} />
        </Switch>
      </div>
    );
  }
}

export default Manage;
