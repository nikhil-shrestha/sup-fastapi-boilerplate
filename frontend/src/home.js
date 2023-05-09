import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import Routes from "./tools/five-g";

import { updateConfig } from "./store/siteCoordinator/siteCoordinator.actions";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configure: {},
      readConfigureDone: false,
      restoredSessionData: true,
    };

    this.getRoute = this.getRoute.bind(this);
  }

  componentWillMount() {
    console.log("Routes container");

    var thisView = this;
    axios
      .get("configure.json")
      .then(function (res) {
        var configure = res.data;
        thisView.props.updatingConfig(configure);

        thisView.setState({ configure, readConfigureDone: true });
      })
      .catch(function (res) {
        console.log(res);
        console.log("An error occurred configuration");
      });
  }

  getRoute(route) {
    return <Routes config={this.state.configure} />;
  }

  render() {
    return this.state.readConfigureDone &&
      this.state.configure.source &&
      this.state.restoredSessionData ? (
      this.getRoute(this.state.configure.source)
    ) : (
      <span></span>
    ); //Dummy return instead of empty in render
  }
}

const mapStateToProps = (state) => ({
  config: state.config,
});

const mapDispatchToProps = (dispatch) => ({
  updatingConfig(status) {
    dispatch(updateConfig(status));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
