import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import './monitorNetwork.scss';

import $ from 'jquery';

import {
    Grid
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
    RadialBarChart,
    RadialBar
} from "recharts";

import axios from 'axios';

import Widget from "../../components/Widget";
import { Typography } from "../../components/Wrappers";

import alerticon from '../../images/home/alert.svg';
import devicesIcon from '../../images/home/devices.svg';
import cloudIcon from '../../images/home/cloud.svg';
import serverIcon from '../../images/home/server.svg';
import gnbIcons from '../../images/home/gnb.svg';
import loadingIcon from '../../images/home/loading.gif';

import apiService from '../../services/apiService.js';

class MonitorNetwork extends Component {

    constructor(props) {
        super(props);

        this.state = {
            lineData: [
                { name: 'July 1', uv: 4000 },
                { name: 'July 2', uv: 3000 },
                { name: 'July 3', uv: 2000 },
                { name: 'July 4', uv: 1000 },
                { name: 'July 5', uv: 1890 }
            ],
            elementDetails: false,
            elementDetailsCoordinates: {},
            networkInfo: {},
            elmentDetailsData: [],
            callUnderProgress: false,
            firstCallDone: false
        }

        this.monitorHomeToken = null;
        this.timeout = null;

    }

    componentDidMount = () => {
        this.getMonitorHomeData();
        this.timeout = setInterval(this.intiateCall, 5000);
    }

    intiateCall = () => {
        if (!this.state.callUnderProgress) {
            this.getMonitorHomeData();
        }
    }

    componentWillUnmount() {
        if (this.monitorHomeToken)
            this.monitorHomeToken.cancel();
        clearInterval(this.timeout);
    }

