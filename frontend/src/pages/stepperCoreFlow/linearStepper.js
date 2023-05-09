import {
  Button,
  CircularProgress,
  Grid,
  Grow,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import React, { Component } from "react";
import InputRange from "react-input-range";
import { notify } from "react-notify-toast";
import { connect } from "react-redux";

import Select from "react-select";

import { FormProvider } from "react-hook-form";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
// import Select, { SelectChangeEvent } from '@mui/material/Select';

//logos

import AP_5G_navy_icon from "../../images/new_flow_images/AP_5G_navy.svg";
import build_5G_navy_icon from "../../images/new_flow_images/build_5G_navy.svg";
import core_5G_navy_icon from "../../images/new_flow_images/core_5G_navy.svg";
import device_5G_navy_icon from "../../images/new_flow_images/device_5G_navy.svg";

import { Auth } from "aws-amplify";
import floor_plan_icon from "../../images/new_flow_images/floor_plan.png";

import { loadUserSuccess, signupStart } from "../../store/auth/auth.actions";

import "react-input-range/lib/css/index.css";

import { withRouter } from "react-router-dom";
import apiService from "../../services/apiService";

class LinaerStepper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10,
      name: "",
      company: "",
      email: "",
      password: "",
      verificationCode: "",
      devices_info: [
        {
          name: "Cameras",
          numberOfDevices: 1,
          selectedMake: { value: "OAI", label: "OAI" },
        },
        {
          name: "Sensors",
          numberOfDevices: 1,
          selectedMake: { value: "OAI", label: "OAI" },
        },
        {
          name: "AGVs",
          numberOfDevices: 1,
          selectedMake: { value: "OAI", label: "OAI" },
        },
        {
          name: "Actuators",
          numberOfDevices: 1,
          selectedMake: { value: "OAI", label: "OAI" },
        },
        {
          name: "Others",
          numberOfDevices: 1,
          selectedMake: { value: "OAI", label: "OAI" },
        },
      ],
      makeOptions: [
        { value: "UERANSIM", label: "UERANSIM" },
        { value: "OAI", label: "OAI" },
        { value: "srsRAN", label: "srsRAN" },
      ],
      numberOf5gNetworks: 1,
      fiveGCoreData: [],
      selectedCore: null,
      numberOf5gAccessPoints: 2,
      fiveGAccessPointData: [],
      selectedAccessPoint: null,
      activeStep: 0,
      steps: [0, 1, 2, 3, 4],
      deployNetworkUnderProgress: false,
      displaySignUp: false,
      signUpProgress: false,
      codeSent: false,
    };
  }

  componentDidMount() {
    this.getCoresList();
    this.getAccessPointsList();
    const { auth } = this.props;
    if (auth.isAuthenticated) {
      this.setState({ activeStep: 2 });
    }
  }
  componentDidUpdate(prevProps) {
    const { auth } = this.props;
    if (auth.isAuthenticated !== prevProps.auth.isAuthenticated) {
      this.setState({ activeStep: 2 });
    }
  }
  handleOnChange = (event) => {
    let value = event.target.value;
    if (
      event.target.name === "numberOf5gNetworks" ||
      event.target.name === "numberOf5gAccessPoints"
    )
      value = value.trim() !== "" ? parseInt(value) : 0;

    this.setState({ [event.target.name]: value });
  };

  buildYour5GNetworkForm = () => {
    const { name, company, email, password, displaySignUp } = this.state;

    return (
      <Grid container spacing={2}>
        <Grid
          item
          lg={12}
          md={12}
          xs={12}
          className="fgm-inner-grid BuildYour5GNetworkForm"
        >
          <div className="form-title-block">
            <img
              src={build_5G_navy_icon}
              alt="build_5G_navy_icon"
              className="navy_icon"
            />
            <span className="form-title">Build Your 5G Network</span>
          </div>

          <div className="form-main-block">
            <div className="already-member-title">
              Already a member, please
              <span
                onClick={() => this.props.history.push({ pathname: "/login" })}
                className="signin-title"
              >
                Sign In!
              </span>
            </div>
            <div className="donot-have-account-title">
              Don’t have an account, not a problem. Continue to choose your 5G
              Network
            </div>
            <br />
            <div className="form_container">
              <div>
                <div className="form-group input_group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    className="form-control"
                    name="name"
                    onChange={this.handleOnChange}
                    spellCheck={false}
                  />
                </div>
                <br />
                <br />
                <div className="form-group input_group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={company}
                    className="form-control"
                    name="company"
                    onChange={this.handleOnChange}
                    spellCheck={false}
                  />
                </div>
                <br />
              </div>

              {displaySignUp && (
                <Grow in={displaySignUp}>
                  <div>
                    <div className="form-group input_group">
                      <label>Email</label>
                      <input
                        type="text"
                        value={email}
                        className="form-control"
                        name="email"
                        onChange={this.handleOnChange}
                        spellCheck={false}
                      />
                    </div>
                    <br />
                    <br />
                    <div className="form-group input_group">
                      <label>Password</label>
                      <input
                        type="password"
                        value={password}
                        className="form-control"
                        name="password"
                        onChange={this.handleOnChange}
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </Grow>
              )}
            </div>
          </div>
        </Grid>
      </Grid>
    );
  };

  resendCode = async () => {
    try {
      let { activeStep } = this.state;
      let email = localStorage.getItem("registerEmail");

      const response = await Auth.resendSignUp(email);
      console.log(response);
      this.setState({ codeSent: true });
      setTimeout(() => {
        this.setState({ codeSent: false });
      }, 10000);
      notify.show(
        "Code resent",
        "custom",
        this.props.toaster.duration,
        this.props.toaster.success
      );
    } catch (error) {
      console.log(error);
      notify.show(
        error.message,
        "custom",
        this.props.toaster.duration,
        this.props.toaster.error
      );
    }
  };

  validateStep = () => {
    const { verificationCode, codeSent } = this.state;

    return (
      <Grid container spacing={2}>
        <Grid
          item
          lg={12}
          md={12}
          xs={12}
          className="fgm-inner-grid BuildYour5GNetworkForm"
        >
          <div className="form-title-block">
            <img
              src={build_5G_navy_icon}
              alt="build_5G_navy_icon"
              className="navy_icon"
            />
            <span className="form-title">Build Your 5G Network</span>
          </div>

          <div className="form-main-block">
            <div className="already-member-title">
              Already a member, please{" "}
              <span className="signin-title">Sign In!</span>
            </div>
            <div className="donot-have-account-title">
              Don’t have an account, not a problem. Continue to choose your 5G
              Network
            </div>
            <br />
            <div className="form_container">
              <div>
                <div className="form-group input_group">
                  <label>Verification Code (Check your email)</label>
                  <input
                    type="text"
                    value={verificationCode}
                    className="form-control"
                    name="verificationCode"
                    onChange={this.handleOnChange}
                    spellCheck={false}
                  />
                </div>
                <Button disabled={codeSent} onClick={() => this.resendCode()}>
                  Resend Code
                </Button>
                <br />
                <br />
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    );
  };

  getCoresList = () => {
    var thisView = this;
    if (this.coreOptionsToken) this.coreOptionsToken.cancel();
    this.coreOptionsToken = axios.CancelToken.source();

    this.setState({ callUnderProgress: true });
    axios
      .all([apiService.getCoresList(this.coreOptionsToken.token)])
      .then(function (res) {
        if (res[0]) {
          if (res[0] && res[0]["data"]) {
            thisView.setState({ fiveGCoreData: res[0]["data"] });
          }

          thisView.setState({ callUnderProgress: false });
        }
      })
      .catch(function (res) {
        console.log(res);
        console.log("An error occurred add subscriber element service");
        thisView.setState({ callUnderProgress: false });
      });
  };

  updateSelectedCore = (selectedCore) => {
    this.setState({ selectedCore });
  };

  fiveGCoreOptional = () => {
    const { fiveGCoreData, numberOf5gNetworks, selectedCore } = this.state;

    return (
      <Grid container spacing={2}>
        <Grid
          item
          lg={12}
          md={12}
          xs={12}
          className="fgm-inner-grid FiveGCoreOptional"
        >
          <div className="form-title-block">
            <img
              src={core_5G_navy_icon}
              alt="core_5G_navy_icon"
              className="navy_icon"
            />
            <span className="form-title">5G Core</span>
          </div>

          <br />

          <div className="form-main-block">
            <div className="five-g-core-sub-title">
              A 5G core is the brains of the 5G network. It is centralized
              control software and manages authentication, data flows within the
              network. Pick one of the 5G core from below vendors
            </div>

            <Grid container spacing={4}>
              <Grid item lg={10} md={6} xs={12} className="fgm-inner-grid">
                <div className="five-g-core-sub-sections">
                  <div className="five-g-core-sub-section-title">
                    Number of 5G Networks{" "}
                  </div>

                  <div className="input-range-slider-block">
                    <InputRange
                      maxValue={50}
                      minValue={0}
                      value={numberOf5gNetworks}
                      onChange={(value) =>
                        this.setState({ numberOf5gNetworks: value })
                      }
                    />

                    <input
                      value={numberOf5gNetworks}
                      name="numberOf5gNetworks"
                      className="input-range-custom-value-block"
                      onChange={this.handleOnChange}
                    />
                  </div>

                  <br />

                  <div className="five-g-core-sub-section-title">
                    Choose 5G Core{" "}
                  </div>

                  <Grid container spacing={0}>
                    <Grid
                      item
                      lg={10}
                      md={6}
                      xs={12}
                      className="fgm-inner-grid"
                    >
                      <div className="core-list">
                        <Grid container spacing={0}>
                          <Grid
                            item
                            md={12}
                            xs={12}
                            className="fgm-inner-grid five-core-data-block"
                          >
                            {fiveGCoreData &&
                              fiveGCoreData.length > 0 &&
                              fiveGCoreData.map((eachCodeItem, index) => {
                                return (
                                  <Grid
                                    container
                                    spacing={0}
                                    key={index}
                                    className="custom-core-grid"
                                  >
                                    <Grid
                                      item
                                      xs={12}
                                      className="fgm-inner-grid five-core-data-block"
                                    >
                                      <div
                                        className={`core-manage-options ${
                                          selectedCore &&
                                          selectedCore.name ===
                                            eachCodeItem.name
                                            ? "selected"
                                            : ""
                                        }`}
                                        onClick={() => {
                                          this.updateSelectedCore(eachCodeItem);
                                        }}
                                      >
                                        <div className="cmo-image">
                                          <img
                                            className={
                                              eachCodeItem.name === "Open5GS"
                                                ? "disable"
                                                : ""
                                            }
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/assets/images/" +
                                              eachCodeItem.logo
                                            }
                                            alt={eachCodeItem.name}
                                          />
                                        </div>
                                        <div className="cmo-text">
                                          <span>{eachCodeItem.name}</span>
                                        </div>
                                      </div>
                                    </Grid>
                                  </Grid>
                                );
                              })}
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </div>
          <br />
        </Grid>
      </Grid>
    );
  };

  getAccessPointsList = () => {
    var thisView = this;
    if (this.getAccessPointToken) this.getAccessPointToken.cancel();
    this.getAccessPointToken = axios.CancelToken.source();

    this.setState({ callUnderProgress: true });
    axios
      .all([apiService.getAccessPointsList(this.getAccessPointToken.token)])
      .then(function (res) {
        if (res[0]) {
          if (res[0] && res[0]["data"]) {
            thisView.setState({ fiveGAccessPointData: res[0]["data"] });
          }
          thisView.setState({ callUnderProgress: false });
        }
      })
      .catch(function (res) {
        console.log(res);
        console.log("An error occurred add subscriber element service");
        thisView.setState({ callUnderProgress: false });
      });
  };

  updateSelectedAccessPoint = (selectedAccessPoint) => {
    this.setState({ selectedAccessPoint });
  };

  fiveGAccessPointOptional = () => {
    const {
      fiveGAccessPointData,
      numberOf5gAccessPoints,
      selectedAccessPoint,
    } = this.state;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="form-title-block">
              <img
                src={AP_5G_navy_icon}
                alt="AP_5G_navy_icon"
                className="navy_icon"
              />
              <span className="form-title">5G Access Point</span>
            </div>

            <br />

            <Grid container spacing={4}>
              <Grid
                item
                lg={6}
                md={12}
                xs={12}
                className="fgm-inner-grid"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className="form-main-block">
                  <div className="five-g-core-sub-title">
                    As the name suggests, 5G access points aka gNB s are the
                    radios that connect your end devices over the air.
                  </div>
                  <div className="five-g-core-sub-sections">
                    <div className="five-g-core-sub-section-title">
                      Number of Access Points Required
                    </div>

                    <div className="input-range-slider-block">
                      <InputRange
                        maxValue={50}
                        minValue={0}
                        value={numberOf5gAccessPoints}
                        onChange={(value) =>
                          this.setState({ numberOf5gAccessPoints: value })
                        }
                      />

                      <input
                        value={numberOf5gAccessPoints}
                        name="numberOf5gAccessPoints"
                        className="input-range-custom-value-block"
                        onChange={this.handleOnChange}
                      />
                    </div>

                    <br />

                    <div className="five-g-core-sub-section-title">
                      Choose 5G Access Point
                    </div>

                    <Grid container spacing={0}>
                      <Grid
                        item
                        lg={10}
                        md={6}
                        xs={12}
                        className="fgm-inner-grid"
                      >
                        <div className="core-list">
                          <Grid container spacing={0}>
                            <Grid
                              item
                              md={12}
                              xs={12}
                              className="fgm-inner-grid five-core-data-block"
                            >
                              {fiveGAccessPointData &&
                                fiveGAccessPointData.length > 0 &&
                                fiveGAccessPointData.map(
                                  (eachAccessPointItem, index) => {
                                    return (
                                      <Grid
                                        container
                                        spacing={0}
                                        key={index}
                                        className="custom-core-grid"
                                      >
                                        <Grid
                                          item
                                          xs={12}
                                          className="fgm-inner-grid five-core-data-block"
                                        >
                                          <div
                                            className={`core-manage-options ${
                                              selectedAccessPoint &&
                                              selectedAccessPoint.name ===
                                                eachAccessPointItem.name
                                                ? "selected"
                                                : ""
                                            }`}
                                            onClick={() => {
                                              this.updateSelectedAccessPoint(
                                                eachAccessPointItem
                                              );
                                            }}
                                          >
                                            <div className="cmo-image">
                                              <img
                                                src={
                                                  process.env.PUBLIC_URL +
                                                  "/assets/images/" +
                                                  eachAccessPointItem.logo
                                                }
                                                alt={eachAccessPointItem.name}
                                              />
                                            </div>
                                            <div className="cmo-text">
                                              <span>
                                                {eachAccessPointItem.name}
                                              </span>
                                            </div>
                                          </div>
                                        </Grid>
                                      </Grid>
                                    );
                                  }
                                )}
                            </Grid>
                          </Grid>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Grid>

              <Grid
                item
                lg={6}
                md={12}
                xs={12}
                className="fgm-inner-grid"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className="floor_plan_block">
                  <img
                    src={floor_plan_icon}
                    alt="floor_plan_icon"
                    className="floor_plan_icon"
                  />
                </div>
              </Grid>
            </Grid>

            <br />
          </div>
        </div>
      </div>
    );
  };

  handleDeviceOnChange = (deviceIndex, value) => {
    let parsedValue = value !== "" ? parseInt(value) : 0;
    let devices_info = this.state.devices_info.map((eachDevice, index) => {
      if (deviceIndex === index)
        return { ...eachDevice, numberOfDevices: parsedValue };
      else return eachDevice;
    });
    this.setState({ devices_info });
  };

  handleSelectMakeChange = (deviceIndex, value) => {
    let devices_info = this.state.devices_info.map((eachDevice, index) => {
      if (deviceIndex === index) return { ...eachDevice, selectedMake: value };
      else return eachDevice;
    });
    console.log(deviceIndex, value, devices_info);

    this.setState({ devices_info });
  };

  fiveGDevices = () => {
    const { devices_info, makeOptions } = this.state;

    return (
      <div className="container-fluid FiveGDevices">
        <div className="row">
          <div className="col-12">
            <div className="form-title-block">
              <img
                src={device_5G_navy_icon}
                alt="device_5G_navy_icon"
                className="navy_icon"
              />
              <span className="form-title">5G Devices</span>
            </div>

            <br />

            <div className="form-main-block">
              <div className="five-g-core-sub-title">
                Depending on the application, end devices can be sensors,
                actuators, robots, computers, and smartphones with 5G modems. 
              </div>
              <br />

              <div className="devices-custom-table">
                {devices_info && devices_info.length > 0 && (
                  <ul className="devices-list-ul">
                    {devices_info.map((device_list, deviceIndex) => {
                      return (
                        <li className="devices-list-li" key={deviceIndex}>
                          <div className="devices-list-first-column">
                            {device_list.name}
                          </div>

                          <div className="devices-list-second-column">
                            <Box sx={{ minWidth: 120, maxWidth: 240 }}>
                              <FormControl fullWidth>
                                <Select
                                  defaultValue={device_list.selectedMake}
                                  value={device_list.selectedMake}
                                  options={makeOptions}
                                  onChange={(value) => {
                                    this.handleSelectMakeChange(
                                      deviceIndex,
                                      value
                                    );
                                  }}
                                  // onInputChange={(value) => { this.handleSelectMakeChange(deviceIndex, value) } }
                                />
                              </FormControl>
                            </Box>
                          </div>

                          <div className="devices-list-third-column">
                            <div className="input-range-slider-block">
                              <InputRange
                                maxValue={50}
                                minValue={0}
                                value={device_list.numberOfDevices}
                                onChange={(value) => {
                                  this.handleDeviceOnChange(deviceIndex, value);
                                }}
                              />

                              <input
                                value={device_list.numberOfDevices}
                                className="input-range-custom-value-block"
                                onChange={(event) => {
                                  this.handleDeviceOnChange(
                                    deviceIndex,
                                    event.target.value
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  getStepContent = (step) => {
    console.log("step", step);
    switch (step) {
      case 0:
        return this.buildYour5GNetworkForm();
      case 1:
        return this.validateStep();
      case 2:
        return this.fiveGCoreOptional();
      case 3:
        return this.fiveGAccessPointOptional();
      case 4:
        return this.fiveGDevices();
      default:
        return "unknown step";
    }
  };

  validateEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  };

  signUp = async (upateStep) => {
    const {
      activeStep,
      name,
      company,
      email,
      password,
      devices_info,
      displaySignUp,
    } = this.state;

    if (name.trim() === "") {
      notify.show(
        "Please Enter Name",
        "custom",
        this.props.toaster.duration,
        this.props.toaster.error
      );
    } else if (company.trim() === "") {
      notify.show(
        "Please Enter Company Name",
        "custom",
        this.props.toaster.duration,
        this.props.toaster.error
      );
    } else {
      if (displaySignUp) {
        if (email.trim() === "") {
          notify.show(
            "Please Enter Email",
            "custom",
            this.props.toaster.duration,
            this.props.toaster.error
          );
        } else if (password.trim() === "") {
          notify.show(
            "Please Enter Password",
            "custom",
            this.props.toaster.duration,
            this.props.toaster.error
          );
        }
        // else if (!this.validateEmail(email)) {
        //   notify.show("Please Enter valid Email", "custom", this.props.toaster.duration, this.props.toaster.error);
        // }

        try {
          this.setState({ signUpProgress: true });
          this.props.onSignupStart(
            {
              password,
              email,
              full_name: name,
              company_name: company,
              phone_number: "999999999",
            },
            () => {
              this.props.history.push({ pathname: "/monitor" });
            }
          );
          // const response = await Auth.signUp({
          //   username: email,
          //   password,

          //   attributes: {
          //     name,
          //     email,
          //     "custom:company": company,
          //   },
          //   autoSignIn: true,
          // });
          // localStorage.setItem("registerEmail", email);
          // console.log(response);
          // this.setState({ activeStep: activeStep + 1 });
          // this.setState({ signUpProgress: false });
        } catch (error) {
          console.log(error);
          this.setState({ signUpProgress: false });

          // notify.show(
          //   error.message,
          //   "custom",
          //   this.props.siteCoordinator.toaster.duration,
          //   this.props.siteCoordinator.toaster.error
          // );
        }
      } else {
        this.setState({ displaySignUp: true });
      }
    }
  };

  validationCode = async () => {
    const { verificationCode, activeStep, password } = this.state;

    if (!verificationCode && verificationCode.trim() === "") {
      notify.show(
        "Please Enter Verification code.",
        "custom",
        this.props.toaster.duration,
        this.props.toaster.error
      );
    } else {
      try {
        let email = localStorage.getItem("registerEmail");
        const response = await Auth.confirmSignUp(email, verificationCode);
        console.log(response);
        this.setState({ activeStep: activeStep + 1 });

        localStorage.removeItem("registerEmail");
        await Auth.signIn(email, password);
        await Auth.currentSession();
        const { username, attributes } = await Auth.currentAuthenticatedUser();
        const uid = attributes.sub;
        const userData = {
          username,
          uid,
          name: attributes.name,
          email: attributes.email,
          mode: attributes["custom:mode"],
          role: attributes["custom:role"],
        };
        this.props.onLoadUserSuccess(userData);
      } catch (error) {
        console.log(error);
        notify.show(
          error.message,
          "custom",
          this.props.toaster.duration,
          this.props.toaster.error
        );
      }
    }
  };

  handleNext = (e) => {
    e.preventDefault();

    const {
      activeStep,
      name,
      company,
      selectedCore,
      selectedAccessPoint,
      verificationCode,
      displaySignUp,
    } = this.state;
    console.log("activeStep", activeStep);
    let upateStep = false;
    if (activeStep === 0) {
      this.signUp(upateStep);
    } else if (activeStep === 1) {
      this.validationCode();
    } else if (activeStep === 2) {
      this.setState({ displaySignUp: false });
      if (!selectedCore || !selectedCore.name) {
        notify.show(
          "Please Choose Core",
          "custom",
          this.props.toaster.duration,
          this.props.toaster.error
        );
      } else {
        upateStep = true;
      }
    } else if (activeStep === 3) {
      if (!selectedAccessPoint || !selectedAccessPoint.name) {
        notify.show(
          "Please Choose Access Point",
          "custom",
          this.props.toaster.duration,
          this.props.toaster.error
        );
      } else {
        upateStep = true;
      }
    } else if (activeStep === 4) {
      this.deployNetwrok();
    }

    if (upateStep) {
      this.setState({ activeStep: activeStep + 1 });
    }
  };

  deployNetwrok = async () => {
    const {
      name,
      company,
      selectedCore,
      numberOf5gNetworks,
      selectedAccessPoint,
      numberOf5gAccessPoints,
      devices_info,
    } = this.state;

    let data = {
      name: name,
      company: company,
      cn_make: selectedCore.name,
      cn_quantity: numberOf5gNetworks,
      ran_make: selectedAccessPoint.name,
      ran_quantity: numberOf5gAccessPoints,
      devices_info: JSON.stringify(devices_info),
    };

    var thisView = this;
    if (this.deployNetworkToken) this.deployNetworkToken.cancel();
    this.deployNetworkToken = axios.CancelToken.source();

    this.setState({ deployNetworkUnderProgress: true });
    try {
      const res = await axios.all([
        apiService.deployNetwork(this.deployNetworkToken.token, data),
      ]);
      console.log("res", res);
      this.setState({ deployNetworkUnderProgress: false });
      if (res[0] && res[0]["data"]) {
        this.setState({ fiveGAccessPointData: res[0]["data"] });
      }
      // window.location.href = "/simulator/#/monitor"
      console.log(this.props);
      notify.show(
        "Network Deployed Successfully",
        "custom",
        this.props.siteCoordinator.toaster.duration,
        this.props.siteCoordinator.toaster.error
      );

      this.props.history.push({ pathname: "/monitor" });
    } catch (error) {
      console.log("An error occurred add subscriber element service", error);
      this.setState({ deployNetworkUnderProgress: false });
    }

    // axios.all([apiService.deployNetwork(this.deployNetworkToken.token, data)])
    //   .then(function (res) {
    //     console.log("deploy success", res)
    //     if (res[0]) {

    //       if (res[0] && res[0]["data"]) {
    //         thisView.setState({ fiveGAccessPointData: res[0]["data"] });
    //       }

    //       // thisView.props.history.push({ pathname: "/monitor" });

    //     }
    //   }).catch(function (res) {
    //     console.log(res);
    //     console.log('An error occurred add subscriber element service');
    //     thisView.setState({ deployNetworkUnderProgress: false });
    //   });
  };

  render() {
    const {
      activeStep,
      steps,
      selectedCore,
      selectedAccessPoint,
      deployNetworkUnderProgress,
      signUpProgress,
    } = this.state;

    const { auth } = this.props;

    return (
      <div className="stepper-container">
        {
          <>
            {activeStep === steps.length ? (
              <Typography variant="h3" align="center">
                Thank You
              </Typography>
            ) : (
              <>
                <FormProvider>
                  <form>
                    <Grid
                      item
                      lg={12}
                      md={12}
                      xs={12}
                      className="fgm-inner-grid"
                    >
                      <div className="header-navigation-section">
                        {activeStep > -1 && (
                          <div
                            className="each-navigation-block"
                            onClick={() => {
                              this.setState({ activeStep: 0 });
                            }}
                          >
                            <div className="each-navigator-title">Dolcera</div>
                          </div>
                        )}
                        {activeStep > 0 && (
                          <div
                            className="each-navigation-block"
                            onClick={() => {
                              this.setState({ activeStep: 1 });
                            }}
                          >
                            <div className="each-navigator-title">
                              {selectedCore ? selectedCore.name + "-" : ""}5G
                              Core
                            </div>
                          </div>
                        )}

                        {activeStep > 1 && (
                          <div
                            className="each-navigation-block"
                            onClick={() => {
                              this.setState({ activeStep: 2 });
                            }}
                          >
                            <div className="each-navigator-title">
                              {selectedAccessPoint
                                ? selectedAccessPoint.name + "-"
                                : ""}
                              5G AP
                            </div>
                          </div>
                        )}

                        {activeStep > 2 && (
                          <div
                            className="each-navigation-block"
                            onClick={() => {
                              this.setState({ activeStep: 3 });
                            }}
                          >
                            <div className="each-navigator-title">
                              5G Devices
                            </div>
                          </div>
                        )}
                      </div>
                    </Grid>
                    {this.getStepContent(activeStep)}
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-12">
                          <div className="form-button-block">
                            {deployNetworkUnderProgress ? (
                              <CircularProgress size={26} />
                            ) : (
                              <Button
                                // className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={this.handleNext}
                                type="submit"
                                disabled={signUpProgress}
                              >
                                {activeStep === steps.length - 1
                                  ? "Deploy"
                                  : activeStep === 0 && this.state.displaySignUp
                                  ? "Sign Up"
                                  : "Continue"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </>
            )}
          </>
        }

        <div className="stepper-section"></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  siteCoordinator: state.siteCoordinator,
  toaster: state.siteCoordinator.toaster,
});

const mapDispatchToProps = (dispatch) => ({
  onSignupStart: (formdata, callback) =>
    dispatch(signupStart(formdata, callback)),
  onLoadUserSuccess: (formdata, callback) =>
    dispatch(loadUserSuccess(formdata, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LinaerStepper));
