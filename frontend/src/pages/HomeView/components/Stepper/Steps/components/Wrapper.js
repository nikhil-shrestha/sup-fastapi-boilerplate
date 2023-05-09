import React from "react";

import { Grid, Stack, Typography, Box } from "@mui/material";
import { Container } from "@material-ui/core";

const Wrapper = ({ icon, title, children }) => {
  return (
    <Container maxWidth={'xl'}>
      <Box p={'0 37px'}>

        <Stack
          direction={"row"}
          spacing={2}
          margin={"20px 0"}
          alignItems={"center"}
        >
          <img src={icon} height="51px" width="50px" alt="tell_us" />
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: { xs: "18px", xl: "28px" },
                lineHeight: { xs: "25px", xl: "42px" },
                color: "#3D2F67",
              }}
            >
              {title ?? ""}
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ marginLeft: "66px" }}>{children}</Box>
      </Box>

    </Container>
  );
};

export default Wrapper;
