import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";

import AddIcon from "@material-ui/icons/Add";

import "./addDevice.scss";

const addDevice = () => {
  return (
    <Fragment>
      <div className="fgd-top-head">
        <Container maxWidth={"xl"}>
          <span>Core network : User management</span>
        </Container>
      </div>
      <Container maxWidth="md">
        <Box>
          <Box className="sub-header">
            <Typography variant="h3">Add a new device</Typography>
            {/* <Box sx={{ display: 'flex', gridGap: '14px', alignItems: 'center' }}>
                        <Typography variant='h4'>(or) Bulk upload</Typography>
                        <Button variant='outlined'><AddIcon /> Add files</Button>
                    </Box> */}
          </Box>

          <Box className="form-wrapper">
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Typography variant="h5">ID</Typography>
                <TextField
                  id="filled-basic"
                  variant="filled"
                  hiddenLabel
                  className="input-field"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  inputProps={{
                    style: {
                      background: "#F2F2F2 0% 0% no-repeat padding-box",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h5">IMSI</Typography>
                <TextField
                  id="filled-basic"
                  hiddenLabel
                  variant="filled"
                  className="input-field"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  inputProps={{
                    style: {
                      background: "#F2F2F2 0% 0% no-repeat padding-box",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h5">Authentication method</Typography>
                <TextField
                  id="filled-basic"
                  hiddenLabel
                  variant="filled"
                  className="input-field"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  inputProps={{
                    style: {
                      background: "#F2F2F2 0% 0% no-repeat padding-box",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h5">K</Typography>
                <TextField
                  id="filled-basic"
                  hiddenLabel
                  variant="filled"
                  className="input-field"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  inputProps={{
                    style: {
                      background: "#F2F2F2 0% 0% no-repeat padding-box",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h5">Operator code type</Typography>
                <TextField
                  id="filled-basic"
                  hiddenLabel
                  variant="filled"
                  className="input-field"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  inputProps={{
                    style: {
                      background: "#F2F2F2 0% 0% no-repeat padding-box",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h5">Operator code value</Typography>
                <TextField
                  id="filled-basic"
                  hiddenLabel
                  variant="filled"
                  className="input-field"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  inputProps={{
                    style: {
                      background: "#F2F2F2 0% 0% no-repeat padding-box",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider
                  style={{ border: "1px solid #F2F2F2", margin: "28px 0" }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Button variant="contained">Submit</Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
};

export default addDevice;
