import React, { Component } from 'react';
import 'rsuite/dist/styles/rsuite-default.css';
import './manageAppDeployment.scss';
import axios from 'axios';
import { connect } from 'react-redux';
import { notify } from 'react-notify-toast';
import { NavLink } from "react-router-dom";
import {
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    MenuItem,
    TextField
} from "@material-ui/core";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    YAxis,
    XAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    RadialBarChart,
    RadialBar
} from "recharts";


import Select from 'react-select'

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';

import * as Icons from "@material-ui/icons";

import Widget from "../../components/Widget";

import rightArrowIcon from "../../images/new_flow_images/arrow_big.svg";
import weightSensorIcon from "../../images/new_flow_images/weight_sensor.svg";


import actuatorIcon from "../../images/new_flow_images/actuator.svg";
import analyticsIcon from "../../images/new_flow_images/analytics.svg";
import applicationIcon from "../../images/new_flow_images/application.svg";

import apiService from '../../services/apiService.js';
import { updateDeploy } from '../../store/siteCoordinator/siteCoordinator.actions';
import { withRouter } from 'react-router-dom'


class ManageAppDeployment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "Cloud",
            manageDeploySelectOptions: [
                { value: 'cloud', label: 'Cloud' },
                { value: 'internal', label: 'Internal' },
                { value: 'external', label: 'External' }
            ],
            manageInputSelectOptions: [
                { value: 'device21', label: 'Device21' },
                { value: 'device22', label: 'Device22' },
                { value: 'device23', label: 'Device23' }
            ],
            manageInputSecondSelectOptions: [
                { value: 'device17', label: 'Device17' },
                { value: 'device18', label: 'Device18' },
                { value: 'device19', label: 'Device19' }
            ],
            callUnderProgress: false,
            deployEndPoints: {},
            url: 'https://agri-vision.webflow.io/', urlConnected: false, analyzeApplication: false,
            applicationUeList: []
        }
    }

    componentDidMount = () => {
        const { deployStats, deployEndPoints, applicationUeList } = this.props.deploy
        if (!deployStats || !deployEndPoints || !applicationUeList) {
            this.getDeployStats();
            this.getEndPoints();
            this.getApplicationUEList();



        } else {
            this.setState({ deployStats });
            this.setState({ deployEndPoints });
            this.setState({ callUnderProgress: false });
            this.setState({ applicationUeList });
            this.setState({ urlConnected: true });
            this.setState({ analyzeApplication: true });



        }


        this.deployStateTimeout = setInterval(this.intiateCall, 5000);
    }

    intiateCall = () => {
        if (!this.state.callUnderProgress) {
            this.getDeployStats();
        }
    }

    componentWillUnmount() {
        if (this.deployStatsToken)
            this.deployStatsToken.cancel();
        if (this.deployInputsToken)
            this.deployInputsToken.cancel();
        if (this.applicationUeListToken)
            this.applicationUeListToken.cancel();
        clearInterval(this.deployStateTimeout);
    }

    getDeployStats = () => {

        var thisView = this;
        if (this.deployStatsToken)
            this.deployStatsToken.cancel();
        this.deployStatsToken = axios.CancelToken.source();

        this.setState({ callUnderProgress: true });
        axios.all([apiService.getDeployStats(this.deployStatsToken.token)])
            .then(function (res) {
                if (res[0]) {

                    let deployStats = (res[0]["data"] && res[0]["data"]) ? res[0]["data"] : [];
                    thisView.setState({ deployStats });
                    thisView.setState({ callUnderProgress: false });
                }
            }).catch(function (res) {
                console.log(res);
                console.log('An error occurred monitor service');
                thisView.setState({ callUnderProgress: false });

            });

    }

    getEndPoints = () => {

        var thisView = this;
        if (this.deployInputsToken)
            this.deployInputsToken.cancel();
        this.deployInputsToken = axios.CancelToken.source();

        this.setState({ callUnderProgress: true });
        axios.all([apiService.getEndPoints(this.deployInputsToken.token)])
            .then(function (res) {
                if (res[0]) {

                    let deployEndPoints = (res[0]["data"] && res[0]["data"]) ? res[0]["data"] : [];
                    thisView.setState({ deployEndPoints });
                    thisView.setState({ callUnderProgress: false });
                }
            }).catch(function (res) {
                console.log(res);
                console.log('An error occurred monitor service');
                thisView.setState({ callUnderProgress: false });

            });

    }

    getApplicationUEList = () => {

        var thisView = this;
        if (this.applicationUeListToken)
            this.applicationUeListToken.cancel();
        this.applicationUeListToken = axios.CancelToken.source();

        this.setState({ callUnderProgress: true });
        axios.all([apiService.getApplicationUEList(this.applicationUeListToken.token)])
            .then(function (res) {
                if (res[0]) {

                    let applicationUeList = (res[0]["data"] && res[0]["data"]) ? res[0]["data"] : [];
                    thisView.setState({ applicationUeList });
                }
            }).catch(function (res) {
                console.log(res);
                console.log('An error occurred monitor service');
                thisView.setState({ callUnderProgress: false });

            });

    }

    onchangeInput = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    connectApplication = () => {

        if (!this.state.url || this.state.url.trim() === '') {
            notify.show("Please Enter URL", "custom", this.props.toaster.duration, this.props.toaster.error);
        } else {
            this.setState({ urlConnected: true });
        }

    }

    analyseApplication = () => {
        this.setState({ analyzeApplication: true });
    }

    resetState = () => {

        this.setState({ urlConnected: false });
    }

    render() {

        const { deployStats, manageDeploySelectOptions, manageInputSelectOptions, manageInputSecondSelectOptions,
            deployEndPoints, url, urlConnected, analyzeApplication, applicationUeList } = this.state;
        const { history } = this.props
        return (
            <div className="monitoring-network-deploy-block">

                <Grid container spacing={4}>
                    <Grid item lg={6} md={6} xs={12} className="fgm-inner-grid">
                        <div className="mnd-first-section">
                            <div className="mls-bar-header">Application Deployment</div>
                            <div className="choose-an-option-below-box">
                                {
                                    urlConnected &&
                                    <div className="choose-an-option-below-title-box">
                                        <div className="choose-an-option-bullet-icon"></div>
                                        {
                                            deployEndPoints && deployEndPoints.length > 0 && deployEndPoints[0] && deployEndPoints[0]["name"] &&
                                            <div className="choose-an-option-below-title">{deployEndPoints[0]["name"]}</div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="application-host-block">
                            <Grid container spacing={2}>
                                <Grid item lg={5} md={6} xs={6} className="fgm-inner-grid devices-deploy-custom-column">
                                    <div className="application-host-form">
                                        <span>Application hosted on</span>
                                    </div>
                                </Grid>
                                <Grid item lg={7} md={6} xs={6} className="fgm-inner-grid devices-deploy-custom-column">
                                    <Box>
                                        <div className="mds-left-section">
                                            <Select defaultValue={{ label: "Cloud", value: 0 }} options={manageDeploySelectOptions} />
                                        </div>
                                    </Box>
                                </Grid>

                                <Grid item lg={5} md={6} xs={6} className="fgm-inner-grid devices-deploy-custom-column2">
                                    <div className="application-host-form">
                                        <span>URL</span>
                                    </div>
                                </Grid>
                                <Grid item lg={7} md={6} xs={6} className="fgm-inner-grid devices-deploy-custom-column2">
                                    <div className="mb-3">
                                        <input type="text" name="url" value={url} onChange={this.onchangeInput} className="form-control custom-" placeholder="" />
                                    </div>
                                </Grid>

                                <Grid item lg={5} md={6} xs={6} className="fgm-inner-grid">
                                    <div className="application-host-form">
                                    </div>
                                </Grid>

                                <Grid item lg={7} md={6} sm={12} xs={12} className="fgm-inner-grid devices-deploy-custom-column3">

                                    <Button
                                        className="connect-button"
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        onClick={this.connectApplication}
                                    >
                                        Connect
                                    </Button>

                                </Grid>

                            </Grid>
                        </div>
                    </Grid>

                    {
                        analyzeApplication &&
                        <Grid item lg={6} md={6} xs={12} className="fgd-form">
                            <div className="mnd-second-section">
                                <div className="mls-bar-header">The activity of {deployEndPoints && deployEndPoints.length > 0 && deployEndPoints[0] && deployEndPoints[0]["name"] ? deployEndPoints[0]["name"] : ""} Application</div>
                            </div>
                            <div className="mnd-chart-block">
                                <Widget
                                    title=""
                                    upperTitle
                                    bodyclassName={''}
                                    className={''}
                                    disableWidgetMenu={true}
                                >
                                    {
                                        (deployStats && deployStats.length > 0) &&
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart
                                                width={500}
                                                height={200}
                                                data={deployStats ? deployStats : []}
                                                margin={{
                                                    top: 30,
                                                    right: 10,
                                                    left: 10,
                                                    bottom: 0,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="x" type="category" hide={true} />
                                                <YAxis dataKey="Packet Loss" hide={true} />
                                                <Tooltip />
                                                <Legend verticalAlign="top" align="right" wrapperStyle={{ top: 5 }} />
                                                <Line type="monotone" dataKey="Latency" stroke="#8884d8" fill="#8884d8" />
                                                <Line type="monotone" dataKey="Packet Loss" stroke="#4789E1" fill="#4789E1" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    }
                                </Widget>
                            </div>
                        </Grid>
                    }

                </Grid>


                <br />

                {
                    urlConnected &&
                    <div className="deploy-input-section">
                        <Grid container spacing={4} alignItems="center" justifyContent='space-between' style={{ gap: '12px' }} className="deploy-input-wrapper">
                            <Grid item lg={3} md={3} sm={12} xs={12} className="fgm-inner-grid each-deploy-input-output-block">
                                <div className="each-deploy-input-output-section">
                                    <div className="each-deploy-input-output-title">Inputs</div>
                                    {
                                        deployEndPoints && deployEndPoints.length > 0 && deployEndPoints[0] && deployEndPoints[0]["details"] &&
                                        deployEndPoints[0]["details"] && deployEndPoints[0]["details"]["inputs"] &&
                                        deployEndPoints[0]["details"]["inputs"].length > 0 &&
                                        deployEndPoints[0]["details"]["inputs"].map((eachInput, inputIndex) => {
                                            return (
                                                <div className="each-deploy-input-output-main" key={inputIndex}>
                                                    <Grid container spacing={2} className="each-deploy-input-output-grid">
                                                        <Grid item lg={2} md={12} xs={2}>
                                                            <img src={weightSensorIcon} alt="weightSensorIcon" className="weight-sensor-icon" />
                                                        </Grid>
                                                        <Grid item lg={5} md={12} xs={5} className="fgm-inner-grid devices-deploy-custom-column">
                                                            <div className="application-host-form">
                                                                <span>{eachInput.name}</span>
                                                            </div>
                                                        </Grid>
                                                        <Grid item lg={5} md={12} xs={5} className="fgm-inner-grid devices-deploy-custom-column">
                                                            <Box>
                                                                <div className="mds-left-section">
                                                                    <Select defaultValue={this.props.deploy && this.props.deploy.selectedApplicationUeList ? this.props.deploy.selectedApplicationUeList : applicationUeList[0]} options={applicationUeList}
                                                                        onChange={(value) => {

                                                                            this.props.updateDeploy({
                                                                                ...this.props.deploy,
                                                                                selectedApplicationUeList: value
                                                                            })
                                                                        }
                                                                        }
                                                                    />
                                                                </div>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            )
                                        })
                                    }

                                </div>
                            </Grid>
                            <img src={rightArrowIcon} alt="rightArrowIcon" className="right-arrow-icon" />
                            <Grid item lg={3} md={3} sm={12} xs={12} className="fgm-inner-grid each-deploy-input-output-block">
                                <div className="each-deploy-input-output-section">
                                    <div className="each-deploy-input-output-title">Application</div>
                                    <div className="each-deploy-input-output-app-title">
                                        {
                                            (deployEndPoints && deployEndPoints.length > 0 && deployEndPoints[0] && deployEndPoints[0]["name"]) ?
                                                deployEndPoints[0]["name"] : ""
                                        }
                                    </div>

                                    <div className="each-deploy-input-output-app-icon">
                                        <img src={applicationIcon} alt="applicationIcon" className="applicationIcon" />
                                    </div>

                                    <div className="each-deploy-input-output-app-analyse">
                                        <span onClick={this.analyseApplication}>Analyse</span>
                                    </div>

                                </div>
                            </Grid>
                            <img src={rightArrowIcon} alt="rightArrowIcon" className="right-arrow-icon" />
                            <Grid item lg={3} md={3} sm={12} xs={12} className="fgm-inner-grid each-deploy-input-output-block" >
                                <div className="each-deploy-input-output-section">
                                    <div className="each-deploy-input-output-title">Outputs</div>

                                    {
                                        deployEndPoints && deployEndPoints.length > 0 && deployEndPoints[0] && deployEndPoints[0]["details"] &&
                                        deployEndPoints[0]["details"] && deployEndPoints[0]["details"]["outputs"] &&
                                        deployEndPoints[0]["details"]["outputs"].length > 0 &&
                                        deployEndPoints[0]["details"]["outputs"].map((eachOutput, outputIndex) => {

                                            if (eachOutput.type === "link") {
                                                return (
                                                    <div className="each-deploy-input-output-main" key={outputIndex}>
                                                        <Grid container spacing={2} className="each-deploy-input-output-grid">
                                                            <Grid item lg={2} md={3} xs={2}>
                                                                <img src={analyticsIcon} alt="analyticsIcon" className="weight-sensor-icon" />
                                                            </Grid>
                                                            <Grid item lg={4} md={9} xs={4} className="fgm-inner-grid devices-deploy-custom-column">
                                                                <div className="application-host-form">
                                                                    <span>{eachOutput.name}</span>
                                                                </div>
                                                            </Grid>
                                                            <Grid item lg={6} md={12} xs={6} className="fgm-inner-grid devices-deploy-custom-column">
                                                                <Box>
                                                                    <div className="click-here-to-access-button"
                                                                        onClick={() => {
                                                                            this.props.updateDeploy({})
                                                                            setTimeout(this.resetState
                                                                                , 15000);
                                                                            history.push('/show')


                                                                        }}
                                                                    >

                                                                        Click here to access
                                                                    </div>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div className="each-deploy-input-output-sub-section" key={outputIndex}>
                                                        <Grid container spacing={2} className="each-deploy-input-output-grid">
                                                            <Grid item lg={2} md={2} xs={2}>
                                                                <img src={actuatorIcon} alt="actuatorIcon" className="weight-sensor-icon" />
                                                            </Grid>
                                                            <Grid item lg={4} md={4} xs={4} className="fgm-inner-grid devices-deploy-custom-column">
                                                                <div className="application-host-form">
                                                                    <span>{eachOutput.name}</span>
                                                                </div>
                                                            </Grid>
                                                            <Grid item lg={6} md={6} xs={6} className="fgm-inner-grid devices-deploy-custom-column">
                                                                <Box>
                                                                    <div className="mds-left-section">
                                                                        <Select defaultValue={applicationUeList[0]} options={applicationUeList}

                                                                        />
                                                                    </div>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                )
                                            }

                                        })

                                    }

                                </div>
                            </Grid>
                            <img src={rightArrowIcon} alt="rightArrowIcon" className="right-arrow-icon" style={{ display: 'none' }} />
                        </Grid>
                    </div>
                }

                {
                    urlConnected && analyzeApplication && !this.props.deploy.deployStats &&
                    <Grid className='mndb-add-to-network'>

                        <div onClick={() => {
                            this.props.updateDeploy({
                                ...this.props.deploy,
                                deployEndPoints,
                                applicationUeList,
                                deployStats
                            })
                            history.push('/manage')
                        }} className={"mndb-add-to-network-text"}>
                            Add Application to Network
                        </div>
                    </Grid>
                }
            </div >
        );
    }
}

const mapStateToProps = state => ({
    config: state.siteCoordinator.config,
    toaster: state.siteCoordinator.toaster,
    deploy: state.siteCoordinator.deploy

});

const mapDispatchToProps = dispatch => ({
    updateDeploy: (confg) => dispatch(updateDeploy(confg))

});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ManageAppDeployment));