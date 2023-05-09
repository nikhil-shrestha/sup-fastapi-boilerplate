import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import CustomTable from "./components/CustomTable";

import AddIcon from "@material-ui/icons/Add";

import "./device.scss";
import { NavLink } from "react-router-dom";

const device = () => {
  const tableData = [
    {
      id: 1,
      imsi: "20866000000584500584588",
      type: "Camera",
      status: "Assigned",
    },
    {
      id: 2,
      imsi: "20866000000584580000584",
      type: "Actuator",
      status: "Assigned and Active",
    },
    {
      id: 3,
      imsi: "20866000000584580058458",
      type: "Camera",
      status: "Connected",
    },
    {
      id: 4,
      imsi: "20866000000584586600000",
      type: "Camera",
      status: "All",
    },
  ];
  return (
    <Fragment>
      <div className="fgd-top-head">
        <Container maxWidth={"xl"}>
          <span>Onboard devices</span>
        </Container>
      </div>
      <Container maxWidth="md">
        <Box className="table-container">
          <Typography variant="h3">List of SIM cards</Typography>
          <CustomTable tableData={tableData} />
        </Box>

        <Box className="btn-wrapper">
          <NavLink to="/device-add">
            <Button variant="contained" className="addBtn">
              <IconButton>
                <AddIcon />
              </IconButton>{" "}
              Add new device
            </Button>
          </NavLink>
        </Box>
      </Container>
    </Fragment>
  );
};

export default device;
