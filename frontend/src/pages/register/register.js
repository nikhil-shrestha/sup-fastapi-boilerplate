import { Box, Grid, Typography } from "@mui/material";
import { Container } from "@material-ui/core";
import React, { Fragment } from "react";

import { useHistory } from "react-router-dom";
import CustomButton from "../../components/CustomButton";

import Tellus from "../../images/tell_us.svg";

import "./register.scss";
import container from "./register.container";

const Register = ({ onSignupStart }) => {
  const navigate = useHistory();

  const [viewMore, setViewMore] = React.useState(false);

  const [values, setValues] = React.useState({
    name: "",
    company: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const handleRegister = () => {
    onSignupStart(
      {
        password: values?.password,
        email: values?.email,
        full_name: values?.name,
        company_name: values?.company,
        phone_number: "999999999",
      },
      navigate?.push("/home")
    );
  };

  return (
    <Box className="mainWrapper">
      <Container maxWidth={"xl"}>
        <Box
          sx={{
            marginTop: { xs: "30px", lg: "45px", xl: "65px" },
            padding: "0 37px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <img src={Tellus} alt="shake" />
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: { xs: "20px", lg: "28px", xl: "40px" },
                    lineHeight: { xs: "25px", lg: "40px", xl: "60px" },
                    fontWeight: 600,
                    color: "#2C2C6E",
                  }}
                >
                  Tell us about yourself
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ marginTop: "25px", marginLeft: "66px" }}>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: { xs: "16px", lg: "18px", xl: "28px" },
                  lineHeight: { xs: "20px", lg: "30px", xl: "40px" },
                  color: "#837F7F",
                  marginBottom: "15px",
                  "& > span": {
                    fontWeight: "bold",
                    color: "#1F3BB3",
                    cursor: "pointer",
                  },
                }}
              >
                Already a member, please{" "}
                <span onClick={() => navigate.push("/login")}>Sign In!</span>
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: { xs: "16px", lg: "18px", xl: "28px" },
                  lineHeight: { xs: "20px", lg: "30px", xl: "40px" },
                  marginBottom: "24px",
                  color: "#858282",
                }}
              >
                Don’t have an account, Fill out below details for Sign Up!
              </Typography>
            </Grid>

            <Grid container item xs={6} spacing={4} sx={{ marginLeft: "36px" }}>
              <Grid item xs={6}>
                <div className="form-group input_group">
                  <label>Name</label>
                  <br />
                  <input
                    type="text"
                    className="form-control"
                    required
                    name="name"
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                    tabIndex={"1"}
                    spellCheck={false}
                  />
                </div>
              </Grid>

              <Grid item xs={6}>
                {viewMore && (
                  <div className="form-group input_group">
                    <label>Email</label>
                    <br />

                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      required
                      onChange={(e) =>
                        setValues({ ...values, email: e.target.value })
                      }
                      tabIndex={"3"}
                      spellCheck={false}
                    />
                  </div>
                )}
              </Grid>

              <Grid item xs={6}>
                <div className="form-group input_group">
                  <label>Company</label>
                  <br />

                  <input
                    type="text"
                    className="form-control"
                    name="company"
                    required
                    onChange={(e) =>
                      setValues({ ...values, company: e.target.value })
                    }
                    tabIndex={"2"}
                    spellCheck={false}
                  />
                </div>
              </Grid>

              <Grid item xs={6}>
                {viewMore && (
                  <div className="form-group input_group">
                    <label>Password</label>
                    <br />

                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      required
                      tabIndex={"4"}
                      onChange={(e) =>
                        setValues({ ...values, password: e.target.value })
                      }
                      spellCheck={false}
                    />
                  </div>
                )}
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ marginLeft: "66px" }}>
              {!viewMore ? (
                <CustomButton
                  background={"#1F3BB3"}
                  sx={{ height: "51px", fontSize: "18px", marginTop: "10px" }}
                  onClick={() => setViewMore(true)}
                  disabled={values?.name === "" || values?.company === ""}
                >
                  Continue
                </CustomButton>
              ) : (
                <CustomButton
                  background={"#1F3BB3"}
                  sx={{ height: "51px", fontSize: "18px", marginTop: "10px" }}
                  onClick={() => handleRegister()}
                  disabled={
                    values?.name === "" ||
                    values?.password === "" ||
                    values?.company === "" ||
                    values?.email === ""
                  }
                >
                  SignUp
                </CustomButton>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default container(Register);
