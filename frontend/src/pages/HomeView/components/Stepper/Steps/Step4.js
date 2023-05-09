import React from "react";

import {
  Box,
  Container,
  Dialog,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import scan_QR_big from "../../../../../images/images/scan_QR_big.svg";
import location from "../../../../../images/images/location.svg";
import connect from "../../../../../images/images/connect.svg";
import CustomButton from "../../../../../components/CustomButton";

import { baseURL } from "../../../../../config/axios.config";

import Loading from "../../../../../images/loading.gif";

import Slide from "@mui/material/Slide";
import moment from "moment";
import { Button } from "@material-ui/core";
import { NavLink, useHistory, useLocation } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Step4 = ({ stepper: { accountAccessPointLoader, qrCode, serial } }) => {
  const [scanQRModal, setScanQRModal] = React.useState(false);

  const router = useHistory();
  return (
    <Container maxWidth={false}>
      {accountAccessPointLoader && (
        <Box
          sx={{
            height: "70vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={Loading} alt="loading..." />
        </Box>
      )}
      {!accountAccessPointLoader && (
        <Box
          sx={{
            display: "flex",
            height: "80vh",
            justifyContent: "center",
            alignItems: "center",
            padding: "14px",
            paddingTop: "110px",
            paddingBottom: "50px",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              flex: 1,
              height: "100%",
              padding: "0 40px",
            }}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: { xs: "20px", md: "23px", lg: "58px" },
                lineHeight: { xs: "35px", md: "55px", lg: "65px" },
                color: "#14395E",
              }}
            >
              Your order is complete.
            </Typography>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: "normal",
                fontSize: { xs: "15px", md: "20px", lg: "30px" },
                lineHeight: { xs: "28px", md: "36px", lg: "46px" },
                marginTop: "21px",
                color: "#030303",
              }}
            >
              You will receive the order by{" "}
              {moment().add("days", 7).format("DD MMMM")}. Once
              <br /> you receive the order, follow these 3 steps to deploy the
              access point.
            </Typography>
          </Box>

          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{
              border: "1px solid #7070703b",
              margin: "0 60px",
            }}
          />

          <Stack
            sx={{ flex: 1, padding: "0 40px" }}
            gap={"78px"}
            height={"100%"}
          >
            <Box
              component={"li"}
              display={"flex"}
              gap={"35px"}
              alignItems={"center"}
            >
              <img
                src={scan_QR_big}
                height={"160px"}
                width={"136px"}
                alt="QR"
                style={{ flex: "20%" }}
              />
              <Box sx={{ flex: "80%" }}>
                <Box display={"flex"} alignItems={"center"} gap={"10px"}>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 600,
                      fontSize: { xs: "20px", md: "28px", lg: "40px" },
                      lineHeight: { xs: "30px", md: "40px", lg: "60px" },
                      letterSpacing: "0px",
                      color: "#030303",
                    }}
                  >
                    1.
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 600,
                      fontSize: { xs: "20px", md: "28px", lg: "40px" },
                      lineHeight: { xs: "30px", md: "40px", lg: "60px" },
                      letterSpacing: "0px",
                      color: "#030303",
                    }}
                  >
                    Scan QR Code on the AP
                  </Typography>
                </Box>

                <Box
                  width={"100%"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <CustomButton
                    onClick={() => setScanQRModal(true)}
                    background={"#1F3BB3"}
                    sx={{
                      maxWidth: "353px",
                      width: "100%",
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fontSize: "20px",
                      lineHeight: "25px",
                      fontStyle: "normal",
                      marginTop: "18px",
                      margin: "0 auto",
                    }}
                  >
                    Click to scan QR code
                  </CustomButton>
                </Box>
              </Box>
            </Box>

            <Box
              component={"li"}
              display={"flex"}
              gap={"35px"}
              alignItems={"center"}
            >
              <img
                src={location}
                height={"90px"}
                width={"80px"}
                alt="QR"
                style={{ flex: "20%" }}
              />
              <Box
                flex={"80%"}
                display={"flex"}
                alignItems={"flex-start"}
                gap={"10px"}
              >
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: { xs: "20px", md: "28px", lg: "40px" },
                    lineHeight: { xs: "30px", md: "40px", lg: "60px" },
                    letterSpacing: "0px",
                    color: "#030303",
                  }}
                >
                  2.
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: { xs: "20px", md: "28px", lg: "40px" },
                    lineHeight: { xs: "30px", md: "40px", lg: "60px" },
                    letterSpacing: "0px",
                    color: "#030303",
                  }}
                >
                  Place the AP at given location
                </Typography>
              </Box>
            </Box>
            <Box
              component={"li"}
              display={"flex"}
              gap={"35px"}
              alignItems={"center"}
            >
              <img
                src={connect}
                height={"80px"}
                width={"80px"}
                alt="QR"
                style={{ flex: "20%" }}
              />
              <Box
                flex={"80%"}
                display={"flex"}
                alignItems={"flex-start"}
                gap={"10px"}
              >
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: { xs: "20px", md: "28px", lg: "40px" },
                    lineHeight: { xs: "30px", md: "40px", lg: "60px" },
                    letterSpacing: "0px",
                    color: "#030303",
                  }}
                >
                  3.
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: { xs: "20px", md: "28px", lg: "40px" },
                    lineHeight: { xs: "30px", md: "40px", lg: "60px" },
                    letterSpacing: "0px",
                    color: "#030303",
                  }}
                >
                  Connect Power and Internet to the AP
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      )}

      <Dialog
        open={scanQRModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setScanQRModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <Box p={"10px"}>
          <Typography>
            Serial:
            <Typography
              onClick={() => {
                router.push(`add-AP/?serial=${serial}`);
              }}
              sx={{ cursor: "pointer" }}
              component={"span"}
            >
              {serial ?? "-"}
            </Typography>
          </Typography>
          <a href={`${baseURL}/${qrCode}`} target="_blank">
            <Button
              sx={{ paddingTop: "10px" }}
              variant="contained"
              color="primary"
            >
              Click here
            </Button>
          </a>
        </Box>

        <img src={`${baseURL}/${qrCode}`} alt="qrcode" />
      </Dialog>
    </Container>
  );
};

export default Step4;
