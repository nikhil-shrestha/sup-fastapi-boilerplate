import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../../../../../components/CustomButton";
import Wrapper from "./components/Wrapper";
import suggested from "../../../../../images/images/suggested.svg";
import blueprint from "../../../../../images/images/blueprint_ap.png";

const Step2 = ({ setActiveStep, stepper: { noOfAccessPoint } }) => {
  return (
    <Wrapper icon={suggested} title="Suggested 5-Fi network layout">
      <Box>
        <Stack direction={"row"} gap={"34px"} alignItems={"center"}>
          <Box
            sx={{
              background: "#F2F2F2 0% 0% no-repeat padding-box",
              padding: "19px 25px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "1.1rem",
                lineHeight: "1.1rem",
                color: "#030303",
              }}
            >
              Number of Access points required is{" "}
              <strong>{noOfAccessPoint ?? ""}</strong>
            </Typography>
          </Box>
          <CustomButton
            background={"#1F3BB3"}
            onClick={() => setActiveStep(2)}
            sx={{ fontSize: "1rem" }}
          >
            Order Now
          </CustomButton>
        </Stack>

        <Box
          sx={{
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            border: "0.5px solid #B1AFAF",
            borderRadius: "5px",
            padding: "28px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "61px",
          }}
        >
          <img
            src={blueprint}
            height="616px"
            width="1070px"
            alt="blueprint"
            style={{ objectFit: "cover" }}
          />
        </Box>
      </Box>
    </Wrapper>
  );
};

export default Step2;
