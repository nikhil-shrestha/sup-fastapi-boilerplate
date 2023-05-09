import React, { Component } from 'react';
import axios from 'axios';
import './deployNetwork.scss';

import Select from 'react-select';
import {
    Grid
} from "@material-ui/core";

import loadingIcon from '../../images/home/loading.gif';
import mapsimage from '../../images/app/floor_5g_big.jpg';

import apiService from '../../services/apiService';
import { TimerSharp } from '@material-ui/icons';

class DeployNetwork extends Component {

    constructor(props) {
        super(props);
        this.state = {
            facilityType : [
                { value: 'warehouse', label: 'warehouse' },
                { value: 'factory', label: 'factory' },
                { value: 'facilty', label: 'facilty' }
            ],
            squareType : [
                { value: 'warehouse', label: 'warehouse' },
                { value: 'factory', label: 'factory' },
                { value: 'facilty', label: 'facilty' }
            ],
            callUnderProgress: false,
        }

        this.buildADemoToken = null;

    }

    buildADemo = () => {

        var thisView = this;
        if (this.buildADemoToken)
            this.buildADemoToken.cancel();
        this.buildADemoToken = axios.CancelToken.source();

        this.setState({callUnderProgress: true});
        axios.all([apiService.buildADemo(this.buildADemoToken.token)])
            .then(function (res) {
                if (res[0]) {
                    thisView.setState({callUnderProgress: false});
                }
            }).catch(function (res) {
                console.log(res);
                console.log('An error occurred build a demo');
                thisView.setState({callUnderProgress: false});
            });

    }


    render() {

        const { facilityType, squareType, callUnderProgress } = this.state;

        return (
            <div className="five-g-deploy">
                <div className="fgd-top-head">
                    <span>Deploy Network</span>
                </div>
                <Grid container spacing={4}>
                    <Grid item lg={8} md={6} sm={6} xs={12} className="fgd-inner-grid">
                        <div className="fgd-search">
                            <input type="text" placeholder="38811 Cherry St, Newark, CA 94560, United States" />
                        </div>
                        <div className="fgd-map-container">
                            <img src={mapsimage} alt="map" />
                        </div>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12} className="fgd-form">
                        <div className="fgd-head">
                            
                        </div>
                        <div className="fgd-form-container first_container">
                            <div className="fdgfc-each">
                                <span>Type of facility:</span>
                                <Select options={facilityType} />
                            </div>
                            <div className="fdgfc-each square-footage">
                                <span>Square footage:</span>
                                <input type="text" placeholder="5000" />
                                <Select className="square-type" options={squareType} />
                            </div>
                            <div className="fdgfc-each number-of-devices">
                                <span>Number of devices:</span>
                                <input type="text" placeholder="300" />
                            </div>
                            <div className="fdgfc-each access-points">
                                <span>Number of access points</span>
                                <input type="text" placeholder="30" />
                            </div>
                        </div>
                        <div className="fgd-form-container second_container">
                            <div className="fdgfc-each access-points side-by-side">
                                <span>Floor Plan</span>
                                <Select options={facilityType} placeholder={"Sample/Upload"} />
                            </div>
                            <div className="fdgfc-each access-points side-by-side">
                                <span>Number Of Networks</span>
                                <input type="text" placeholder="30" />
                            </div>
                            <div className="fdgfc-each access-points sub-points">
                                <div className="fdgfc-each access-points side-by-side form-head">
                                    <span>Number Of gNBs</span>
                                    <input type="text" placeholder="30" />
                                </div>
                                <div className="fdgfc-each access-points ">
                                    <span>Distribution Of gNBs</span>
                                    <Select options={facilityType} placeholder={"Random"}/>
                                </div>
                                <div className="fdgfc-each access-points">
                                    <span>Choice Of Make</span>
                                    <Select options={facilityType} placeholder={"OAI Stack"}/>
                                </div>
                                <div className="fdgfc-each access-points">
                                    <Select options={facilityType} placeholder={"Advanced Settings"}/>
                                </div>
                            </div>
                            <div className="fdgfc-each access-points sub-points">
                                <div className="fdgfc-each access-points side-by-side form-head">
                                    <span>Number Of UEs</span>
                                    <input type="text" placeholder="30" />
                                </div>
                                <div className="fdgfc-each access-points ">
                                    <span>Distribution Of UEs</span>
                                    <Select options={facilityType} placeholder={"Random"}/>
                                </div>
                                <div className="fdgfc-each access-points">
                                    <span>Choice Of Make</span>
                                    <Select options={facilityType} placeholder={"OAI Stack"}/>
                                </div>
                                <div className="fdgfc-each access-points">
                                    <span>UE Traffic Pattern</span>
                                    <Select options={facilityType} placeholder={"Random"}/>
                                </div>
                                <div className="fdgfc-each access-points">
                                    <Select options={facilityType} placeholder={"Advanced Settings"}/>
                                </div>
                            </div>
                            <div className="fdgfc-each access-points sub-points">
                                <div className="fdgfc-each access-points form-head">
                                    <span>Core Network Settings</span>
                                </div>
                                <div className="fdgfc-each access-points">
                                    <span>Choice Of Make</span>
                                    <Select options={facilityType} placeholder={"Free5gc"}/>
                                </div>
                                <div className="fdgfc-each access-points">
                                    <Select options={facilityType} placeholder={"Advanced Settings"}/>
                                </div>
                            </div>
                        </div>
                        <div className="fgd-form-container">
                            <div className="fgd-form-submit">
                                    <span className="fdbfs-submit">Build the 5G network <br/> based on requirements</span>
                                    <span className="fdbfs-self" onClick={this.buildADemo}>
                                        Build a Demo network
                                        {
                                            callUnderProgress &&
                                            <div className="loading_icon_demo">
                                                <img src={loadingIcon} />
                                            </div>
                                        }
                                    </span>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default DeployNetwork;