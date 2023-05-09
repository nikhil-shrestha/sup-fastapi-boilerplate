import { Box, Container, Grid, Typography, Stack } from "@mui/material";
import React from "react";
import CustomButton from "../../components/CustomButton";
import { useHistory } from "react-router-dom";

import bg5g from "../../images/new_flow_images/bg_5g.svg";
import { useSelector } from "react-redux";

const Landing = () => {
  const navigate = useHistory();

  const authState = useSelector((state) => state.auth);

  return (
    <Container maxWidth={"xl"}>
      <Stack
        direction={"row"}
        spacing={4}
        sx={{
          height: "60vh",
          alignItems: "center",
          marginTop: "100px",
        }}
      >
        <Stack flex={1}>
          <Box
            sx={{
              marginBottom: "60px",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontFamily: "Poppins",
                fontWeight: "bold",
                fontSize: { xs: "30px", lg: "50px", xl: "50px" },
                lineHeight: { xs: "50px", lg: "69px", xl: "69px" },
                color: "#3D2F67",
              }}
            >
              5G,
              <br />
              Oh so simple as can be
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Poppins",
                fontWeight: "normal",
                fontSize: { xs: "22px", lg: "40px", xl: "40px" },
                lineHeight: { xs: "43px", lg: "64px", xl: "64px" },
                color: "#3D2F67",
              }}
            >
              Just follow these five steps,
              <br />
              You'll see
            </Typography>
          </Box>
          <CustomButton
            background={"#2B4FBE"}
            sx={{
              fontFamily: "Poppins",
              fontWeight: "bold",
              fontSize: { xs: "17px", lg: "20px", xl: "28px" },
              lineHeight: { xs: "16pxpx", lg: "28px", xl: "42px" },
              color: "#FFFFFF",
              maxWidth: { xs: "200px", lg: "340px", xl: "435px" },
              maxHeight: "91px",
              width: "100%",
            }}
            onClick={() => {
              if (authState.isAuthenticated) {
                navigate.push("/home");
              } else {
                navigate.push("/signup");
              }
            }}
          >
            GET STARTED
          </CustomButton>
        </Stack>

        <Box flex={1}>
          <img
            src={bg5g}
            alt="home"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default Landing;
