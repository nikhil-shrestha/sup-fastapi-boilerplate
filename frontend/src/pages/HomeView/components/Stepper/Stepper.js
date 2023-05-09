import Step from "@mui/material/Step";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import StepLabel from "@mui/material/StepLabel";
import CustomStepper from "@mui/material/Stepper";
import { styled } from "@mui/material/styles";

import Step1 from "./Steps/Step1";

import Step2 from "./Steps/Step2";

import Step3 from "./Steps/Step3";

import Step4 from "./Steps/Step4";

import tell_us from "../../../../images/images/tell_us.svg";
import suggested from "../../../../images/images/suggested.svg";
import shopping from "../../../../images/images/shopping.svg";
import add_5fi from "../../../../images/images/add_5fi.svg";

import { Box, Grid } from "@mui/material";
import * as React from "react";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#1F3BB3 !important",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#1F3BB3 !important",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#B9DCFD !important",
    borderTopStyle: "dashed !important",
    borderTopWidth: "2px !important",
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: (
      <img
        src={tell_us}
        alt="step1"
        style={
          active || completed
            ? { filter: "opacity(1)" }
            : { filter: "opacity(0.5)" }
        }
      />
    ),
    2: (
      <img
        src={suggested}
        alt="step2"
        style={
          active || completed
            ? { filter: "opacity(1)" }
            : { filter: "opacity(0.5)" }
        }
      />
    ),
    3: (
      <img
        src={shopping}
        alt="step3"
        style={
          active || completed
            ? { filter: "opacity(1)" }
            : { filter: "opacity(0.5)" }
        }
      />
    ),
    4: (
      <img
        src={add_5fi}
        alt="step4"
        style={
          active || completed
            ? { filter: "opacity(1)" }
            : { filter: "opacity(0.5)" }
        }
      />
    ),
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const Stepper = ({
  onFetchFacilityStart,
  onFetchApplicationsStart,
  onCreateAccountFacilitiesStart,
  onFetchProductsStart,
  stepper,
  onCreateOrderStart,
  oncreateAccountAccessPointStart,
}) => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const steps = [
    {
      content: (
        <Step1
          setActiveStep={setActiveStep}
          onFetchFacilityStart={onFetchFacilityStart}
          onFetchApplicationsStart={onFetchApplicationsStart}
          onCreateAccountFacilitiesStart={onCreateAccountFacilitiesStart}
          stepper={stepper}
        />
      ),
    },
    {
      content: <Step2 setActiveStep={setActiveStep} stepper={stepper} />,
    },
    {
      content: (
        <Step3
          setActiveStep={setActiveStep}
          onFetchProductsStart={onFetchProductsStart}
          onCreateOrderStart={onCreateOrderStart}
          oncreateAccountAccessPointStart={oncreateAccountAccessPointStart}
          stepper={stepper}
        />
      ),
    },
    {
      content: <Step4 stepper={stepper} />,
    },
  ];

  return (
    <React.Fragment>
      {/* {activeStep === steps.length ? (
        <div>
          <div>All steps completed - you&apos;re finished</div>
          <Button onClick={handleReset}>Reset</Button>
        </div>
      ) : ( */}
      <div>
        {steps[activeStep].content}
        <div
          style={{
            // paddingTop: "20px",
            paddingBottom: "90px",
            // marginLeft: "20px",
            // display: "flex",
          }}
        >
          {/* <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button> */}
          {/* <Box
              sx={{ display: "flex", alignItems: "center", gap: "11px" }}
              onClick={handleNext}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: "600",
                  fontSize: "16px",
                  lineHeight: "25px",
                  color: "#2A39A5",
                }}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Typography>
              <BsFillArrowRightCircleFill
                fontSize={"1.5rem"}
                color={"#263AAC"}
              />
            </Box> */}
        </div>
      </div>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          boxShadow: "3px 0px 6px #00000029",
          width: "100%",
          padding: "23px 0",
          zIndex: 3,
        }}
      >
        <Grid container>
          <Grid item xs={5}>
            <CustomStepper
              alternativeLabel
              activeStep={activeStep}
              connector={<ColorlibConnector />}
            >
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel StepIconComponent={ColorlibStepIcon} />
                </Step>
              ))}
            </CustomStepper>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default Stepper;
