import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Widget from "../../components/Widget";
import "./inspectManageNetwork.scss";
import axios from 'axios';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import loading_icon from '../../images/home/loading.gif';

import {
    Grid
} from "@material-ui/core";
import Box from '@mui/material/Box';
import moment from 'moment';

import Terminal from "terminal-in-react";
import pseudoFileSystem from "terminal-in-react-pseudo-file-system-plugin";
import NodeEvalPlugin from 'terminal-in-react-node-eval-plugin';

// import uuid from "uuid/v4";
import { v4 as uuidv4 } from 'uuid';

import dots_icon from '../../images/new_flow_images/dots.svg';
import apiService from '../../services/apiService.js';
import { getAccordionDetailsUtilityClass } from "@mui/material";

const FileSystemPlugin = pseudoFileSystem();

const logsData = [
    // { id: uuidv4(), content: "AMF" },
    // { id: uuidv4(), content: "SMF" },
    // { id: uuidv4(), content: "UPF1" },
    // { id: uuidv4(), content: "UPF2" },
    // { id: uuidv4(), content: "Device1" },
    // { id: uuidv4(), content: "Device2" },
    // { id: uuidv4(), content: "Device3" },
    // { id: uuidv4(), content: "Device4" },
    // { id: uuidv4(), content: "Device5" },
    // { id: uuidv4(), content: "Device6" }
]

const columnsFromBackend = {
    ["id1"]: {
        name: "Logs / Terminals / Packets",
        items: logsData
    },
    ["id2"]: {
        name: "tab section 1",
        items: []
    },
    ["id3"]: {
        name: "tab section 2",
        items: []
    },
    ["id4"]: {
        name: "tab section 3",
        items: []
    },
    ["id5"]: {
        name: "tab section 4",
        items: []
    }
};

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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

//create your forceUpdate hook
function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // An function that increment 👆🏻 the previous state like here 
    // is better than directly setting `value + 1`
}

