import React from "react";
import {
  HashRouter,
  Route,
  Switch,
  Redirect,
  useHistory,
} from "react-router-dom";
import Notifications from "react-notify-toast";
import { useDispatch, useSelector } from "react-redux";

import { loadUserStart } from "../../store/auth/auth.actions";
// components
import Layout from "../../Layout";

// pages
import Error from "../../pages/error";
import Login from "../../pages/login";
import SignUpPage from "../../pages/signUp";
import { FastfoodOutlined } from "@material-ui/icons";
import { Auth, Hub } from "aws-amplify";

// context
// import { useUserState } from "../../context/UserContext";

export default function App(props) {
  // global
  // var { isAuthenticated } = useUserState();

  const login = useSelector((state) => state.login);

  const router = useHistory();

  const dispatch = useDispatch();
  React.useEffect(() => {
    console.log("load user start");
    dispatch(loadUserStart());
  }, [dispatch]);

  // Hub.listen('auth', ({ payload }) => {
  //   const { event } = payload;
  //   console.log(payload)
  //   if (event === 'autoSignIn') {
  //     const { username, attributes } = payload.data

  //     if (username && attributes) {

  //       dispatch(authActions.updateUserAuthenticated({ username, uid: attributes.sub, name: attributes.name, company: attributes.company }))

  //     }
  //     // assign user
  //   } else if (event === 'autoSignIn_failure') {
  //     // redirect to sign in page
  //   }
  // })

  return (
    <HashRouter>
      <Notifications options={{ zIndex: 1, top: "64px" }} />
      <Switch>
        {/* <Route exact path="/" render={() => <Redirect to="/deploy" />} /> */}
        {/* <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/dashboard" />}
        /> */}
        <Route
          path="/"
          component={(currProps) => {
            return <Layout {...props} {...currProps} />;
          }}
        />
        <Route component={Error} />
      </Switch>

      {login && (
        <div className="login-main-container">
          <div
            className="login_overlay_panel"
            onClick={() => console.log("click")}
          ></div>
          <div className="login_main_block">
            <SignUpPage></SignUpPage>
          </div>
        </div>
      )}
    </HashRouter>
  );

  // #######################################################################
}
