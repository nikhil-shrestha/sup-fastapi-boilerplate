import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@mui/material/Box";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";

import "./signUPForm.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),

    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "300px",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  // console.log("children :", children, "value :", value, "index :", index);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function signInProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const SignUpForm = ({ handleClose }) => {
  const classes = useStyles();
  // create state variables for each input
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signInTabSection, setFirstTabSectionChange] = useState(0);

  const handleFirstSectionChange = (event, newValue) => {
    console.log("newValue :", newValue);
    setFirstTabSectionChange(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(firstName, company, email, password);
    console.log("tessst");
    // handleClose();
  };

  return (
    <Fragment>
      <div className="signup-inner-section">
        <Box sx={{ width: "100%" }} className="signin-signup-tabs">
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={signInTabSection}
              onChange={handleFirstSectionChange}
              aria-label="inspect manage tabs"
            >
              <Tab label="Sign Up" {...signInProps(0)} />
              <Tab label="Sign In" {...signInProps(1)} />
            </Tabs>
          </Box>

          <TabPanel className="sign-up-tab" value={signInTabSection} index={0}>
            <form className={classes.root} onSubmit={handleSubmit}>
              <TextField
                label="Name"
                variant="filled"
                // required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Company"
                variant="filled"
                // required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <TextField
                label="Email"
                variant="filled"
                type="email"
                // required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                variant="filled"
                type="password"
                // required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="sign-up-bottom-section">
                <span className="remember-me-button">Remember me</span>
                <span className="forgot-password-button">Forgot password</span>
              </div>

              <div className="sign-up-footer-section">
                {/* <Button variant="contained" onClick={handleClose}>
                  Cancel
                </Button> */}
                <Button type="submit" variant="contained" color="primary">
                  SignUp
                </Button>
              </div>
            </form>

            <div className="footer-sub-section">
              Already have an account, Please
              <span className="sign-in-title"> Sign In!</span>
            </div>
          </TabPanel>

          <TabPanel className="sign-in-tab" value={signInTabSection} index={1}>
            <form className={classes.root} onSubmit={handleSubmit}>
              <TextField
                label="Name"
                variant="filled"
                // required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Password"
                variant="filled"
                type="password"
                // required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="sign-up-bottom-section">
                <span className="remember-me-button">Remember me</span>
                <span className="forgot-password-button">Forgot password</span>
              </div>

              <div className="sign-up-footer-section">
                <Button type="submit" variant="contained" color="primary">
                  SignIn
                </Button>
              </div>
            </form>

            <div className="footer-sub-section">
              If don't have an account, please{" "}
              <span className="sign-in-title">Sign UP!</span>
            </div>
          </TabPanel>
        </Box>
      </div>
    </Fragment>
  );
};

export default SignUpForm;