function DragAndDrapComponent() {
    const [columns, setColumns] = useState(columnsFromBackend);
    const [callUnderProgress, setCallUnderProgress] = useState(false);
    const [logsToken, setLogsToken] = useState(null);
    const [inspectElementToken, setEnspectElementToken] = useState(null);
    const [inspectList, setInspectList] = useState([]);
    const [firstTabSectionValue, setFirstTabSectionChange] = useState(0); //{"tab0":0, "tab1": 0, "tab2": 0, "tab3": 0});
    const [logsData, setLogsData] = useState({});
    const [loadingList, setLoadingList] = useState({});

    useEffect(() => {
        getInspectList();
    }, []);

    const handleFirstSectionChange = (index, newValue) => {
        // console.log("newValue :", index, newValue);
        // let tabValues = firstTabSectionValue;
        // tabValues["tab"+index] = newValue;
        setFirstTabSectionChange(newValue);
    };

    const getInspectList = () => {

        if (inspectElementToken)
            inspectElementToken.cancel();
        let tokenData = axios.CancelToken.source();
        setEnspectElementToken(tokenData);

        setCallUnderProgress(true);
        axios.all([apiService.getInspectList(tokenData.token)])
            .then(function (res) {
                if (res[0]) {

                    let inspectList = (res[0]["data"] && res[0]["data"]) ? res[0]["data"] : [];
                    setInspectList(inspectList);
                    let columsData = columnsFromBackend;
                    columsData["id1"]["items"] = inspectList;
                    setColumns(columsData);
                    setCallUnderProgress(false);
                }
            }).catch(function (res) {
                console.log(res);
                console.log('An error occurred monitor service');
                setCallUnderProgress(false);
            });

    }

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
            console.log(result,);
            getData(result.draggableId, destination.droppableId);
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    const updateLoading = (item, status) => {
        console.log(item, status);
        let loadingListNew = loadingList;
        loadingListNew[item] = status;
        setLoadingList(loadingListNew);
    }

    const getData = (item, type) => {

        // if (logsToken)
        //     logsToken.cancel();
        // let logsTokenData = axios.CancelToken.source();
        // setLogsToken(logsTokenData);

        let dataType = "logs";
        if (type === "id3") {
            dataType = "packets";
        } else if (type === "id4") {
            dataType = "terminals";
            return;
        } else if (type === "id5") {
            dataType = "terminals";
            return;
        }
        setLoadingList({ ...loadingList, [item]: true });

        setCallUnderProgress(true);
        updateLoading(item, true);
        axios.all([apiService.getLogsData(item, dataType)])
            .then(function (res) {
                if (res[0]) {
                    let itemLogsData = (res[0]["data"] && res[0]["data"]) ? res[0]["data"] : [];
                    let logsDataNew = logsData;
                    logsDataNew[item] = itemLogsData
                    setLogsData(logsDataNew);
                    setLoadingList({ ...loadingList, [item]: false });
                }
            }).catch(function (res) {
                console.log(res);
                console.log('An error occurred monitor service');
                setCallUnderProgress(false);
                setLoadingList({ ...loadingList, [item]: false });
            });

    }

    const blockTitle = (index) => {
        switch (index) {
            case 1:
                return "Logs"
                break;
            case 2:
                return "Packets"
                break;
            case 3:
                return "Terminals"
                break;
            case 4:
                return "Terminals"
                break;
            default:
                break;
        }
    }

    const forceUpdate = useForceUpdate();

    return (

        <div className="five-g-inspect-container" style={{ display: "flex", justifyContent: "center", height: "100%" }}>
            <DragDropContext
                onDragEnd={result => onDragEnd(result, columns, setColumns)}
            >


                <Grid container spacing={2}>
                    <Grid item lg={3} md={3} xs={12}>

                        {
                            Object.entries(columns).map(([columnId, column], index) => {
                                // console.log("column : ", column);
                                return (
                                    column["name"] === "Logs / Terminals / Packets" &&
                                    (
                                        <Grid container spacing={2} className="inspect-left-sidebar-main" key={index}>
                                            <Grid item md={12} xs={12} className="fgm-inner-grid inspect-left-sidebar-section">
                                                <Widget
                                                    // title="Logs / Terminals / Packets"
                                                    upperTitle
                                                    bodyclassName={''}
                                                    className="test"
                                                    disableWidgetMenu={true}
                                                    fontBold={true}
                                                >
                                                    <div className="inspect-left-sidebar-block"
                                                        key={columnId}
                                                    >
                                                        <div className="inspect-left-bar-title">{column.name}</div>
                                                        <div className="droppable-main-section" style={{ margin: 8 }}>
                                                            <Droppable droppableId={columnId} key={columnId}>
                                                                {(provided, snapshot) => {
                                                                    return (
                                                                        <div
                                                                            {...provided.droppableProps}
                                                                            ref={provided.innerRef}
                                                                        >
                                                                            {column.items.map((item, index) => {
                                                                                return (
                                                                                    <Draggable
                                                                                        key={item.id}
                                                                                        draggableId={item.id}
                                                                                        index={index}
                                                                                    >
                                                                                        {(provided, snapshot) => {
                                                                                            return (
                                                                                                <div className="logs-list-section"
                                                                                                    ref={provided.innerRef}
                                                                                                    {...provided.draggableProps}
                                                                                                    {...provided.dragHandleProps}
                                                                                                    style={{
                                                                                                        backgroundColor: snapshot.isDragging
                                                                                                            ? "#263B4A"
                                                                                                            : "#F0F2FC",
                                                                                                        color: snapshot.isDragging
                                                                                                            ? "#fff"
                                                                                                            : "#2F2F2F",
                                                                                                        ...provided.draggableProps.style
                                                                                                    }}
                                                                                                >
                                                                                                    <span className="logs-list-name">{item.content}</span>
                                                                                                    <span className="logs-list-drag-icon"><img src={dots_icon} alt="dots_icon" className="dots_icon" /></span>
                                                                                                </div>
                                                                                            );
                                                                                        }}
                                                                                    </Draggable>
                                                                                );
                                                                            })}
                                                                            {provided.placeholder}
                                                                        </div>
                                                                    );
                                                                }}
                                                            </Droppable>
                                                        </div>
                                                    </div>
                                                </Widget>

                                            </Grid>
                                        </Grid>
                                    )

                                );
                            })}

                    </Grid>

                    <Grid item lg={9} md={9} xs={12} className="custom-right-grid-container">
                        {
                            Object.entries(columns).map(([columnId, column], blockIndex) => {
                                // console.log("column : ", column);
                                return (

                                    column["name"] !== "Logs / Terminals / Packets" &&
                                    <div className="custom-right-grid" key={blockIndex}>
                                        <Grid container spacing={2}>
                                            <Grid item lg={12} md={12} xs={12} className="fgm-inner-grid inspect-manage-right-container">
                                                <Widget
                                                    upperTitle
                                                    bodyclassName={''}
                                                    className=""
                                                    disableWidgetMenu={true}
                                                    fontBold={true}
                                                >

                                                    <div className="inspect-right-bar-section">
                                                        <div
                                                            key={columnId}
                                                        >
                                                            {/* <div className="inspect-left-bar-title">{column.name}</div> */}
                                                            <div className="inspect-manage-main-section">

                                                                <Box sx={{ width: '100%' }}>
                                                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                                        <Tabs value={firstTabSectionValue} onChange={handleFirstSectionChange} aria-label="inspect manage tabs">
                                                                            <Tab label={blockTitle(blockIndex)} {...a11yProps(0)} />
                                                                            {/* <Tab label="AMF Logs" {...a11yProps(1)} />
                                                                            <Tab label="UPF1 Logs" {...a11yProps(2)} /> */}
                                                                        </Tabs>
                                                                    </Box>
                                                                    {/* <TabPanel value={firstTabSectionValue} index={0}>
                                                                        SMF Logs
                                                                    </TabPanel>
                                                                    <TabPanel value={firstTabSectionValue} index={1}>
                                                                        AMF Logs
                                                                    </TabPanel>
                                                                    <TabPanel value={firstTabSectionValue} index={2}>
                                                                        UPF1 Logs
                                                                    </TabPanel> */}
                                                                </Box>

                                                                <Droppable droppableId={columnId} key={columnId}>
                                                                    {(provided, snapshot) => {
                                                                        return (
                                                                            <div
                                                                                {...provided.droppableProps}
                                                                                ref={provided.innerRef}
                                                                                className="each-tab-section"
                                                                            >
                                                                                {column.items.map((item, index) => {
                                                                                    return (
                                                                                        <Draggable
                                                                                            key={item.id}
                                                                                            draggableId={item.id}
                                                                                            index={index}
                                                                                        >
                                                                                            {(provided, snapshot) => {
                                                                                                return (
                                                                                                    <div
                                                                                                        ref={provided.innerRef}
                                                                                                        {...provided.draggableProps}
                                                                                                        {...provided.dragHandleProps}
                                                                                                        className="each-droppable-item"
                                                                                                        style={{
                                                                                                            backgroundColor: snapshot.isDragging
                                                                                                                ? "#263B4A"
                                                                                                                : "#F0F2FC",
                                                                                                            color: snapshot.isDragging ? "#FFF"
                                                                                                                : "#2F2F2F",
                                                                                                            ...provided.draggableProps.style
                                                                                                        }}
                                                                                                    >
                                                                                                        <span className="logs-list-name">{item.content}</span>
                                                                                                        <span className="logs-list-drag-icon"><img src={dots_icon} alt="dots_icon" className="dots_icon" /></span>
                                                                                                        <div className="lln-details">
                                                                                                            {
                                                                                                                loadingList[item.id] ?
                                                                                                                    <div className="llnd-loading">
                                                                                                                        <img src={loading_icon} />
                                                                                                                    </div> : (
                                                                                                                        blockIndex === 2 ? (
                                                                                                                            <div className="fdg-packets-container">
                                                                                                                                <div className="fdgpc-head">
                                                                                                                                    <div className="fdgpce-row">Number</div>
                                                                                                                                    <div className="fdgpce-row">Time</div>
                                                                                                                                    <div className="fdgpce-row">Source</div>
                                                                                                                                    <div className="fdgpce-row">Destination</div>
                                                                                                                                    <div className="fdgpce-row">Protocol</div>
                                                                                                                                    <div className="fdgpce-row">Details</div>
                                                                                                                                </div>
                                                                                                                                {
                                                                                                                                    logsData && logsData[item.id] && logsData[item.id].length > 0 &&
                                                                                                                                    logsData[item.id].map((eachPacket, index) => {
                                                                                                                                        return (
                                                                                                                                            <div key={index} className="fdgpc-each">

                                                                                                                                                <div className="fdgpce-row">{index + 1}</div>
                                                                                                                                                <div className="fdgpce-row">
                                                                                                                                                    {
                                                                                                                                                        eachPacket._source && eachPacket._source.layers && eachPacket._source.layers["frame.time"] && eachPacket._source.layers["frame.time"][0] &&
                                                                                                                                                            eachPacket._source.layers["frame.time"][0].includes("IST")
                                                                                                                                                            ?
                                                                                                                                                            moment(eachPacket._source.layers["frame.time"][0].split("IST")[0]).format('MM-DD-YYYY hh:mm:ss')
                                                                                                                                                            : moment(eachPacket._source.layers["frame.time"][0]).format('MM-DD-YYYY hh:mm:ss')
                                                                                                                                                    }
                                                                                                                                                </div>
                                                                                                                                                <div className="fdgpce-row">
                                                                                                                                                    {
                                                                                                                                                        eachPacket._source && eachPacket._source.layers && eachPacket._source.layers["ip.src"] &&
                                                                                                                                                        eachPacket._source.layers["ip.src"][0]
                                                                                                                                                    }
                                                                                                                                                </div>
                                                                                                                                                <div className="fdgpce-row">
                                                                                                                                                    {
                                                                                                                                                        eachPacket._source && eachPacket._source.layers && eachPacket._source.layers["ip.src"] &&
                                                                                                                                                        eachPacket._source.layers["ip.dst"][0]
                                                                                                                                                    }
                                                                                                                                                </div>
                                                                                                                                                <div className="fdgpce-row">
                                                                                                                                                    {
                                                                                                                                                        eachPacket._source && eachPacket._source.layers && eachPacket._source.layers["_ws.col.Protocol"] &&
                                                                                                                                                        eachPacket._source.layers["_ws.col.Protocol"][0]
                                                                                                                                                    }
                                                                                                                                                </div>
                                                                                                                                                <div className="fdgpce-row">
                                                                                                                                                    {
                                                                                                                                                        eachPacket._source && eachPacket._source.layers && eachPacket._source.layers["_ws.col.Info"] &&
                                                                                                                                                        eachPacket._source.layers["_ws.col.Info"][0]
                                                                                                                                                    }
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        )
                                                                                                                                    })
                                                                                                                                }

                                                                                                                            </div>
                                                                                                                        ) : (

                                                                                                                            (blockIndex === 3 || blockIndex === 4) ? (
                                                                                                                                <Terminal
                                                                                                                                    plugins={[FileSystemPlugin,
                                                                                                                                        {
                                                                                                                                            class: NodeEvalPlugin,
                                                                                                                                            config: { filesystem: FileSystemPlugin.displayName }
                                                                                                                                        }
                                                                                                                                    ]} />
                                                                                                                            ) : (
                                                                                                                                logsData && logsData[item.id] && logsData[item.id].length > 0 &&
                                                                                                                                logsData[item.id].map((eachLog, index) => {
                                                                                                                                    return (
                                                                                                                                        <span key={index}>{eachLog}</span>
                                                                                                                                    )
                                                                                                                                })
                                                                                                                            )


                                                                                                                        )

                                                                                                                    )

                                                                                                            }
                                                                                                        </div>
                                                                                                    </div>
                                                                                                );
                                                                                            }}
                                                                                        </Draggable>
                                                                                    );
                                                                                })}
                                                                                {provided.placeholder}
                                                                            </div>
                                                                        );
                                                                    }}
                                                                </Droppable>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </Widget>

                                            </Grid>
                                        </Grid>
                                    </div>
                                )

                            })}
                    </Grid>
                </Grid>

            </DragDropContext>
        </div>
    );
}

export default DragAndDrapComponent;
