import {
  Box,
  Dialog,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Container } from "@material-ui/core";
import { Fragment, default as React } from "react";
import { QrReader } from "react-qr-reader";
import { useHistory } from "react-router-dom";

import "./addAccessPoint.scss";
import CustomButton from "../../components/CustomButton";

import QRScan from "../../images/scan_QR_big.svg";

const AddAccessPoint = (props) => {
  const [open, setOpen] = React.useState(false);
  const [aPoint, setAPoint] = React.useState("");
  const router = useHistory();

  const [isEnterView, setIsEnterView] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const theme = useTheme();
  const mdScn = useMediaQuery(theme.breakpoints.down(1086));

  const handleNextStep = () => {
    router.push("/enter-AP");
  };
  return (
    <Fragment>
      <div className="fgd-top-head">
        <Container maxWidth="xl" style={{ padding: "0 37px" }}>
          <span>Get Access Point details</span>
        </Container>
      </div>
      <Container component={Box} mt={"70px"}>
        <Grid container spacing={2} className="add_access_point">
          <Grid item md={5} xs={12}>
            <img src={QRScan} alt="scan_QR_big" />
          </Grid>
          <Grid item md={7} xs={12}>
            <Paper className="paper" elevation={0}>
              <Box>
                <Box className="header" sx={{ p: "9px 0 7px 0" }}>
                  <Typography color="text" className="content">
                    Scan QR Code
                  </Typography>
                </Box>
                <Box
                  p={mdScn ? 1 : 2}
                  pb={mdScn ? 0 : 8}
                  sx={{
                    background: "#F5F6FF 0% 0% no-repeat padding-box",
                  }}
                >
                  <List>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography className="content black_font">
                            {" "}
                            <strong>
                              1. If you are using a device with a camera:
                            </strong>
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <List disablePadding>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box className="align_item">
                                <Typography className="sub_content black_font">
                                  Click the button below to open QR code scanner
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box className="align_item">
                                <Typography className="sub_content black_font">
                                  Point the camera to QR code located on the
                                  back of your 5-Fi access point
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      </List>
                    </ListItem>
                  </List>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    className="btnWrapper"
                  >
                    <CustomButton
                      onClick={handleClickOpen}
                      background={"#1F3BB3"}
                      sx={{
                        maxWidth: "553px",
                        width: "100%",
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        fontSize: "24px",
                        lineHeight: "35px",
                        fontStyle: "normal",
                      }}
                    >
                      Click to scan QR code
                    </CustomButton>

                    <QrScannerModal
                      {...props}
                      open={open}
                      setAPoint={setAPoint}
                      handleClose={handleClose}
                    />
                  </Box>
                </Box>
                <Box sx={{ marginTop: "43px" }}>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 600,
                      fontSize: "26px",
                      lineHeight: "39px",
                      fontStyle: "normal",
                      textAlign: "center",
                      "& > span": {
                        cursor: "pointer",
                        color: "#1F3BB3",
                      },
                    }}
                  >
                    Unable to scan QR code,{" "}
                    <span onClick={handleNextStep}>Click here</span>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

const QrScannerModal = (props) => {
  const { open, handleClose, setAPoint } = props;
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <Box pt={"10px"} textAlign={"center"} width={"300px"}>
        <Paper elevation={0}>
          <Typography className="content">Scan Qr</Typography>
          <QrReader
            constraints={{
              facingMode: "environment",
            }}
            onResult={(result, error) => {
              if (!!result) {
                setAPoint(result?.text);
                handleClose();
              }

              if (!!error) {
                console.info(error);
                // setTimeout(() => {
                //     notify.show("Invalid QR", "custom", props.toaster.duration, props.toaster.error);
                // }, 2000)
              }
            }}
            style={{ width: "100%" }}
          />
        </Paper>
      </Box>
    </Dialog>
  );
};
export default AddAccessPoint;
