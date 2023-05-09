import { Box, Container, styled, Typography } from "@mui/material";
import React, { Fragment } from "react";
import Stepper from "./components/Stepper/Stepper";
import container from "./HomeView.container";

const HomeBackground = styled("div")({
  // background: "#FAFAFC",
});

const HomeView = ({
  onFetchFacilityStart,
  onFetchApplicationsStart,
  onCreateAccountFacilitiesStart,
  stepper,
  onFetchProductsStart,
  onCreateOrderStart,
  oncreateAccountAccessPointStart,
}) => {
  return (
    <Fragment>
      <HomeBackground>
        <Stepper
          onFetchFacilityStart={onFetchFacilityStart}
          onFetchApplicationsStart={onFetchApplicationsStart}
          onCreateAccountFacilitiesStart={onCreateAccountFacilitiesStart}
          onFetchProductsStart={onFetchProductsStart}
          onCreateOrderStart={onCreateOrderStart}
          oncreateAccountAccessPointStart={oncreateAccountAccessPointStart}
          stepper={stepper}
        />
      </HomeBackground>
    </Fragment>
  );
};

export default container(HomeView);
