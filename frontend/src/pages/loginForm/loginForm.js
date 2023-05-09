import { Box, InputAdornment, TextField, Typography } from "@material-ui/core";
import React from "react";
import CustomButton from "../../components/CustomButton";
import { Person as AccountIcon, VpnKey as Key } from "@material-ui/icons";
import "./loginForm.scss";
import { withRouter } from "react-router-dom";
import axios from "axios";
import apiServices from "../../services/apiService";
import { notify } from "react-notify-toast";
import { connect, useDispatch, useSelector } from "react-redux";
import { Auth } from "aws-amplify";
import * as authActions from "../../store/auth/auth.actions";

import { Redirect } from "react-router-dom";

const LoginForm = (props) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();

  async function demoLoginUser(router, setIsLoading) {
    setIsLoading(true);

    dispatch(
      authActions.signinStart(
        {
          username: email,
          password: password,
        },
        props.history,
        props.location
      )
    );
  }

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // if (isAuthenticated) {
  //   return <Redirect to="/home" />;
  // }

  return (
    <Box
      component={"form"}
      onSubmit={() =>
        demoLoginUser(email, password, props.history, setIsLoading)
      }
      className="login-container"
    >
      <Box className="login-avatar">
        <AccountIcon />
      </Box>
      <div className="form">
        <Typography color="text" className="form_title">
          User Login
        </Typography>

        <TextField
          fullWidth
          id="filled-basic"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <AccountIcon />
              </InputAdornment>
            ),
            disableUnderline: true,
            placeholder: "Email Address",
            className: "form_textfield",
          }}
        />
        <TextField
          fullWidth
          id="filled-basic"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            margin: "30px 0",
          }}
          type="password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <Key />
              </InputAdornment>
            ),
            disableUnderline: true,
            placeholder: "Password",
            className: "form_textfield",
          }}
        />
        <CustomButton
          type={"submit"}
          fullWidth={true}
          onClick={() => {
            demoLoginUser(props.history, setIsLoading);
          }}
          background={"#1F3BB3"}
          disabled={isLoading}
          sx={{
            height: "57px",
            borderRadius: "10px",
            fontFamily: "Poppins",
            fontWeight: 600,
            fontSize: { xs: "16px", lg: "18px", xl: "22px" },
            lineHeight: { xs: "16px", lg: "22px", xl: "33px" },
            color: "#FFFFFF",
          }}
        >
          {isLoading ? "loading" : "LOGIN"}
        </CustomButton>
      </div>
      <Typography color="text" className="forgot_password">
        Forgot <span>Password</span>?
      </Typography>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  config: state.siteCoordinator.config,
  toaster: state.siteCoordinator.toaster,
  deploy: state.siteCoordinator.deploy,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LoginForm));