    getMouseCoordinates = (e) => {
        var m_posx = 0, m_posy = 0, e_posx = 0, e_posy = 0,
            obj = document.getElementById('network-topology');
        //get mouse position on document crossbrowser
        if (!e) { e = window.event; }
        if (e.pageX || e.pageY) {
            m_posx = e.pageX;
            m_posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            m_posx = e.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft;
            m_posy = e.clientY + document.body.scrollTop
                + document.documentElement.scrollTop;
        }
        //get parent element position in document
        if (obj.offsetParent) {
            do {
                e_posx += obj.offsetLeft;
                e_posy += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }
        // mouse position minus elm position is mouseposition relative to element:
        return { x: m_posx - e_posx, y: m_posy - e_posy };

    }

    showElements = (evt, data) => {
        this.setState({ elementDetails: true, elmentDetailsData: data });
        var coordinates = this.getMouseCoordinates(evt);
        this.setState({ elementDetailsCoordinates: coordinates });
    }

    closeElements = () => {
        this.setState({ elementDetails: false });
    }

    getMonitorHomeData = () => {

        var thisView = this;
        if (this.monitorHomeToken)
            this.monitorHomeToken.cancel();
        this.monitorHomeToken = axios.CancelToken.source();

        this.setState({ callUnderProgress: true });
        axios.all([apiService.getMonitorHomeData(this.monitorHomeToken.token)])
            .then(function (res) {
                if (res[0]) {
                    thisView.setState({ networkInfo: res[0]["data"] });
                    // console.log($(thisView.refs.PreviewGaugeMeter_2));
                    // $(thisView.refs.PreviewGaugeMeter_2).gaugeMeter({percent:15});
                    thisView.setState({ callUnderProgress: false });
                    thisView.setState({ firstCallDone: true })
                }
            }).catch(function (res) {
                console.log(res);
                console.log('An error occurred monitor service');
                thisView.setState({ callUnderProgress: false });

            });

    }

    render() {

        const { lineData, elementDetails, elementDetailsCoordinates, networkInfo, elmentDetailsData, firstCallDone } = this.state;

        return (
            <div className="five-g-monitor">
                <Grid container spacing={4}>
                    <Grid item lg={4} md={6} xs={12} className="fgm-inner-grid individual-grid-five-g">
                        <Widget
                            title="Network Summary"
                            upperTitle
                            bodyclassName={''}
                            className={'test'}
                            disableWidgetMenu={true}
                        >
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                            >
                                <Grid item md={3} xs={12} className="text-center">
                                    <Typography color="text" colorBrightness="secondary">
                                        RAN Spectrum Utilization
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <div className="c100 p33 center">
                                        <span>33%</span>
                                        <div className="slice">
                                            <div className="bar">
                                            </div>
                                            <div className="fill">
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <div className="c100 p63 center">
                                        <span>63%</span>
                                        <div className="slice">
                                            <div className="bar">
                                            </div>
                                            <div className="fill">
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item md={3} xs={12} className="text-center">
                                    <Typography color="text" colorBrightness="secondary">
                                        Core Network Utilization
                                    </Typography>
                                </Grid>
                                {
                                    !firstCallDone &&
                                    <div className="each-widget-loading">
                                        <img src={loadingIcon} />
                                    </div>
                                }
                            </Grid>
                            <div className="ns-text">
                                <span>Top network elements needing attention</span>
                            </div>
                            <div className="ns-alert">
                                {/* <img src={alerticon} alt="alert" /> */}
                                <Icons.CheckCircle fontSize={"small"} className="hp-tick-icon" onClick={this.toggleHandOver} />
                                <div className="nsa-error">
                                    <div>
                                        <span>{networkInfo ? networkInfo.malfunction : ''}</span>
                                        <span></span>
                                        {/* <span>Network Failure</span> */}
                                    </div>
                                    {/* <div>
                                        <span>gNB102:</span>
                                        <span>Malfunctioning</span>
                                    </div> */}
                                </div>
                            </div>
                        </Widget>
                    </Grid>
                    <Grid item lg={4} md={6} xs={12} className="fgd-form individual-grid-five-g">
                        <Widget
                            title=""
                            upperTitle
                            bodyclassName={''}
                            className={''}
                            disableWidgetMenu={true}
                        >
                            {
                                <RadialBarChart
                                    width={350}
                                    height={300}
                                    innerRadius="10%"
                                    outerRadius="80%"
                                    data={[

                                        {
                                            "name": "d",
                                            "uv": 100,
                                            "fill": "#ffff"
                                        }, {
                                            "name": "utilization",
                                            "uv": (networkInfo && networkInfo.count_active_cells && networkInfo.count_available_cells) ? Math.round((networkInfo.count_active_cells / networkInfo.count_available_cells) * 100) : 0,
                                            "fill": "#0731E2"
                                        }
                                    ]}
                                    startAngle={180}
                                    endAngle={0}
                                >
                                    <RadialBar minAngle={15} background clockWise={true} dataKey='uv' />
                                </RadialBarChart>
                            }

                            <div className="fgm-util-each fgmue-first">
                                <span>No. of cells available:</span>
                                <span>{(networkInfo && networkInfo.count_available_cells) ? networkInfo.count_available_cells : '-'}</span>
                            </div>

                            <div className="fgm-util-each">
                                <span>No. of cells active:</span>
                                <span>{(networkInfo && networkInfo.count_active_cells) ? networkInfo.count_active_cells : '-'}</span>
                            </div>

                            <div className="fgm-util-each">
                                <span>Percentage Utilization:</span>
                                <span>{(networkInfo && networkInfo.count_active_cells && networkInfo.count_available_cells) ? Math.round((networkInfo.count_active_cells / networkInfo.count_available_cells) * 100) : '-'}</span>
                            </div>
                            {
                                !firstCallDone &&
                                <div className="each-widget-loading">
                                    <img src={loadingIcon} />
                                </div>
                            }
                        </Widget>
                    </Grid>
                    <Grid item lg={4} xs={12} className="fgd-form individual-grid-five-g">
                        <Widget
                            title="Time series of traffic this month"
                            upperTitle
                            bodyclassName={''}
                            className={''}
                            disableWidgetMenu={true}
                        >
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart
                                    width={500}
                                    height={200}
                                    data={lineData}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                            {
                                !firstCallDone &&
                                <div className="each-widget-loading">
                                    <img src={loadingIcon} />
                                </div>
                            }
                        </Widget>
                    </Grid>
                    <Grid item xs={12} className="fgd-form individual-grid-five-g" id="network-topology">
                        <Widget
                            title="Network Topology"
                            upperTitle
                            bodyclassName={''}
                            className={''}
                            customeclassName={'network-topology'}
                            disableWidgetMenu={true}
                        >

                            <div className="network-topology-container">
                                <div className="ntc-elements">
                                    <div className="ntce-main">
                                        <div className="ntce-elements-top">

                                            {
                                                networkInfo && networkInfo.listNFs &&
                                                Object.keys(networkInfo.listNFs).map((nfsKey, index) => {

                                                    if (index <= Object.keys(networkInfo.listNFs).length / 2) {

                                                        if (networkInfo.listNFs[nfsKey].length === 1) {
                                                            return (
                                                                <NavLink key={nfsKey + index} to={this.props.match.path + "/" + networkInfo.listNFs[nfsKey][0]["containerid"]} className="ntce-each">
                                                                    <span>{nfsKey}</span>
                                                                </NavLink>
                                                            )
                                                        } else {
                                                            return (
                                                                <div key={nfsKey + index} className="ntce-each">
                                                                    <span onClick={(evt) => { this.showElements(evt, networkInfo.listNFs[nfsKey]) }}>{nfsKey}</span>
                                                                    <span></span><span></span><span></span>
                                                                </div>
                                                            )

                                                        }


                                                    }

                                                })
                                            }

                                        </div>
                                        <div className="ntce-elements-bottom">

                                            {
                                                networkInfo && networkInfo.listNFs &&
                                                Object.keys(networkInfo.listNFs).map((nfsKey, index) => {

                                                    if (index > Object.keys(networkInfo.listNFs).length / 2) {

                                                        if (networkInfo.listNFs[nfsKey].length === 1) {
                                                            return (
                                                                <NavLink key={nfsKey + index} to={this.props.match.path + "/" + networkInfo.listNFs[nfsKey][0]["containerid"]} className="ntce-each bottom">
                                                                    <span>{nfsKey}</span>
                                                                </NavLink>
                                                            )
                                                        } else {
                                                            return (
                                                                <div key={nfsKey + index} className="ntce-each bottom">
                                                                    <span onClick={(evt) => { this.showElements(evt, networkInfo.listNFs[nfsKey]) }}>{nfsKey}</span>
                                                                    <span></span><span></span><span></span>
                                                                </div>
                                                            )
                                                        }


                                                    }

                                                })
                                            }

                                            {
                                                networkInfo && networkInfo.listNFs &&
                                                Object.keys(networkInfo.listNFs).length % 2 === 1 &&
                                                <div className="ntce-each no-data" >

                                                </div>
                                            }

                                        </div>
                                        <div className="ntc-network-line">

                                        </div>
                                    </div>
                                    <div className="ntc-spects">
                                        <div className="ntcs-split">
                                            <div className="ntcs-each">
                                                <span>{(networkInfo && networkInfo.counts_in_topo && networkInfo.counts_in_topo.nfs) ? networkInfo.counts_in_topo.nfs : "-"}
                                                    <sub>NFs</sub></span>
                                            </div>
                                            <div className="ntcs-each">
                                                <span>{(networkInfo && networkInfo.counts_in_topo && networkInfo.counts_in_topo.hasOwnProperty("edges")) ? networkInfo.counts_in_topo.edges : "-"}
                                                    <sub>Edges</sub></span>
                                            </div>
                                        </div>
                                        <div className="ntcs-split">
                                            <div className="ntcs-each">
                                                <span>{(networkInfo && networkInfo.counts_in_topo && networkInfo.counts_in_topo.rrhs) ? networkInfo.counts_in_topo.rrhs : "-"}
                                                    <sub>RRHs</sub></span>
                                            </div>
                                            <div className="ntcs-each">
                                                <span>{(networkInfo && networkInfo.counts_in_topo && networkInfo.counts_in_topo.gnbs) ? networkInfo.counts_in_topo.gnbs : "-"}
                                                    <sub>gNBs</sub></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="ntc-network">
                                    <div className="ntcn-map">
                                        <div className="ntc-network-line"></div>
                                        <div className="ntc-nl-gnbs">

                                            {
                                                networkInfo && networkInfo.gnbsUes && networkInfo.gnbsUes.gnb && networkInfo.gnbsUes.gnb.length &&
                                                networkInfo.gnbsUes.gnb.map((eachGnb) => {
                                                    return (
                                                        <NavLink className="ntcnlg-each" key={eachGnb.containerid} to={this.props.match.path + "/" + eachGnb.containerid} >
                                                            <img src={gnbIcons} />
                                                            <span>{eachGnb.name}</span>
                                                        </NavLink>
                                                    )
                                                })
                                            }

                                        </div>
                                    </div>
                                    <div className="ntcn-devices">
                                        <div className="ntcnd-image">
                                            <img src={devicesIcon} alt="device" />
                                        </div>
                                        <div className="ntcnd-count">
                                            <span>Devices</span>
                                            <span>{(networkInfo && networkInfo.count_available_cells) ? networkInfo.count_available_cells : "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                !firstCallDone &&
                                <div className="each-widget-loading">
                                    <img src={loadingIcon} />
                                </div>
                            }
                        </Widget>
                        {
                            elementDetails &&
                            <div className="network-overlay">
                                {
                                    <div className="ntce-element-details" style={{
                                        left: elementDetailsCoordinates.x + "px", top: elementDetailsCoordinates.y + "px",
                                        width: elmentDetailsData ? elmentDetailsData.length * 150 + "px" : "350px",
                                        marginLeft: elmentDetailsData ? -1 * elmentDetailsData.length / 2 * 150 + "px" : "-175px"
                                    }}>


                                        {
                                            elmentDetailsData && elmentDetailsData.length > 0 &&
                                            elmentDetailsData.map((eachElement, index) => {
                                                return (
                                                    <NavLink key={eachElement.containerid} to={this.props.match.path + "/" + eachElement.containerid} className="ntceed-each">
                                                        <span>{eachElement.name}</span>
                                                        {
                                                            eachElement.internet === 'yes' ?
                                                                <div className="ntceed-icons">
                                                                    <img src={cloudIcon} alt="cloud" />
                                                                    <span>Internet</span>
                                                                </div> :
                                                                <div className="ntceed-icons">
                                                                    <img src={serverIcon} alt="server" />
                                                                    <span>MEC Server</span>
                                                                </div>
                                                        }
                                                        <div className="ntceede-connector"></div>
                                                    </NavLink>
                                                )
                                            })
                                        }
                                        <div className="ntce-ed-close">
                                            <Icons.Close fontSize={"small"} className="ntce-close-icon" onClick={this.closeElements} />
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </Grid>
                </Grid>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    config: state.config

});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(MonitorNetwork);