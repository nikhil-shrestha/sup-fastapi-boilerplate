import React, { Component } from 'react';
import axios from 'axios';
import './addEdgeNode.scss';

import {
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    MenuItem
} from "@material-ui/core";

import Select from 'react-select';

import * as Icons from "@material-ui/icons";
import gnodeb from '../../images/app/gNodeB.svg';

import apiService from '../../services/apiService';

class AddEdgeNode extends Component {

    constructor(props) {
        super(props);

        this.state = {
            facilityType : [
                { value: 'warehouse', label: 'warehouse' },
                { value: 'factory', label: 'factory' },
                { value: 'facilty', label: 'facilty' }
            ],
            nrband: [
                { value: 'Band 1', label: 'Band 1' },
                { value: 'Band 3', label: 'Band 3' },
                { value: 'Band 7', label: 'Band 7' },
                { value: 'Band 41', label: 'Band 41' },
                { value: 'Band 78', label: 'Band 78' }
            ],
            selectedNrband: { value: 'Band 1', label: 'Band 1' },
            duplexMode: [
                { value: 'TDD', label: 'TDD' },
                { value: 'FDD', label: 'FDD' }
            ],
            selectedDuplexMode: { value: 'TDD', label: 'TDD' },
            bandwidth: [
                { value: '40', label: '40' },
                { value: '50', label: '50' },
                { value: '60', label: '60' },
                { value: '70', label: '70' },
                { value: '80', label: '80' },
                { value: '100', label: '100' }
            ],
            selectedBandwidth:  { value: '40', label: '40' },
            superCarrierSpacing: [
                { value: '15', label: '15' },
                { value: '30', label: '30' },
                { value: '60', label: '60' },
                { value: '120', label: '120' }
            ],
            selectedSuperCarrierSpacing: { value: '15', label: '15' },
            deployement: [
                { value: 'indoor', label: 'Indoor' },
                { value: 'outdoor', label: 'Outdoor' }
            ],
            selectedDeployement: { value: 'indoor', label: 'Indoor' },
            ranHardware: [
                { value: '8210', label: '8210' },
                { value: 'x310', label: 'x310' },
                { value: 'n300', label: 'N300' },
                { value: 'Amarisoft', label: 'Amarisoft' }
            ],
            selectedRanHardware: { value: '8210', label: '8210' },
            ciphering: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            selectedCiphering: { value: 'yes', label: 'Yes' },
            integrity: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            selectedInegrity: { value: 'yes', label: 'Yes' },
            mimoUpto: [
                { value: '2x2', label: '2X2' },
                { value: '4x4', label: '4X4' }
            ],
            selectedMimoUpto: { value: '2x2', label: '2X2' },
            carrierAggregation: [
                { value: 'enable', label: 'Enable' },
                { value: 'disable', label: 'Disable' }
            ],
            selectedCarrierAggregation: { value: 'enable', label: 'Enable' }
        }

        this.getAccessPointsToken = null;

    }

    componentDidMount(){
    }

    render() {

        const { nrband, superCarrierSpacing, duplexMode, bandwidth, deployement, 
                    ranHardware, mimoUpto, carrierAggregation, ciphering, integrity } = this.state;
        const { selectedNrband, selectedDuplexMode, selectedSuperCarrierSpacing, selectedBandwidth, selectedDeployement,
                    selectedRanHardware, selectedMimoUpto, selectedCarrierAggregation, selectedCiphering, selectedInegrity  } = this.state;

        return (
            <div className="five-g-manage-edge-nodes">
                <Grid container spacing={4}>
                    <Grid item lg={4} xs={12} className="fgm-inner-grid-left">
                        <Grid container spacing={4} className="fgm-inner-grid-li" >
                            <Grid item md={6} xs={12} className="fgm-inner-grid-inner">
                                <img src={gnodeb} className="fgmigr-img" />
                                <span className='fgmigr-span'>gNodeB</span>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item lg={8} xs={12} className="fgm-inner-grid-right">
                        <Grid container spacing={4} className="each-form-sub">
                            <span className='fen-form-head'>General</span>
                            <Grid item md={6} xs={12} className="fgm-inner-grid">
                                <div className="fdmen-each">
                                    <span>NR Band</span>
                                    <Select options={nrband} className="selections" value={selectedNrband} />
                                </div>
                                <div className="fdmen-each">
                                    <span>Operating Frequency</span>
                                    <input type="text" placeholder="6400008 (n78)" />
                                </div>
                                <div className="fdmen-each">
                                    <span>Subcarrier Spacing (kHZ)</span>
                                    <Select options={superCarrierSpacing} className="selections" value={selectedSuperCarrierSpacing} />
                                </div>
                            </Grid>
                            <Grid item md={6} xs={12} className="fgm-inner-grid">
                                <div className="fdmen-each">
                                    <span>Duplex Mode</span>
                                    <Select options={duplexMode} className="selections" value={selectedDuplexMode} />
                                </div>
                                <div className="fdmen-each">
                                    <span>Bandwidth (MHz)</span>
                                    <Select options={bandwidth} className="selections" value={selectedBandwidth} />
                                </div>
                                <div className="fdmen-each">
                                    <span>Deployment</span>
                                    <Select options={deployement} className="selections" value={selectedDeployement} />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} className="each-form-sub">
                            <span className='fen-form-head'>Gains (dB) (Based on RSRP and RSSI)</span>
                            <Grid item md={6} xs={12} className="fgm-inner-grid">
                                <div className="fdmen-each">
                                    <span>Gains (dB) (Based on RSRP and RSSI)</span>
                                    <input type="text" placeholder="10" />
                                </div>
                                <div className="fdmen-each">
                                    <span>Transmitter Attenuation</span>
                                    <input type="text" placeholder="10" />
                                </div>
                            </Grid>
                            <Grid item md={6} xs={12} className="fgm-inner-grid">
                                <div className="fdmen-each">
                                    <span>Target SNR</span>
                                    <input type="text" placeholder="20" />
                                </div>
                                <div className="fdmen-each">
                                    <span>Receiver Gain</span>
                                    <input type="text" placeholder="114" />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} className="each-form-sub">
                            <span className='fen-form-head'>Advanced Parameters</span>
                            <Grid item md={6} xs={12} className="fgm-inner-grid">
                                <div className="fdmen-each">
                                    <span>RAN Hardware</span>
                                    <Select options={ranHardware} className="selections" value={selectedRanHardware} />
                                </div>
                                <div className="fdmen-each">
                                    <span>MIMO (up to)</span>
                                    <Select options={mimoUpto} className="selections" value={selectedMimoUpto} />
                                </div>
                                <div className="fdmen-each">
                                    <span>Carrier Aggregation</span>
                                    <Select options={carrierAggregation} className="selections" value={selectedCarrierAggregation} />
                                </div>
                            </Grid>
                            <Grid item md={6} xs={12} className="fgm-inner-grid">
                                <div className="fdmen-each">
                                    <span>Ciphering</span>
                                    <Select options={ciphering} className="selections" value={selectedCiphering} />
                                </div>
                                <div className="fdmen-each">
                                    <span>Integrity</span>
                                    <Select options={integrity} className="selections" value={selectedInegrity} />
                                </div>
                            </Grid>
                        </Grid>

                        <Grid container spacing={4} className="each-form-sub-submit">
                            <span className='submit-bt-e-node'>Add</span>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default AddEdgeNode;