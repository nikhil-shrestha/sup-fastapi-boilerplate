import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./manageNetwork.scss";
import "rsuite/dist/styles/rsuite-default.css";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import ReactApexChart from "react-apexcharts";

import { baseURL } from "../../config/axios.config";

import axiosConfig from "../../config/axios.config";

import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  Container,
  Toolbar,
} from "@material-ui/core";
import * as Icons from "@material-ui/icons";
import { Timeline } from "rsuite";

import Widget from "../../components/Widget";

// import ArrowBlue from '../../images/home/arrow_blue.svg';
import ArrowBlue from "../../images/new_flow_images/arrow.svg";
import ArrowLightPink from "../../images/new_flow_images/arrow_light_pink.svg";

import loadingIcon from "../../images/home/loading.gif";
import radialBlueIcon from "../../images/new_flow_images/radial_blue.svg";

import apiService from "../../services/apiService";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";

ChartJS.register(ArcElement, Tooltip, Legend);

class MonitorNetwork extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addSubsciberFormStatus: false,
      subscribersListStatus: false,
      ns_id: "",
      ns_supi: "",
      ns_auth_method: "",
      ns_k: "",
      ns_operation_code_type: "",
      ns_operator_code_value: "",
      addSubscriberError: "",
      subscribersList: [],
      callUnderProgress: false,
      deleteingUeid: "",
      modifyUeid: "",
      operationType: "add",
      editSubscriberData: null,
      suggestedActionButton: null,
      chartData: {
        chartHistory: [
          { chartLabel: "Uplink", value: "90.25 GB", color: "#4FAD58" },
          { chartLabel: "Downlink", value: "270.75 GB", color: "#A868A6" },
        ],
        // labels: ['Downlink', 'Uplink'],
        datasets: [
          {
            label: "# of Votes",
            data: [90.25, 270.75],
            backgroundColor: ["#4FAD58", "#A868A6"],
            borderColor: ["#4FAD58", "#A868A6"],
            borderWidth: 1,
          },
        ],
      },
      applicationSeries: [65, 30],
      applicationOptions: {
        chart: {
          height: 390,
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: "60%",
              background: "transparent",
              image: undefined,
              borderRadius: "50%",
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: false,
              },
            },
          },
        },
        colors: ["#1D8EAA", "#BA8E2A"],
        labels: ["Latency 11 ms", "Packet Loss 15%"],
        legend: {
          show: true,
          floating: true,
          fontSize: "14px",
          position: "left",
          offsetX: 50,
          offsetY: -10,
          labels: {
            useSeriesColors: true,
          },
          markers: {
            size: 0,
          },
          formatter: function (seriesName, opts) {
            return seriesName;
          },
          itemMargin: {
            vertical: 3,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                show: false,
              },
            },
          },
        ],
      },
      accountFacilities: null,
    };

    this.getSubscribersToken = null;
    this.addSubsciberToken = null;
    this.deleteSubsciberToken = null;
    this.modifySubscriberToken = null;
    this.suggestedActionTOken = null;
    this.suggestedActionSubmitTOken = null;

    this.timeout = null;

    this.defaultValues = {
      ns_id: "ue1",
      ns_supi: "imsi-208930000000003",
      ns_auth_method: "5G-AKA",
      ns_k: "8baf473f2f8fd09487cccbd7097c6862",
      ns_operation_code_type: "opc",
      ns_operator_code_value: "8e27b6af0e692e750f32667a3b14605d",
    };
  }

  componentWillMount() {
    this.setDefaultValues();
    this.suggestedActionUeCheck();
    this.getAccountFacilities();
    this.timeout = setInterval(this.intiateCall, 5000);
  }

  intiateCall = () => {
    if (!this.state.callUnderProgress) {
      this.suggestedActionUeCheck();
    }
  };

  componentWillUnmount() {
    if (this.suggestedActionTOken) this.suggestedActionTOken.cancel();
    clearInterval(this.timeout);
  }

  setDefaultValues = () => {
    var thisView = this;
    Object.keys(this.defaultValues).map((eachKey, index) => {
      this.setState({ [eachKey]: thisView.defaultValues[eachKey] });
    });
    if (this.state.operationType === "edit") {
      this.setState({ ns_supi: this.state.editSubscriberData.ueId });
    }
  };

  toggleSubscriber = (operationType) => {
    this.setState({
      addSubsciberFormStatus: !this.state.addSubsciberFormStatus,
      operationType: operationType ? operationType : "edit",
    });
    this.setDefaultValues();
    this.setState({ addSubscriberError: "" });
  };

  toggleSubscribersList = () => {
    if (!this.state.subscribersListStatus) {
      this.getSubscribersList();
    }
    this.setState({ subscribersListStatus: !this.state.subscribersListStatus });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeOperationCode = (event) => {
    this.setState({ ns_operation_code_type: event.target.value });
  };

  addNewSubscriber = () => {
    const {
      ns_id,
      ns_supi,
      ns_auth_method,
      ns_k,
      ns_operation_code_type,
      ns_operator_code_value,
    } = this.state;

    let data = {
      id: ns_id,
      supi: ns_supi,
      auth_method: ns_auth_method,
      k: ns_k,
      operation_code_type: ns_operation_code_type,
      operator_code_value: ns_operator_code_value,
    };

    if (
      data.id === "" ||
      data.supi === "" ||
      data.auth_method === "" ||
      data.auth_method === "" ||
      data.k === "" ||
      data.operation_code_type === "" ||
      data.operator_code_value === ""
    ) {
      this.setState({ addSubscriberError: "Please fill all details" });
    } else {
      this.setState({ addSubscriberError: "" });

      if (this.state.operationType === "add") {
        this.addSubscriber(data);
      } else {
        console.log(data);
        this.modifySubscriber(data);
      }
    }
  };

  addSubscriber = (data) => {
    var thisView = this;
    if (this.addSubsciberToken) this.addSubsciberToken.cancel();
    this.addSubsciberToken = axios.CancelToken.source();

    this.setState({ callUnderProgress: true });
    axios
      .all([apiService.addSubscriber(this.addSubsciberToken.token, data)])
      .then(function (res) {
        if (res[0]) {
          thisView.setState({ addSubscriberError: "" });
          thisView.setDefaultValues();
          thisView.toggleSubscriber();
          thisView.setState({ callUnderProgress: false });
        }
      })
      .catch(function (res) {
        console.log(res);
        console.log("An error occurred add subscriber element service");
        thisView.setState({ callUnderProgress: false });
      });
  };

  deleteSubscriber = (subscriberData) => {
    var thisView = this;
    if (this.deleteSubsciberToken) this.deleteSubsciberToken.cancel();
    this.deleteSubsciberToken = axios.CancelToken.source();

    this.setState({ deleteingUeid: subscriberData.ueId });
    axios
      .all([
        apiService.deleteSubscriber(
          this.deleteSubsciberToken.token,
          subscriberData.ueId
        ),
      ])
      .then(function (res) {
        if (res[0]) {
          thisView.setState({ deleteingUeid: "" });
          thisView.getSubscribersList();
        }
      })
      .catch(function (res) {
        console.log(res);
        console.log("An error occurred add subscriber element service");
      });
  };

  enableModifySubscriber = (subscriberData) => {
    this.setState(
      { operationType: "edit", editSubscriberData: subscriberData },
      () => {
        this.toggleSubscriber();
      }
    );
    this.toggleSubscribersList();
  };

  modifySubscriber = (subscriberData) => {
    var thisView = this;
    if (this.modifySubscriberToken) this.modifySubscriberToken.cancel();
    this.modifySubscriberToken = axios.CancelToken.source();

    console.log(subscriberData);
    let data = {
      ueId: this.state.editSubscriberData.ueId,
      newUeId: subscriberData.supi,
    };

    this.setState({ callUnderProgress: true });
    axios
      .all([
        apiService.modifySubscriber(this.modifySubscriberToken.token, data),
      ])
      .then(function (res) {
        if (res[0]) {
          thisView.setState({ callUnderProgress: false });
          thisView.toggleSubscriber();
          thisView.toggleSubscribersList();
        }
      })
      .catch(function (res) {
        console.log(res);
        console.log("An error occurred add subscriber element service");
        thisView.setState({ callUnderProgress: false });
      });
  };

  getSubscribersList = () => {
    var thisView = this;
    if (this.getSubscribersToken) this.getSubscribersToken.cancel();
    this.getSubscribersToken = axios.CancelToken.source();

    this.setState({ callUnderProgress: true });
    axios
      .all([apiService.getSubscribers(this.getSubscribersToken.token)])
      .then(function (res) {
        if (res[0]) {
          if (res[0]["status"] && res[0]["data"]) {
            thisView.setState({ subscribersList: res[0]["data"] });
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

  suggestedActionUeCheck = () => {
    var thisView = this;
    if (this.suggestedActionTOken) this.suggestedActionTOken.cancel();
    this.suggestedActionTOken = axios.CancelToken.source();

    this.setState({ callUnderProgress: true });
    axios
      .all([apiService.suggestedActionUE(this.suggestedActionTOken.token)])
      .then(function (res) {
        if (res[0]) {
          if (res[0]["data"]) {
            thisView.setState({ suggestedActionButton: res[0]["data"] });
          } else {
            thisView.setState({ suggestedActionButton: null });
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

  suggestedActionUeSubmit = () => {
    var thisView = this;
    if (this.suggestedActionSubmitTOken)
      this.suggestedActionSubmitTOken.cancel();
    this.suggestedActionSubmitTOken = axios.CancelToken.source();

    this.setState({ callUnderProgress: true });
    axios
      .all([
        apiService.suggestedActionUESubmit(
          this.suggestedActionSubmitTOken.token
        ),
      ])
      .then(function (res) {
        if (res[0]) {
          thisView.setState({ callUnderProgress: false });
        }
      })
      .catch(function (res) {
        console.log(res);
        console.log("An error occurred add subscriber element service");
        thisView.setState({ callUnderProgress: false });
      });
  };

  getAccountFacilities = async () => {
    try {
      const { data } = await axiosConfig.get(
        `${baseURL}/account-facilities/me`
      );

      if (data) {
        this.setState({
          accountFacilities: data,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const {
      addSubsciberFormStatus,
      subscribersListStatus,
      ns_id,
      ns_supi,
      ns_auth_method,
      ns_k,
      ns_operation_code_type,
      ns_operator_code_value,
      addSubscriberError,
      subscribersList,
      callUnderProgress,
      deleteingUeid,
      operationType,
      editSubscriberData,
      suggestedActionButton,
      chartData,
      accountFacilities,
    } = this.state;

    const { match, location, history } = this.props;
    const { deploy } = this.props;

    const now = moment();
    const now1 = moment().subtract(1, "days");
    const now2 = moment().subtract(2, "days");
    const now3 = moment().subtract(3, "days");
    const now4 = moment().subtract(4, "days");
    const now5 = moment().subtract(5, "days");

    return (
      <Container maxWidth="xl">
        <Toolbar>
          <div className="five-g-manage-container">
            <Grid container spacing={4}>
              <Grid item lg={8} md={8} xs={12} className="fgm-inner-grid">
                <Grid container spacing={4}>
                  <Grid item md={6} xs={12} className="fgm-inner-grid">
                    <Widget
                      title=""
                      upperTitle
                      bodyclassName={""}
                      className="test"
                      disableWidgetMenu={true}
                      fontBold={true}
                    >
                      <div className="manage-network-title">Manage Core</div>
                      <div className="core-data">
                        <Grid
                          container
                          className="cd-main"
                          justifyContent="flex-start"
                          spacing={1}
                        >
                          <Grid item xs={12} sm={4} className="cd-each">
                            <div className="c100 p33 center cd-main-bar-block">
                              <span>33%</span>
                              <div className="slice">
                                <div className="bar"></div>
                                <div className="fill"></div>
                              </div>
                            </div>
                            <span>Manage Usage</span>
                          </Grid>
                          <Grid item xs={12} sm={4} className="cd-each">
                            <div className="c100 p33 center cd-main-bar-block">
                              <span>33%</span>
                              <div className="slice">
                                <div className="bar"></div>
                                <div className="fill"></div>
                              </div>
                            </div>
                            <span>CPU Usage</span>
                          </Grid>
                          <Grid item xs={12} sm={4} className="cd-each">
                            <div className="c100 p33 center cd-main-bar-block">
                              <span>33%</span>
                              <div className="slice">
                                <div className="bar"></div>
                                <div className="fill"></div>
                              </div>
                            </div>
                            <span>Edge Computer Usage</span>
                          </Grid>
                        </Grid>
                        <div className="manage-options">
                          <img src={ArrowBlue} alt="arrow" />
                          {/* onClick={() => { this.toggleSubscriber("add") }} */}
                          <span>Add Extra Network Slice</span>
                        </div>
                        <div className="manage-options">
                          <img src={ArrowBlue} alt="arrow" />
                          <NavLink
                            to="/device"
                            style={{ textDecoration: "none", color: "#366672" }}
                          >
                            <span>Onboard Devices</span>
                          </NavLink>
                        </div>
                        <div className="manage-options">
                          {/* onClick={this.toggleSubscribersList} */}
                          <img src={ArrowBlue} alt="arrow" />
                          <span>Modify/Delete Devices</span>
                        </div>
                        <div className="manage-options">
                          {/* onClick={this.toggleSubscribersList} */}
                          <img src={ArrowBlue} alt="arrow" />
                          <span>Add New Device</span>
                        </div>
                      </div>
                    </Widget>
                  </Grid>
                  <Grid item md={6} xs={12} className="fgd-form">
                    <Widget
                      title=""
                      upperTitle
                      bodyclassName={""}
                      className={""}
                      disableWidgetMenu={true}
                      fontBold={true}
                    >
                      <div className="manage-network-title">
                        Manage Access Points
                      </div>

                      <div className="ran-stats">
                        <div className="rans-each">
                          <span>5</span>
                          <span>RRHs</span>
                        </div>
                        <div className="rans-each">
                          <span>5</span>
                          <span>gNBs</span>
                        </div>
                        <div className="rans-each">
                          <span>
                            {accountFacilities
                              ? accountFacilities?.no_of_devices
                              : "-"}
                          </span>
                          <span>Subscribers</span>
                        </div>
                      </div>
                      <NavLink
                        to={this.props.match.path + "/"}
                        className="manage-access-points-options"
                      >
                        <img src={ArrowLightPink} alt="arrow" />
                        <span>Onboard APs</span>
                      </NavLink>
                      <NavLink
                        to={this.props.match.path + "/"}
                        className="manage-access-points-options"
                      >
                        <img src={ArrowLightPink} alt="arrow" />
                        <span>Monitor/configure APs</span>
                      </NavLink>
                      <NavLink
                        to={this.props.match.path + "/"}
                        className="manage-access-points-options"
                      >
                        <img src={ArrowLightPink} alt="arrow" />
                        <span>Coverage/QoS map</span>
                      </NavLink>
                      <NavLink
                        to={this.props.match.path + "/"}
                        className="manage-access-points-options"
                      >
                        <img src={ArrowLightPink} alt="arrow" />
                        <span>Channel usage map</span>
                      </NavLink>
                    </Widget>
                  </Grid>
                  <Grid item md={6} xs={12} className="fgd-form">
                    <Widget
                      // title="Manage RAN"
                      upperTitle
                      bodyclassName={""}
                      className={""}
                      disableWidgetMenu={true}
                      fontBold={true}
                    >
                      <div className="manage-network-title">
                        Manage Applications
                      </div>

                      {/* <div id="chart">
                        <div style={{ display: "flex" }}>
                          <ReactApexChart
                            options={this.state.applicationOptions}
                            series={this.state.applicationSeries}
                            type="radialBar"
                            height={190}
                            style={{ flex: 1 }}
                          />

                          <ReactApexChart
                            options={this.state.applicationOptions}
                            series={this.state.applicationSeries}
                            type="radialBar"
                            height={190}
                            style={{ flex: 1 }}
                          />
                        </div>
                      </div> */}

                      {deploy.deployEndPoints &&
                        deploy.deployEndPoints.length > 0 &&
                        deploy.deployEndPoints[0] &&
                        deploy.deployEndPoints[0]["name"] && (
                          <div className="choose-an-option-below-title-box">
                            {deploy.deployEndPoints[0]["name"]} Application has
                            been deployed succesfully.{" "}
                          </div>
                        )}
                      <br />

                      <div className="manage-options-sub-block">
                        <div className="map-sub-block-title">
                          Suggested Actions
                        </div>
                        <NavLink
                          to={this.props.match.path + "/deployment"}
                          className="manage-options app-depolyment-active"
                        >
                          <img src={ArrowBlue} alt="arrow" />
                          <span>Deploy an Application</span>
                        </NavLink>
                        <NavLink
                          to={this.props.match.path + "/"}
                          className="manage-options app-depolyment-restore"
                        >
                          <img src={ArrowBlue} alt="arrow" />
                          <span> Restart Robot Navigation Application</span>
                        </NavLink>
                        {deploy.deployEndPoints &&
                          deploy.deployEndPoints.length > 0 &&
                          deploy.deployEndPoints[0] &&
                          deploy.deployEndPoints[0]["name"] && (
                            <NavLink
                              to={this.props.match.path + "/deployment"}
                              className="manage-options app-depolyment-restore"
                            >
                              <img src={ArrowBlue} alt="arrow" />
                              <span>{deploy.deployEndPoints[0]["name"]}</span>
                            </NavLink>
                          )}
                      </div>
                    </Widget>
                  </Grid>
                  <Grid item md={6} xs={12} className="fgd-form">
                    <Widget
                      // title="Suggested Actions"
                      upperTitle
                      bodyclassName={""}
                      className={""}
                      disableWidgetMenu={true}
                      fontBold={true}
                    >
                      <div className="manage-network-title">Traffic</div>

                      <Grid container spacing={4}>
                        <Grid
                          item
                          lg={7}
                          md={7}
                          xs={12}
                          className="fgm-inner-grid"
                        >
                          <div className="traffic-chart-history">
                            {chartData &&
                              chartData["chartHistory"].map(
                                (eachChartHistory, index) => {
                                  return (
                                    <div
                                      className="traffic-chart-history-box"
                                      key={index}
                                    >
                                      <div
                                        className="traffic-chart-history-value"
                                        style={{
                                          color: eachChartHistory.color,
                                        }}
                                      >
                                        {eachChartHistory.value}
                                      </div>
                                      <div
                                        className="traffic-chart-history-label"
                                        style={{
                                          color: eachChartHistory.color,
                                        }}
                                      >
                                        {eachChartHistory.chartLabel}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                          </div>
                        </Grid>
                        <Grid
                          item
                          lg={5}
                          md={5}
                          xs={12}
                          className="fgm-inner-grid traffic-chart-section"
                        >
                          <div className="traffic-chart-block">
                            <Doughnut data={chartData} />
                          </div>
                        </Grid>
                      </Grid>

                      <br />
                      <br />

                      <div className="manage-options-sub-block">
                        <div className="map-sub-block-title">
                          Suggested Actions
                        </div>
                        <div className="manage-access-points-options">
                          <img src={ArrowLightPink} alt="arrow" />
                          <span>Add a new Access point at warehouse C</span>
                        </div>
                        <div className="manage-access-points-options">
                          <img src={ArrowLightPink} alt="arrow" />
                          <span>
                            Malfunction in AP17, please update to latest
                            firmware
                          </span>
                        </div>
                      </div>
                    </Widget>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={4} md={4} xs={12} className="fgm-inner-grid">
                <Grid item xs={12} className="fgd-form">
                  <div
                    className="manage-network-title"
                    style={{ marginTop: "30px" }}
                  >
                    Management Timeline
                  </div>
                  <Timeline align={"left"}>
                    <Timeline.Item>
                      <img
                        src={radialBlueIcon}
                        alt="radialBlueIcon"
                        className="radialBlueIcon"
                      />
                      <p>{now.format("DD MMM YYYY HH:mm [hrs]")}</p>
                      <p>Request additional AMF node for slice 2.</p>
                    </Timeline.Item>
                    <Timeline.Item>
                      <img
                        src={radialBlueIcon}
                        alt="radialBlueIcon"
                        className="radialBlueIcon"
                      />
                      <p>{now1.format("DD MMM YYYY HH:mm [hrs]")}</p>

                      <p>Added a RAN node gNB at CA location.</p>
                      <p>Nagamanoj K.</p>
                    </Timeline.Item>
                    <Timeline.Item>
                      <img
                        src={radialBlueIcon}
                        alt="radialBlueIcon"
                        className="radialBlueIcon"
                      />
                      <p>{now2.format("DD MMM YYYY HH:mm [hrs]")}</p>
                      <p>Major system upgrade installed.</p>
                    </Timeline.Item>
                    <Timeline.Item>
                      <img
                        src={radialBlueIcon}
                        alt="radialBlueIcon"
                        className="radialBlueIcon"
                      />
                      <p>{now3.format("DD MMM YYYY HH:mm [hrs]")}</p>

                      <p>New AMF added to slice 3.</p>
                      <p>Pradgnya K.</p>
                    </Timeline.Item>
                    <Timeline.Item>
                      <img
                        src={radialBlueIcon}
                        alt="radialBlueIcon"
                        className="radialBlueIcon"
                      />
                      <p>{now4.format("DD MMM YYYY HH:mm [hrs]")}</p>

                      <p>Additional capacity for SMF approved.</p>
                      <p>Sandeep M.</p>
                    </Timeline.Item>
                    <Timeline.Item>
                      <img
                        src={radialBlueIcon}
                        alt="radialBlueIcon"
                        className="radialBlueIcon"
                      />
                      <p>{now5.format("DD MMM YYYY HH:mm [hrs]")}</p>

                      <p>New software upgrades available.</p>
                    </Timeline.Item>
                  </Timeline>
                </Grid>
              </Grid>
            </Grid>

            <Dialog open={addSubsciberFormStatus} id="add-subscriber-form">
              <DialogTitle>
                {operationType === "add"
                  ? "New Subscriber"
                  : `Edit Subscriber - ${
                      editSubscriberData ? editSubscriberData.ueId : ""
                    }`}
                <Icons.Close
                  fontSize={"small"}
                  className="adf-close-icon"
                  onClick={this.toggleSubscriber}
                />
              </DialogTitle>
              <DialogContent>
                <Grid className="asf-container" container spacing={2}>
                  <Grid item md={6} xs={12} className="fgd-form">
                    <div className="asf-each">
                      <span>ID</span>
                      <input
                        type="text"
                        spellCheck="false"
                        name="ns_id"
                        value={ns_id}
                        onChange={this.handleChange}
                        onKeyDown={this.handleChange}
                      />
                    </div>
                  </Grid>
                  <Grid item md={6} xs={12} className="fgd-form">
                    <div className="asf-each">
                      <span>SUPI</span>
                      <input
                        type="text"
                        name="ns_supi"
                        spellCheck="false"
                        value={ns_supi}
                        onChange={this.handleChange}
                        onKeyDown={this.handleChange}
                      />
                    </div>
                  </Grid>
                  <Grid item md={6} xs={12} className="fgd-form">
                    <div className="asf-each">
                      <span>Authentication Method</span>
                      <input
                        type="text"
                        name="ns_auth_method"
                        spellCheck="false"
                        value={ns_auth_method}
                        onChange={this.handleChange}
                        onKeyDown={this.handleChange}
                      />
                    </div>
                  </Grid>
                  <Grid item md={6} xs={12} className="fgd-form">
                    <div className="asf-each">
                      <span>k</span>
                      <input
                        type="text"
                        name="ns_k"
                        spellCheck="false"
                        value={ns_k}
                        onChange={this.handleChange}
                        onKeyDown={this.handleChange}
                      />
                    </div>
                  </Grid>
                  <Grid item md={6} xs={12} className="fgd-form">
                    <div className="asf-each ns_operation_codes">
                      <span>Operator Code Type</span>
                      <FormControl className={""}>
                        <Select
                          value={ns_operation_code_type}
                          onChange={this.handleChangeOperationCode}
                          displayEmpty
                          className={""}
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="">
                            Select Operation Code Type
                          </MenuItem>
                          <MenuItem value={"op"}>OP</MenuItem>
                          <MenuItem value={"opc"}>OPC</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item md={6} xs={12} className="fgd-form">
                    <div className="asf-each">
                      <span>Operator Code Value</span>
                      <input
                        type="text"
                        name="ns_operator_code_value"
                        spellCheck="false"
                        value={ns_operator_code_value}
                        onChange={this.handleChange}
                        onKeyDown={this.handleChange}
                      />
                    </div>
                  </Grid>
                  {addSubscriberError && addSubscriberError !== "" && (
                    <Grid item xs={12} className="fgd-form">
                      <div className="asf-each ns-error">
                        <span>{addSubscriberError}</span>
                      </div>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions>
                {callUnderProgress ? (
                  <img src={loadingIcon} className="call_under_progress_icon" />
                ) : (
                  <Button onClick={this.addNewSubscriber} color="primary">
                    {operationType === "add" ? "Submit" : "Update"}
                  </Button>
                )}
              </DialogActions>
            </Dialog>

            <Dialog open={subscribersListStatus} id="subscriber-list">
              <DialogTitle>
                Subscribers
                {callUnderProgress && (
                  <img src={loadingIcon} className="call_under_progress_icon" />
                )}
                <Icons.Close
                  fontSize={"small"}
                  className="sl-close-icon"
                  onClick={this.toggleSubscribersList}
                />
              </DialogTitle>
              <DialogContent>
                <Grid className="sl-container" container spacing={2}>
                  <Grid item xs={12} className="fgd-form">
                    {subscribersList &&
                      subscribersList.length > 0 &&
                      subscribersList.map((eachSub, index) => {
                        return (
                          <div key={index} className="slc-each">
                            <span>{index + 1}</span>
                            <span>{eachSub.ueId}</span>
                            <div className="slce-action">
                              <span
                                className="slca-option"
                                onClick={() => {
                                  this.deleteSubscriber(eachSub);
                                }}
                              >
                                {deleteingUeid !== "" &&
                                deleteingUeid === eachSub.ueId ? (
                                  <img
                                    src={loadingIcon}
                                    className="call_under_progress_icon"
                                  />
                                ) : (
                                  "Delete"
                                )}
                              </span>
                            </div>
                            <div className="slce-action">
                              <span
                                className="slca-option"
                                onClick={() => {
                                  this.enableModifySubscriber(eachSub);
                                }}
                              >
                                Modify
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                {/* <Button onClick={this.toggleSubscribersList} color="primary">
                            Submit
                        </Button> */}
              </DialogActions>
            </Dialog>
          </div>
        </Toolbar>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.siteCoordinator.config,
  toaster: state.siteCoordinator.toaster,
  deploy: state.siteCoordinator.deploy,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MonitorNetwork));
