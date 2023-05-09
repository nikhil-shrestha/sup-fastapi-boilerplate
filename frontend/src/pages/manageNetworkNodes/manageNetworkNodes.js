import React, { Component } from 'react';
import axios from 'axios';
import './manageNetworkNodes.scss';

import {
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    Select,
    MenuItem
} from "@material-ui/core";

import * as Icons from "@material-ui/icons";

import apiService from '../../services/apiService';

class MonitorNetworkNodes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            accessPoints: [],
            setupApStatus: false,
            selectedFrequency: ''
        }

        this.getAccessPointsToken = null;

    }

    componentDidMount(){
        this.getAccessPoints();
    }

    toggleSetUpAp = () => {
        this.setState({ setupApStatus: !this.state.setupApStatus });
    }

    handleChangeFrequency = (event) => {
        this.setState({selectedFrequency: event.target.value})
    }

    getAccessPoints = () => {

        var thisView = this;
        if (this.getAccessPointsToken)
            this.getAccessPointsToken.cancel();
        this.getAccessPointsToken = axios.CancelToken.source();

        axios.all([apiService.getAccessPoints(this.getAccessPointsToken.token)])
            .then(function (res) {
                if (res[0]) {
                    if(res[0]["status"] && res[0]["data"]){
                        thisView.setState({accessPoints: res[0]["data"]});
                    }
                }
            }).catch(function (res) {
                console.log(res);
                console.log('An error occurred add subscriber element service');

            });

    }


    render() {

        const { accessPoints, setupApStatus, selectedFrequency } = this.state;

        return (
            <div className="five-g-manage-network-nodes">
                <div className="fgmn-setup-ap-btn">
                    <span onClick={this.toggleSetUpAp}>Setup AP</span>
                </div>
                <table className="mnt-table">
                    <thead>
                        <tr>
                            <th >Availability</th>
                            <th >Cloud Connectivity</th>
                            <th >Site Name</th>
                            <th >Site Role</th>
                            <th >Device Model</th>
                            <th >Serial Number</th>
                            <th >Bandwidth Tier</th>
                            <th >Management IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            accessPoints && Object.keys(accessPoints).length > 0 &&
                            Object.keys(accessPoints).map((apKey, index) => {
                                return (
                                    <tr key={index}>
                                        <td><span className={accessPoints[apKey].Availability === "Green" ? "available" : ""}></span></td>
                                        <td>{accessPoints[apKey]["cloud connectivity"]}</td>
                                        <td>{accessPoints[apKey]["Site name"]}</td>
                                        <td>{accessPoints[apKey]["Site Role"]}</td>
                                        <td>{accessPoints[apKey]["Device Model"]}</td>
                                        <td>{accessPoints[apKey]["Serial number"]}</td>
                                        <td>{accessPoints[apKey]["Bandwidth Tier"]}</td>
                                        <td>{accessPoints[apKey]["Management IP"]}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                <Dialog open={setupApStatus} id="setup-ap-form">
                    <DialogTitle>
                        Setup AP
                        <Icons.Close fontSize={"small"} className="sap-close-icon" onClick={this.toggleSetUpAp} />
                    </DialogTitle>
                    <DialogContent>
                        <Grid className="sap-container" container spacing={2}>
                            <Grid item xs={12} className="fgd-form">
                                <div className="sap-each">
                                    <span>Gnb Make:</span>
                                    <div className="sape-input">
                                        <input type="text" placeholder=""></input>
                                    </div>
                                </div>
                                <div className="sap-each">
                                    <span>Gnb Serial Number:</span>
                                    <div className="sape-input">
                                        <input type="text" placeholder=""></input>
                                    </div>
                                </div>
                                <div className="sap-each">
                                    <span>NCI:</span>
                                    <div className="sape-input">
                                        <input type="text" placeholder=""></input>
                                    </div>
                                </div>
                                <div className="sap-each">
                                    <span>Enter IP address of AMF:</span>
                                    <div className="sape-ip">
                                        <input type="text" placeholder="255"></input>
                                        <span>.</span>
                                        <input type="text" placeholder="255"></input>
                                        <span>.</span>
                                        <input type="text" placeholder="255"></input>
                                        <span>.</span>
                                        <input type="text" placeholder="255"></input>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} className="fgd-form">
                                <div className="sap-each select-freq-type">
                                    <span>Frequency of operation:</span>
                                    <FormControl className={""}>
                                        <Select
                                            value={selectedFrequency}
                                            onChange={this.handleChangeFrequency}
                                            displayEmpty
                                            className={""}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="">Select Frequency</MenuItem>
                                            <MenuItem value={"cbrs"}>CBRS spectrum 3.5 GHz</MenuItem>
                                            <MenuItem value={"licensed"}>{"Licensed spectrum 2.1 GHz / >26 GHz"}</MenuItem>
                                            <MenuItem value={"us24"}>Unlicensed spectrum 2.4 GHz</MenuItem>
                                            <MenuItem value={"us6"}>Unlicensed spectrum 6 GHz</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.toggleSetUpAp} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        )
    }
}

export default MonitorNetworkNodes;