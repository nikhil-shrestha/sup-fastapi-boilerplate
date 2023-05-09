import { Box, Container, CssBaseline } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import LinearStepper from "./linearStepper";
import "./stepperAddAP.scss";
import { Redirect } from "react-router-dom";

function StepperAddAP(props) {
  const { auth } = props;

  if (!auth.isAuthenticated) {
    // user is not authenticated, redirect to login page
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: props.location },
        }}
      />
    );
  }

  return (
    <div className="access_point_container">
      <div className="fgd-top-head">
        <Container maxWidth={"xl"} component={Box}>
          <span>Deploy 5-Fi Access Points</span>
        </Container>
      </div>
      <Container maxWidth={"xl"} component={Box} mt={"20px"}>
        <Box width={"60%"}>
          <LinearStepper auth={auth} />
        </Box>
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => ({
  config: state.siteCoordinator.config,
  toaster: state.siteCoordinator.toaster,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StepperAddAP);
