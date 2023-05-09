import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import "./monitorNetworkElement.scss";

import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  withStyles,
} from "@material-ui/core";

import * as Icons from "@material-ui/icons";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  Area,
} from "recharts";
import moment from "moment";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import loadingIcon from "../../images/home/loading.gif";

import Widget from "../../components/Widget";

import apiService from "../../services/apiService.js";

const MyRadio = withStyles({
  root: {
    color: "#1F3BB3",
    "&$checked": {
      color: "#1F3BB3",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

class MonitorNetworkElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lineData: [
        { name: "July 1", uv: 4000 },
        { name: "July 2", uv: 3000 },
        { name: "July 3", uv: 2000 },
        { name: "July 4", uv: 1000 },
        { name: "July 5", uv: 1890 },
      ],
      chart1: {},
      chart2: {},
      chart3: {},
      networkElementInfo: {},
      handoverStatus: false,
      pathSwitchStatus: false,
      handOverError: "",
      ueList: [],
      selectedHandoverElement: null,
      selectedPathSwitchElement: null,
      pathSwitchError: "",
      pathSwitch: [],
      callUnderProgress: false,
      firstCallDone: false,
    };

    this.ueListToken = null;
    this.prepareHandoverToken = null;
    this.pathSwitchToken = null;
    this.submitPathSwitchToken = null;
  }

  componentDidMount() {
    this.getElementDetails();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getElementDetails();
    }
  }

  getElementDetails = () => {
    var thisView = this;
    if (this.monitorHomeToken) this.monitorHomeToken.cancel();
    this.monitorHomeToken = axios.CancelToken.source();

    axios
      .all([
        apiService.getElementDetails(
          this.monitorHomeToken.token,
          this.props.match.params.id
        ),
      ])
      .then(function (res) {
        if (res[0]) {
          let networkInfo = res[0]["data"] ? res[0]["data"] : {};
          thisView.setState({ networkElementInfo: networkInfo });
          thisView.processChartData(networkInfo);
          thisView.setState({ firstCallDone: true });
        }
      })
      .catch(function (res) {
        console.log(res);
        console.log("An error occurred monitor element service");
      });
  };

  processChartData = (networkInfo) => {
    let chart1 = {},
      chart2 = {},
      chart3 = {};
    if (networkInfo && networkInfo.NF_stats) {
      if (networkInfo.NF_stats.chart1) chart1 = networkInfo.NF_stats.chart1;
      if (networkInfo.NF_stats.chart2) chart2 = networkInfo.NF_stats.chart2;
      if (networkInfo.NF_stats.chart3) chart3 = networkInfo.NF_stats.chart3;
    }

    if (chart1.data) {
      chart1.data = chart1.data.map((eachPoint) => {
        return {
          name: moment(Object.keys(eachPoint)[0]).format("h:mm:ss"),
          value: eachPoint[Object.keys(eachPoint)[0]],
        };
      });
      this.setState({ chart1 });
    }

    if (chart2.data) {
      chart2.data = chart2.data.map((eachPoint) => {
        return {
          name: moment(Object.keys(eachPoint)[0]).format("h:mm:ss"),
          value: eachPoint[Object.keys(eachPoint)[0]],
        };
      });
      this.setState({ chart2 });
    }

    if (chart3.data) {
      chart3.dataTx = [];
      chart3.dataRx = [];
      chart3.data.map((eachPoint) => {
        if (Array.isArray(eachPoint[Object.keys(eachPoint)[0]])) {
          chart3.dataTx.push({
            category: moment(Object.keys(eachPoint)[0]).format("h:mm:ss"),
            value: eachPoint[Object.keys(eachPoint)[0]][0],
          });

          chart3.dataRx.push({
            category: moment(Object.keys(eachPoint)[0]).format("h:mm:ss"),
            value: eachPoint[Object.keys(eachPoint)[0]][1],
          });
        } else {
          chart3.dataTx.push({
            name: moment(Object.keys(eachPoint)[0]).format("h:mm:ss"),
            value: eachPoint[Object.keys(eachPoint)[0]],
          });
          chart3.dataRx = null;
        }
      });
      this.setState({ chart3 });
      console.log(chart3);
    }
  };

  toggleHandOver = () => {
    if (!this.state.handoverStatus) {
      this.setState({
        ueList: [],
        handOverError: "",
        selectedHandoverElement: null,
      });
      this.getUEList();
    }

    this.setState({ handoverStatus: !this.state.handoverStatus });
  };

  togglePathSwitch = () => {
    if (!this.state.pathSwitchStatus) {
      this.setState({
        pathSwitch: [],
        pathSwitchError: "",
        selectedPathSwitchElement: null,
      });
      this.getPathSwitch();
    }

    this.setState({ pathSwitchStatus: !this.state.pathSwitchStatus });
  };

  handleHandoverChange = (value) => {
    this.setState({ selectedHandoverElement: value });
  };

  handlePathSwitchChange = (value) => {
    this.setState({ selectedPathSwitchElement: value });
  };

  getUEList = () => {
    var thisView = this;
    if (this.ueListToken) this.ueListToken.cancel();
    this.ueListToken = axios.CancelToken.source();

    this.setState({ callUnderProgress: true });
    axios
      .all([
        apiService.getUEList(
          this.ueListToken.token,
          this.props.match.params.id
        ),
      ])
      .then(function (res) {
        if (res[0]) {
          let ueList =
            res[0]["data"] && res[0]["data"]["UElist"]
              ? res[0]["data"]["UElist"]
              : [];
          if (ueList && ueList.length > 0 && !ueList[0]["- ue-id"]) {
            ueList = [];
          }

          thisView.setState({ ueList: ueList });
          thisView.setState({ callUnderProgress: false });
        }
      })
      .catch(function (res) {
        console.log(res);
        console.log("An error occurred monitor element service");
        thisView.setState({ callUnderProgress: false });
      });
  };

  submitHandOver = () => {
    if (!this.state.selectedHandoverElement) {
      this.setState({ handOverError: "Please Select UE" });
      return;
    } else {
      this.setState({ handOverError: "" });
    }

    var thisView = this;
    if (this.prepareHandoverToken) this.prepareHandoverToken.cancel();
    this.prepareHandoverToken = axios.CancelToken.source();

    let data = {
      containerId: this.props.match.params.id,
      ueId: this.state.selectedHandoverElement.trim(),
    };

    this.setState({ callUnderProgress: true });
    axios
      .all([apiService.prepareHandOver(this.prepareHandoverToken.token, data)])
      .then(function (res) {
        if (res[0]) {
          thisView.setState({ callUnderProgress: false });
          thisView.toggleHandOver();
        }
      })
      .catch(function (res) {
        console.log(res);
        console.log("An error occurred monitor element service");
        thisView.setState({ callUnderProgress: false });
      });
  };

  getPathSwitch = () => {
    var thisView = this;
    if (this.pathSwitchToken) this.pathSwitchToken.cancel();
    this.pathSwitchToken = axios.CancelToken.source();

    this.setState({ callUnderProgress: true });
    axios
      .all([apiService.getPathSwitchList(this.pathSwitchToken.token)])
      .then(function (res) {
        if (res[0]) {
          let pathSwitchData =
            res[0]["data"] && res[0]["data"] ? res[0]["data"] : [];

          pathSwitchData = pathSwitchData.map((eachSwitch) => {
            let temp = {};
            eachSwitch.map((eachField) => {
              if (Object.keys(eachField)[0] === "handover_key") {
                temp["key"] = eachField["handover_key"];
              } else if (Object.keys(eachField)[0] === "ueid") {
                temp["ueid"] = eachField["ueid"];
              } else if (Object.keys(eachField)[0] === "source_gnb") {
                temp["source"] = eachField["source_gnb"];
              }
            });
            return temp;
          });

          thisView.setState({ pathSwitch: pathSwitchData });
          thisView.setState({ callUnderProgress: false });
        }
      })
      .catch(function (res) {
        console.log(res);
        console.log("An error occurred monitor element service");
        thisView.setState({ callUnderProgress: false });
      });
  };

  submitPathSwitch = () => {
    if (!this.state.selectedPathSwitchElement) {
      this.setState({ pathSwitchError: "Please Select" });
      return;
    }

    var thisView = this;
    if (this.submitPathSwitchToken) this.submitPathSwitchToken.cancel();
    this.submitPathSwitchToken = axios.CancelToken.source();

    let data = {
      containerId: this.props.match.params.id,
      id: this.state.selectedPathSwitchElement,
    };

    this.setState({ callUnderProgress: true });
    axios
      .all([
        apiService.submitPathSwitch(this.submitPathSwitchToken.token, data),
      ])
      .then(function (res) {
        if (res[0]) {
          thisView.setState({ callUnderProgress: false });
          thisView.togglePathSwitch();
        }
      })
      .catch(function (res) {
        console.log(res);
        console.log("An error occurred monitor element service");
        thisView.setState({ callUnderProgress: false });
      });
  };

  render() {
    const {
      lineData,
      networkElementInfo,
      handoverStatus,
      selectedHandoverElement,
      pathSwitchStatus,
      selectedPathSwitchElement,
      callUnderProgress,
      ueList,
      handOverError,
      pathSwitch,
      pathSwitchError,
      chart1,
      chart2,
      chart3,
      firstCallDone,
    } = this.state;

    return (
      <div className="five-g-monitor">
        <Grid container spacing={4}>
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
            className="fgm-inner-grid individual-grid-five-g"
          >
            <Widget
              title={
                networkElementInfo.name_of_nf
                  ? networkElementInfo.name_of_nf.toUpperCase()
                  : "-"
              }
              upperTitle
              bodyclassName={""}
              className={"test"}
              disableWidgetMenu={true}
            >
              <div className="fgm-details-container">
                <div className="fgmdc-stats">
                  <div className="fgmds-each">
                    <span>State</span>
                    <span>
                      {networkElementInfo.State
                        ? networkElementInfo.State
                        : "-"}
                    </span>
                  </div>
                  <div className="fgmds-each">
                    <span>Health</span>
                    <span>
                      {networkElementInfo.Health
                        ? networkElementInfo.Health
                        : "-"}
                    </span>
                  </div>
                  <div className="fgmds-each">
                    <span>DNN</span>
                    <span>
                      {networkElementInfo.DNN ? networkElementInfo.DNN : "-"}
                    </span>
                  </div>
                </div>
                <div className="fgmdc-sensor-active">
                  <span>IP address:</span>
                  <span>
                    {networkElementInfo.hasOwnProperty("Management_IP")
                      ? networkElementInfo.Management_IP
                      : "-"}
                  </span>
                </div>

                <div className="fgmdc-served">
                  <span>Number of UEs served:</span>
                  <span>
                    {networkElementInfo.hasOwnProperty("no_UEsserved")
                      ? networkElementInfo.no_UEsserved
                      : "-"}
                  </span>
                </div>
                <div className="fgmdc-handover-container">
                  {networkElementInfo["Handover-prepare_button"] === "True" && (
                    <span onClick={this.toggleHandOver}>Handover Prepare</span>
                  )}
                  {networkElementInfo.Path_sw_req_button === "True" && (
                    <span onClick={this.togglePathSwitch}>
                      Path Switch Request
                    </span>
                  )}
                </div>
              </div>
              {!firstCallDone && (
                <div className="each-widget-loading">
                  <img src={loadingIcon} />
                </div>
              )}
            </Widget>
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
            className="fgd-form individual-grid-five-g"
          >
            <Widget
              title="Statistics"
              upperTitle
              bodyclassName={""}
              className={""}
              disableWidgetMenu={true}
            >
              <div className="fgm-stats-container">
                <Grid container spacing={4}>
                  <Grid item md={4} xs={12} className="fgd-form">
                    <div className="fgmsc-main">
                      <span>{chart1 ? chart1.title : ""}</span>
                      <div className="fgscm-chart">
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart
                            width={500}
                            height={250}
                            data={chart1 && chart1.data ? chart1.data : []}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 40,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              interval={2}
                            />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#8884d8"
                              fill="#8884d8"
                            />
                            <Brush
                              stroke="#8784d8"
                              startIndex={0}
                              endIndex={
                                chart1 && chart1.data
                                  ? chart1.data.length > 20
                                    ? 19
                                    : chart1.data.length - 1
                                  : 0
                              }
                              height={20}
                              fill="rgba(0, 0, 0, 0)"
                              y={220}
                            >
                              <Area
                                x={0}
                                y={30}
                                type="monotone"
                                dataKey="value"
                                stroke="#000"
                                fill="url(#splitColor)"
                              />
                            </Brush>
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </Grid>
                  <Grid item md={4} xs={12} className="fgd-form">
                    <div className="fgmsc-main">
                      <span>{chart2 ? chart2.title : ""}</span>
                      <div className="fgscm-chart">
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart
                            width={500}
                            height={250}
                            data={chart2 && chart2.data ? chart2.data : []}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 40,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              interval={2}
                            />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#8884d8"
                              fill="#8884d8"
                            />
                            <Brush
                              stroke="#8784d8"
                              startIndex={0}
                              endIndex={
                                chart1 && chart1.data
                                  ? chart1.data.length > 20
                                    ? 19
                                    : chart1.data.length - 1
                                  : 0
                              }
                              height={20}
                              fill="rgba(0, 0, 0, 0)"
                              y={220}
                            >
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#000"
                                fill="url(#splitColor)"
                              />
                            </Brush>
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </Grid>
                  <Grid item md={4} xs={12} className="fgd-form">
                    <div className="fgmsc-main">
                      <span>{chart3 ? chart3.title : ""}</span>
                      <div className="fgscm-chart">
                        <ResponsiveContainer width="100%" height={250}>
                          {chart3 && chart3.dataRx ? (
                            <LineChart
                              width={500}
                              height={250}
                              margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 40,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="category"
                                type="category"
                                allowDuplicatedCategory={false}
                                angle={-45}
                                textAnchor="end"
                              />
                              <YAxis dataKey="value" />
                              <Tooltip />
                              <Line
                                dataKey="value"
                                data={
                                  chart3 && chart3.dataTx ? chart3.dataTx : []
                                }
                                name={"TX"}
                                stroke="#8884d8"
                                fill="#8884d8"
                              />
                              <Line
                                dataKey="value"
                                data={
                                  chart3 && chart3.dataRx ? chart3.dataRx : []
                                }
                                name={"RX"}
                                stroke="#8884d8"
                                fill="#8884d8"
                              />
                              <Brush
                                stroke="green"
                                startIndex={0}
                                endIndex={20}
                                height={20}
                                fill="rgba(0, 0, 0, 0)"
                                y={220}
                              >
                                <Area
                                  data={
                                    chart3 && chart3.dataTx ? chart3.dataTx : []
                                  }
                                  stroke="#000"
                                  fill="url(#splitColor)"
                                />
                              </Brush>
                            </LineChart>
                          ) : (
                            <LineChart
                              width={500}
                              height={250}
                              data={
                                chart3 && chart3.dataTx ? chart3.dataTx : []
                              }
                              margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 40,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                interval={2}
                              />
                              <YAxis />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#8884d8"
                                fill="#8884d8"
                              />
                              <Brush
                                stroke="#8784d8"
                                startIndex={0}
                                endIndex={
                                  chart3 && chart3.dataTx
                                    ? chart3.dataTx.length > 20
                                      ? 19
                                      : chart3.dataTx.length - 1
                                    : 0
                                }
                                height={20}
                                fill="rgba(0, 0, 0, 0)"
                                y={220}
                              >
                                <Area
                                  x={0}
                                  y={30}
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#000"
                                  fill="url(#splitColor)"
                                />
                              </Brush>
                            </LineChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
              {!firstCallDone && (
                <div className="each-widget-loading">
                  <img src={loadingIcon} />
                </div>
              )}
            </Widget>
          </Grid>
          <Grid item xs={12} className="fgd-form individual-grid-five-g">
            <Widget
              title=""
              upperTitle
              bodyclassName={""}
              className={""}
              disableWidgetMenu={true}
            >
              <Tabs className="ne-tabs">
                <TabList>
                  <Tab>Packets</Tab>
                  <Tab>Logs</Tab>
                  <Tab>Console</Tab>
                </TabList>

                <TabPanel>
                  <div className="fdg-packets-container">
                    <div className="fdgpc-head">
                      <div className="fdgpce-row">Number</div>
                      <div className="fdgpce-row">Time</div>
                      <div className="fdgpce-row">Source</div>
                      <div className="fdgpce-row">Destination</div>
                      <div className="fdgpce-row">Protocol</div>
                      <div className="fdgpce-row">Details</div>
                    </div>
                    {networkElementInfo &&
                      networkElementInfo.NF_packets &&
                      networkElementInfo.NF_packets.length > 0 &&
                      networkElementInfo.NF_packets.map((eachPacket, index) => {
                        return (
                          <div key={index} className="fdgpc-each">
                            <div className="fdgpce-row">{index + 1}</div>
                            <div className="fdgpce-row">
                              {eachPacket._source &&
                                eachPacket._source.layers &&
                                eachPacket._source.layers["frame.time"] &&
                                eachPacket._source.layers["frame.time"][0] &&
                                moment(
                                  eachPacket._source.layers["frame.time"][0]
                                ).format("MM-DD-YYYY hh:mm:ss")}
                            </div>
                            <div className="fdgpce-row">
                              {eachPacket._source &&
                                eachPacket._source.layers &&
                                eachPacket._source.layers["ip.src"] &&
                                eachPacket._source.layers["ip.src"][0]}
                            </div>
                            <div className="fdgpce-row">
                              {eachPacket._source &&
                                eachPacket._source.layers &&
                                eachPacket._source.layers["ip.src"] &&
                                eachPacket._source.layers["ip.dst"][0]}
                            </div>
                            <div className="fdgpce-row">
                              {eachPacket._source &&
                                eachPacket._source.layers &&
                                eachPacket._source.layers["_ws.col.Protocol"] &&
                                eachPacket._source.layers[
                                  "_ws.col.Protocol"
                                ][0]}
                            </div>
                            <div className="fdgpce-row">
                              {eachPacket._source &&
                                eachPacket._source.layers &&
                                eachPacket._source.layers["_ws.col.Info"] &&
                                eachPacket._source.layers["_ws.col.Info"][0]}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="fdg-logs-container">
                    {networkElementInfo &&
                      networkElementInfo.NF_Logs &&
                      networkElementInfo.NF_Logs.length > 0 &&
                      networkElementInfo.NF_Logs.map((eachLog, index) => {
                        return <span key={index}>{eachLog}</span>;
                      })}
                  </div>
                </TabPanel>
                <TabPanel>
                  <h2> Terminal </h2>
                </TabPanel>
              </Tabs>
              {!firstCallDone && (
                <div className="each-widget-loading">
                  <img src={loadingIcon} />
                </div>
              )}
            </Widget>
          </Grid>
        </Grid>

        <Dialog open={handoverStatus} id="handover-prepare">
          <DialogTitle>
            Handover Prepare
            <Icons.Close
              fontSize={"small"}
              className="hp-close-icon"
              onClick={this.toggleHandOver}
            />
          </DialogTitle>
          <DialogContent>
            <Grid className="hp-container" container spacing={2}>
              {handOverError && handOverError !== "" && (
                <span className="hpc-error">{handOverError}</span>
              )}
              <Grid item xs={12} className="fgd-form">
                <div className="hpc-content">
                  {ueList && ueList.length > 0 && (
                    <div className="hpc-table-each">
                      <div className="hpct-row"></div>
                      <div className="hpct-row">UEID</div>
                      <div className="hpct-row">Status</div>
                    </div>
                  )}

                  {!callUnderProgress && (
                    <>
                      {ueList && ueList.length > 0 ? (
                        ueList.map((eachUe, index) => {
                          return (
                            <div
                              key={index}
                              className="hpc-table-each"
                              onClick={() => {
                                this.handleHandoverChange(eachUe["- ue-id"]);
                              }}
                            >
                              <div className="hpct-row">
                                <MyRadio
                                  checked={
                                    selectedHandoverElement ===
                                    eachUe["- ue-id"]
                                  }
                                  onChange={() => {
                                    this.handleHandoverChange(
                                      eachUe["- ue-id"]
                                    );
                                  }}
                                  value={eachUe["- ue-id"]}
                                  name="radio-button-demo"
                                />
                              </div>
                              <div className="hpct-row">
                                {eachUe["- ue-id"]}
                              </div>
                              <div className="hpct-row">Connected</div>
                            </div>
                          );
                        })
                      ) : (
                        <span className="no_ue">No UE to handover</span>
                      )}
                    </>
                  )}
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {callUnderProgress ? (
              <img src={loadingIcon} className="call_under_progress_icon" />
            ) : (
              <>
                {ueList && ueList.length > 0 && (
                  <Button onClick={this.submitHandOver} color="primary">
                    Submit
                  </Button>
                )}
              </>
            )}
          </DialogActions>
        </Dialog>

        <Dialog open={pathSwitchStatus} id="path-switch">
          <DialogTitle>
            Path Switch Request
            <Icons.Close
              fontSize={"small"}
              className="hp-close-icon"
              onClick={this.togglePathSwitch}
            />
          </DialogTitle>
          <DialogContent>
            <Grid className="hp-container" container spacing={2}>
              {pathSwitchError && pathSwitchError !== "" && (
                <span className="hpc-error">{pathSwitchError}</span>
              )}
              <Grid item xs={12} className="fgd-form">
                <div className="hpc-content">
                  {pathSwitch && pathSwitch.length > 0 && (
                    <div className="hpc-table-each">
                      <div className="hpct-row"></div>
                      <div className="hpct-row">UEID</div>
                      <div className="hpct-row">Source gNB ID</div>
                    </div>
                  )}
                  {!callUnderProgress && (
                    <>
                      {pathSwitch && pathSwitch.length > 0 ? (
                        pathSwitch.map((eachUe, index) => {
                          return (
                            <div
                              key={index}
                              className="hpc-table-each"
                              onClick={() => {
                                this.handlePathSwitchChange(eachUe["key"]);
                              }}
                            >
                              <div className="hpct-row">
                                <MyRadio
                                  checked={
                                    selectedPathSwitchElement === eachUe["key"]
                                  }
                                  onChange={() => {
                                    this.handlePathSwitchChange(eachUe["key"]);
                                  }}
                                  value={eachUe["key"]}
                                  name="radio-button-demo"
                                />
                              </div>
                              <div className="hpct-row">{eachUe["ueid"]}</div>
                              <div className="hpct-row">{eachUe["source"]}</div>
                            </div>
                          );
                        })
                      ) : (
                        <span className="no_ue">No UE to switch</span>
                      )}
                    </>
                  )}
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {callUnderProgress ? (
              <img src={loadingIcon} className="call_under_progress_icon" />
            ) : (
              <>
                {pathSwitch && pathSwitch.length > 0 && (
                  <Button onClick={this.submitPathSwitch} color="primary">
                    Submit
                  </Button>
                )}
              </>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.config,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MonitorNetworkElement);
