import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "@material-ui/core";

import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";

import "./addNewAccessPoint.scss";
import CustomButton from "../../components/common/Button/button";

const AddNewAccessPoint = () => {
  const [aPoint, setAPoint] = React.useState("");

  const router = useHistory();
  const handleNextStep = () => {
    router.push(`add-AP/?serial=${aPoint}`);
  };
  return (
    <Fragment>
      <div className="fgd-top-head">
        <Container maxWidth="xl" style={{ padding: "0 37px" }}>
          <span>Enter Access Point details</span>
        </Container>
      </div>
      <Container maxWidth={false}>
        <Grid
          container
          sx={{ mt: "120px" }}
          className="add_access_point"
          justifyContent={"center"}
        >
          <Grid item xs={12} md={7}>
            <Paper className="paper" elevation={0}>
              <Box>
                <Box className="header" p={1}>
                  <Typography className="content">
                    Enter the serial number
                  </Typography>
                </Box>
                <Box
                  px={8}
                  pb={8}
                  sx={{
                    background: "#F5F6FF 0% 0% no-repeat padding-box",
                  }}
                >
                  <List>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontWeight: 600,
                              fontSize: "26px",
                              lineHeight: "39px",
                              color: "#030303",
                              marginTop: "18px",
                            }}
                          >
                            {" "}
                            1. Check the backside of your 5-Fi access point for
                            a 7 digit serial number
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontWeight: 600,
                              fontSize: "26px",
                              lineHeight: "39px",
                              color: "#030303",
                            }}
                          >
                            {" "}
                            2. Enter the code
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>

                  <Grid container sx={{ mt: "20px" }} px={6}>
                    {/* <Grid item xs={3}>
                      <TextField
                        id="filled-basic"
                        InputProps={{
                          disableUnderline: true,
                          className: "form_textfield",
                        }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Box className="align_sign">-</Box>
                    </Grid> */}
                    <Grid item xs={7}>
                      <TextField
                        fullWidth
                        id="filled-basic"
                        InputProps={{
                          disableUnderline: true,
                          className: "form_textfield",
                        }}
                        inputProps={{
                          maxLength: 7,
                        }}
                        value={aPoint}
                        onChange={(e) => setAPoint(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Box display={"flex"} justifyContent={"center"} pt={7}>
                    {aPoint && (
                      <CustomButton
                        onClick={() => handleNextStep()}
                        buttonText="Continue"
                        size="large"
                        className="button"
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default AddNewAccessPoint;
