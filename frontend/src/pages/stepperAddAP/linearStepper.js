import {
  Box,
  CircularProgress,
  Collapse,
  FormLabel,
  Grid,
  Paper,
  TextField,
  Typography,
  LinearProgressProps,
  LinearProgress,
  withStyles,
  createStyles,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import axios from "axios";
import React from "react";
import { connect, useSelector } from "react-redux";
import CustomButton from "../../components/common/Button/button";
import apiServices from "../../services/apiService";
import "./stepperAddAP.scss";
import loadingGif from "../../images/home/loading.gif";
import tuningGif from "../../images/app/tuning.gif";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import Accordion from "./Accordion";
import { notify } from "react-notify-toast";
import layerImg from "../../images/images/bg.svg";

function LinearStepper(props) {
  return (
    <Box>
      <AddAccessPointForm {...props} />
    </Box>
  );
}
const AddAccessPointForm = ({ toaster, auth }) => {
  const [progress, setProgress] = React.useState(0);
  const [serialLoading, setSerialLoading] = React.useState(false);
  const [ranParamsLoading, setRanParamsLoading] = React.useState(false);
  const [deployLoading, setDeployLoading] = React.useState(false);
  const [deploySuccess, setDeploySuccess] = React.useState(false);

  const [tuningLoading, setTuningLoading] = React.useState(false);
  const [tuningSuccess, setTuningSuccess] = React.useState(false);

  const [serial, setSerial] = React.useState("");
  const [serialNo, setSerialNo] = React.useState("");
  const [ranParams, setRanParams] = React.useState(null);

  const history = useHistory();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  React.useEffect(() => {
    if (!isAuthenticated) {
      // navigate to login page
      history.push("/login", { from: history.location.pathname });
    }
  }, [isAuthenticated, history]);

  console.log("history", history);

  console.log("ranParamsss", ranParams);
  async function tuning() {
    try {
      setTuningLoading(true);
      const result = await axios.all([
        apiServices.deployAP({
          ...ranParams,
          id: serialNo,
        }),
      ]);
      if (result && !!result.length) {
        setDeploySuccess(true);

        await new Promise((resolve) => setTimeout(resolve, 5000));
        setTuningSuccess(true);
      } else {
        notify.show(
          result[0].data ?? "Something went wrong",
          "custom",
          toaster.duration,
          toaster.error
        );
      }
    } catch (error) {
      notify.show(
        "Something went wrong",
        "custom",
        toaster.duration,
        toaster.error
      );

      console.log(error);
      console.log("An error occurred add subscriber element service");
    }
    setTuningLoading(false);
  }

  async function validate_ap() {
    try {
      setSerialLoading(true);
      const result = await axios.all([
        apiServices.validateAP({
          id: history.location.pathname.includes("serial")
            ? history.location.pathname.split("?")[1].split("=")[1]
            : history.location.search.split("?")[1].split("=")[1],
        }),
      ]);
      if (result && !!result.length) {
        setSerial("serial:");
        setSerialNo(result[0]?.serial_id);
        getRanParameters(result);
      } else {
        notify.show(
          result[0]?.data ?? "Something went wrong",
          "custom",
          toaster.duration,
          toaster.error
        );
      }
    } catch (error) {
      notify.show(
        "Something went wrong",
        "custom",
        toaster.duration,
        toaster.error
      );

      console.log("An error occurred add subscriber element service");
    }
    setSerialLoading(false);
  }

  async function getRanParameters(result) {
    try {
      setRanParamsLoading(true);
      if (result && !!result.length) {
        console.log(result);
        setRanParams(result[0]);
      } else {
        notify.show(
          result[0]?.data ?? "Something went wrong",
          "custom",
          toaster.duration,
          toaster.error
        );
      }
    } catch (error) {
      notify.show(
        "Something went wrong",
        "custom",
        toaster.duration,
        toaster.error
      );

      console.log(error);
      console.log("An error occurred add subscriber element service");
    }
    setRanParamsLoading(false);
  }

  React.useEffect(() => {
    if (history) {
      validate_ap();
    }
  }, [history]);

  const handleRanParamsChange = (name, value) => {
    let newParams = ranParams;
    newParams[name] = value;
    setRanParams({
      ...newParams,
    });
  };
  return (
    <Grid container spacing={2} style={{ padding: "55px 37px 20px 37px" }}>
      <Box>
        <img
          src={layerImg}
          alt={"layer"}
          style={{
            position: "fixed",
            right: "0",
            bottom: "0",
          }}
        />
      </Box>

      <Grid item xs={12}>
        <Box display={"flex"} alignItems={"center"} gridGap={"20px"}>
          <CheckCircleIcon fontSize="large" style={{ fill: "#2C2C6E" }} />
          <Typography
            style={{ fontSize: "24px", fontWeight: 700 }}
            color="text"
            className="title"
          >
            Add 5-Fi Access point
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Accordion
          loading={serialLoading}
          valid={serialNo && !!serialNo.length}
          enableValidation
          title={"Found your 5-Fi Access point"}
        >
          <Box>
            <Grid container item xs={12} sm={6}>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  id="filled-basic"
                  InputProps={{
                    disableUnderline: true,
                    className: "form_textfield",
                  }}
                  value={serial}
                />
              </Grid>
              <Grid item xs={1}>
                <Box className="align_sign">-</Box>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  id="filled-basic"
                  InputProps={{
                    disableUnderline: true,
                    className: "form_textfield",
                  }}
                  value={serialNo}
                />
              </Grid>
            </Grid>
          </Box>
        </Accordion>
      </Grid>
      <Grid container item xs={12}>
        <Collapse in={!serialLoading && serialNo}>
          <Accordion
            loading={ranParamsLoading}
            valid={ranParams}
            enableValidation
            title={"Configuring your Access point automatically"}
          >
            <Box className="field">
              <Grid container spacing={2}>
                <Grid container alignItems="center" item xs={12}>
                  <Grid item xs={4} sm={3} md={2}>
                    <FormLabel>
                      <Typography className="content">NR_Band</Typography>
                    </FormLabel>
                  </Grid>

                  <Grid item xs={8} sm={9} md={10}>
                    <TextField
                      fullWidth
                      variant={"outlined"}
                      disabled={ranParamsLoading}
                      InputProps={{
                        disableUnderline: true,
                        className: "addAP_textfield",
                      }}
                      value={ranParams?.nr_band}
                      onChange={(e) => {
                        handleRanParamsChange("Band", e.target.value);
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container alignItems="center" item xs={12}>
                  <Grid item xs={4} sm={3} md={2}>
                    <FormLabel>
                      <Typography className="content">AMF_IP</Typography>
                    </FormLabel>
                  </Grid>

                  <Grid item xs={12} sm={8} md={10}>
                    <TextField
                      fullWidth
                      variant={"outlined"}
                      disabled={ranParamsLoading}
                      InputProps={{
                        disableUnderline: true,
                        className: "addAP_textfield",
                      }}
                      value={
                        ranParams?.name === "ORS17-NR"
                          ? "10.2.50.115"
                          : "192.168.0.202"
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container alignItems="center" item xs={12}>
                  <Grid item xs={4} sm={3} md={2}>
                    <FormLabel>
                      <Typography className="content">EPC/PLMN</Typography>
                    </FormLabel>
                  </Grid>

                  <Grid item xs={12} sm={8} md={10}>
                    <TextField
                      fullWidth
                      variant={"outlined"}
                      disabled={ranParamsLoading}
                      InputProps={{
                        disableUnderline: true,
                        className: "addAP_textfield",
                      }}
                      value={ranParams?.epc_plmn}
                    />
                  </Grid>
                </Grid>

                <Grid container alignItems="center" item xs={12}>
                  <Grid item xs={4} sm={3} md={2}>
                    <FormLabel>
                      <Typography className="content">TX Gain</Typography>
                    </FormLabel>
                  </Grid>

                  <Grid item xs={12} sm={8} md={10}>
                    <TextField
                      fullWidth
                      variant={"outlined"}
                      disabled={ranParamsLoading}
                      InputProps={{
                        disableUnderline: true,
                        className: "addAP_textfield",
                      }}
                      value={ranParams?.tx_gain}
                    />
                  </Grid>
                </Grid>

                <Grid container alignItems="center" item xs={12}>
                  <Grid item xs={4} sm={3} md={2}>
                    <FormLabel>
                      <Typography className="content">RX Gain</Typography>
                    </FormLabel>
                  </Grid>

                  <Grid item xs={12} sm={8} md={10}>
                    <TextField
                      fullWidth
                      variant={"outlined"}
                      disabled={ranParamsLoading}
                      InputProps={{
                        disableUnderline: true,
                        className: "addAP_textfield",
                      }}
                      value={ranParams?.rx_gain}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Accordion>
        </Collapse>

        <Grid item xs={12}>
          <Collapse
            in={!serialLoading && serialNo && ranParams && !deploySuccess}
          >
            <Box width={"30%"} m={"10px 0 20px 0"}>
              <CustomButton
                onClick={() => {
                  tuning();
                }}
                buttonText={
                  tuningLoading && deployLoading ? "Deploying" : "Deploy"
                }
                fullWidth
                disabled={tuningLoading && deployLoading}
              />
            </Box>
          </Collapse>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Collapse in={tuningLoading || deployLoading || tuningSuccess}>
          <Accordion
            initChecked={deploySuccess}
            valid={tuningSuccess && deploySuccess}
            loading={tuningLoading || deployLoading}
            enableValidation
            title={"Tuning Radio parameters for you"}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyItems={"center"}
              alignItems={"center"}
              margin={"0 auto"}
              width={"40%"}
            >
              <img className="tuning" src={tuningGif} alt={"loadng"} />
              {/* <Box width={'100%'}>

                <LinearProgressWithLabel value={12} />
              </Box> */}
            </Box>
          </Accordion>
        </Collapse>
      </Grid>
      <Grid item xs={12}>
        <Collapse in={deploySuccess && tuningSuccess}>
          <Accordion
            valid={deploySuccess && tuningSuccess}
            enableValidation
            title={"You are all set"}
          />
        </Collapse>
        <Grid item xs={12}>
          <Collapse in={deploySuccess && tuningSuccess}>
            <Box width={"15%"} m={"10px 0 20px 0"}>
              <NavLink to={"/monitor"}>
                <CustomButton buttonText={"Done"} fullWidth />
              </NavLink>
            </Box>
          </Collapse>
        </Grid>
      </Grid>
    </Grid>
  );
};
const BorderLinearProgress = withStyles((theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: "#1a90ff",
    },
  })
)(LinearProgress);

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const mapStateToProps = (state) => ({
  config: state.siteCoordinator.config,
  toaster: state.siteCoordinator.toaster,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LinearStepper);
