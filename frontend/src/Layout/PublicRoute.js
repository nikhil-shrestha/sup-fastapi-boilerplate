import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PublicRoute = ({
  auth: { isAuthenticated, loading },
  component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated && !loading) {
          console.log("isAuthenticated", props);
          let pathname = '/'
          if (
            props.location?.state &&
            props.location?.state.from &&
            props.location?.state?.from.pathname
          ) {
            pathname = props.location?.state?.from.pathname + props.location?.state?.from.search
          }
          return (
            <Redirect
              to={{
                pathname: pathname,
              }}
            />)
        }

        return (
          React.createElement(component, props)
        );
      }}
    />
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PublicRoute);