/* eslint-disable implicit-arrow-linebreak */
import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({
  auth: { isAuthenticated, loading },
  component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated && !loading) {
          // not logged in so redirect to login page with the return url
          console.log("props", props.location.pathname.includes("/add-ap"));
          return (
            <Redirect
              to={{
                pathname: props.location.pathname.includes("/add-ap")
                  ? "/login"
                  : "/login",
                state: { from: props.location },
              }}
            />
          );
        }

        return React.createElement(component, props);
      }}
    />
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
