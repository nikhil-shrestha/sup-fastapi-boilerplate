import {
  Box,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect } from "react";
import CustomButton from "../../../../../components/CustomButton";
import Wrapper from "./components/Wrapper";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import search from "../../../../../images/images/search.svg";
import deleteSvg from "../../../../../images/images/delete.svg";
import mail from "../../../../../images/images/mail.svg";
import shopping from "../../../../../images/images/shopping.svg";
import customer from "../../../../../images/images/customer.svg";
import layerImg from "../../../../../images/images/bg.svg";

import { useSelector } from "react-redux";
import moment from "moment";
import { amountCommaSeparator } from "../../../../../utils/helper";
import { isArray } from "lodash";

const MainWrapper = styled("div")(({ theme }) => ({
  backgroundImage: { deleteSvg },
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
  backgroundPosition: "right bottom",
  height: "100vh",
  // [theme.breakpoints.down("md")]: {
  //   backgroundImage: "none",
  // },
}));

const StyledTableCell = styled(TableCell)(({ theme: any }) => ({
  border: "1px solid #DDDDE2",
  "& > MuiTableBody-root": {
    borderBottom: "3px solid #DDDDE2",
  },
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F4F4F5",
    color: "#020202",
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: "30px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontFamily: "Poppins",
    fontWeight: "normal",
    fontSize: 18,
    lineHeight: "30px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

const Step3 = ({
  setActiveStep,
  onFetchProductsStart,
  onCreateOrderStart,
  oncreateAccountAccessPointStart,
  stepper: { products, no_of_devices, no_of_access_points },
}) => {
  const { currentUser } = useSelector((state) => state.auth);
  console.log("currentUser", currentUser);

  const [total, setTotal] = React.useState(0);

  const [fetchedProducts, setFetchedProducts] = React.useState(null);

  useEffect(() => {
    onFetchProductsStart();
  }, []);

  useEffect(() => {
    if (products && isArray(products)) {
      const newP = products.map((el) => {
        return {
          ...el,
          totalPrice:
            el?.type === "sim_card"
              ? Number(el.price) * Number(no_of_devices)
              : Number(el.price) * Number(no_of_access_points),
        };
      });
      console.log("newP", newP);
      setFetchedProducts(newP);
    } else {
    }
  }, [products, no_of_devices, no_of_access_points]);

  useEffect(() => {
    const newTotal =
      fetchedProducts &&
      fetchedProducts?.length > 0 &&
      fetchedProducts?.reduce((accumulator, currentProduct) => {
        return accumulator + parseFloat(currentProduct.totalPrice);
      }, 0);
    setTotal(newTotal);
  }, [fetchedProducts]);

  const handleProductDelete = (id) => {
    setFetchedProducts((fetchedProducts) => {
      return fetchedProducts.filter((product) => product.id !== id);
    });
  };

  const handleStepperSubmit = () => {
    const items = products?.map((product) => ({
      product_id: product?.id,
      quantity: 1,
    }));

    const apId = products
      ?.filter((product) => product?.type === "access_point")
      .map((product) => product.id);

    onCreateOrderStart({
      status: true,
      items,
    });
    oncreateAccountAccessPointStart(
      {
        ap_id: apId[0],
      },
      setActiveStep(3)
    );
  };
  return (
    <MainWrapper>
      <Wrapper icon={shopping} title="Shopping Cart">
        <Box>
          <img
            src={layerImg}
            alt={"layer"}
            style={{
              position: "fixed",
              right: 0,
              bottom: 0,
              maxWidth: "600px",
            }}
          />
        </Box>
        <Grid container spacing={6}>
          <Grid item xs={8}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  lineHeight: "1.1rem",
                  color: "#14395E",
                }}
              >
                Order #237890
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: "normal",
                  fontSize: "1.1rem",
                  lineHeight: "1.1rem",
                  color: "#030303",
                }}
              >
                {moment().format("DD MMM")} {"at"} {moment().format("LT")}
              </Typography>
            </Box>

            <Divider sx={{ border: "2px solid #DDDDE2", margin: "21px 0" }} />

            <Stack direction={"row"} spacing={4}>
              <CustomButton
                background="#E97C61"
                sx={{ borderRadius: "20px", fontSize: "1rem" }}
              >
                Unpaid
              </CustomButton>
              <CustomButton
                background="#E8AB4D"
                sx={{ borderRadius: "20px", fonSize: "1rem" }}
              >
                Unfulfilled
              </CustomButton>
            </Stack>

            <Box m={"50px 0 34px 0"}>
              <Stack direction={"row"} spacing={4}>
                <TextField
                  placeholder="Search"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      paddingLeft: 0,
                      paddingRight: 0,
                      borderRadius: "20px",
                      fontFamily: "Poppins",
                      fontSize: "1rem",
                      lineHeight: "1rem",
                      fontWeight: "normal",
                      fontStyle: "normal",
                      color: "#CACACA",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        sx={{
                          padding: "30px",
                          backgroundColor: "#1F3BB3",
                          borderRadius: "20px",
                        }}
                        position="end"
                      >
                        <img src={search} alt="search" />
                      </InputAdornment>
                    ),
                  }}
                />

                <CustomButton
                  background="#1F3BB3"
                  sx={{ borderRadius: "20px", fontSize: "1rem" }}
                >
                  Browse catalog
                </CustomButton>
              </Stack>

              <Box mt="35px">
                <TableContainer component={Paper} style={{ maxHeight: 290 }}>
                  <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    stickyHeader
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Sr. No.</StyledTableCell>
                        <StyledTableCell>Product details</StyledTableCell>
                        <StyledTableCell>Quantity</StyledTableCell>
                        <StyledTableCell>Availability</StyledTableCell>
                        <StyledTableCell>Unit price</StyledTableCell>
                        <StyledTableCell>Price</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fetchedProducts && !!fetchedProducts.length ? (
                        fetchedProducts?.map((product, index) => (
                          <StyledTableRow key={product?.id}>
                            <StyledTableCell component="th" scope="row">
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {product?.desciprition}
                            </StyledTableCell>
                            <StyledTableCell>
                              {product?.type === "sim_card"
                                ? no_of_devices
                                : no_of_access_points}
                            </StyledTableCell>
                            <StyledTableCell>Immediate</StyledTableCell>
                            <StyledTableCell>${product?.price}</StyledTableCell>
                            <StyledTableCell>
                              $
                              {product?.price *
                                (product?.type === "sim_card"
                                  ? no_of_devices
                                  : no_of_access_points)}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <img
                                src={deleteSvg}
                                alt="del"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleProductDelete(product?.id)}
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableCell colSpan={6}>
                          Access point not available
                        </StyledTableCell>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>

            <Box mt={"30px"} paddingBottom={"120px"}>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  lineHeight: "35px",
                  color: "#14395E",
                  marginBottom: "20px",
                }}
              >
                Bill Details
              </Typography>

              <Stack direction={"row"} justifyContent={"space-between"}>
                <Box flex={1}>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "medium",
                        fontSize: "1rem",
                        lineHeight: "35px",
                        color: "#14395E",
                      }}
                    >
                      Sub total:
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "medium",
                        fontSize: "1rem",
                        lineHeight: "35px",
                        color: "#14395E",
                      }}
                    >
                      ${amountCommaSeparator(total) ?? ""}
                    </Typography>
                  </Stack>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "medium",
                        fontSize: "1rem",
                        lineHeight: "35px",
                        color: "#14395E",
                      }}
                    >
                      Shipping:
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "medium",
                        fontSize: "1rem",
                        lineHeight: "35px",
                        color: "#14395E",
                      }}
                    >
                      $40
                    </Typography>
                  </Stack>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    mt={"10px"}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "medium",
                        fontSize: "1rem",
                        lineHeight: "35px",
                        color: "#14395E",
                      }}
                    >
                      Taxes: <span style={{ color: "#8B8B8D" }}> GST 5%</span>
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "medium",
                        fontSize: "1rem",
                        lineHeight: "35px",
                        color: "#14395E",
                      }}
                    >
                      $
                      {amountCommaSeparator(
                        parseFloat((Number(total) + 40) * (5 / 100))
                      )}
                    </Typography>
                  </Stack>
                </Box>
                <Box flex={1} />
                <Stack flex={1} spacing={4}>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        lineHeight: "35px",
                        color: "#14395E",
                      }}
                    >
                      Total:{" "}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        lineHeight: "35px",
                        color: "#14395E",
                      }}
                    >
                      $
                      {amountCommaSeparator(
                        parseFloat(
                          Number(total) + 40 + (Number(total) + 40) * (5 / 100)
                        )
                      )}
                    </Typography>
                  </Stack>
                  <CustomButton
                    background="#1F3BB3"
                    onClick={() => handleStepperSubmit()}
                  >
                    Proceed to buy
                  </CustomButton>
                </Stack>
              </Stack>
            </Box>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{ display: "flex", width: "100%", justifyContent: "center" }}
          >
            <Box
              sx={{
                zIndex: 2,
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                width: "438px",
                maxHeight: "770px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  lineHeight: "35px",
                  color: "#14395E",
                }}
              >
                Customer details
              </Typography>
              <Box
                sx={{
                  background: "background: #FFFFFF 0% 0% no-repeat padding-box",
                  padding: "29px 37px",
                  marginTop: "24px",
                  maxWidth: "438px",
                  width: "100%",
                }}
              >
                <Box>
                  <Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <img src={customer} alt="customer" />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontWeight: "600",
                          fontSize: "1rem",
                          lineHeight: "35px",
                          color: "#14395E",
                        }}
                      >
                        {currentUser?.full_name ?? "John Doe"}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontWeight: "normal",
                          fontSize: "1rem",
                          lineHeight: "35px",
                          color: "#14395E",
                        }}
                      >
                        <strong>10</strong> previous orders
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider
                    sx={{ border: "2px solid #DDDDE2", margin: "20px 0" }}
                  />

                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <img src={mail} alt="mail" />
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        fontSize: "1rem",
                        lineHeight: "35px",
                        color: "#14395E",
                      }}
                    >
                      {currentUser?.email ?? "jhohndoe@gmail.com"}
                    </Typography>
                  </Stack>

                  <Divider
                    sx={{ border: "2px solid #DDDDE2", margin: "20px 0" }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        lineHeight: "46px",
                        color: "#030303",
                        paddingBottom: "10px",
                      }}
                    >
                      Shipping address
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "normal",
                        fontSize: "1rem",
                        lineHeight: "30px",
                        color: "#0C0C0C",
                      }}
                    >
                      {currentUser?.full_name ?? "John Doe"}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "normal",
                        fontSize: "1rem",
                        lineHeight: "30px",
                        color: "#0C0C0C",
                      }}
                    >
                      Cheyenne Korsgaard
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "normal",
                        fontSize: "1rem",
                        lineHeight: "30px",
                        color: "#0C0C0C",
                      }}
                    >
                      Santa Ana, Illinois
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "normal",
                        fontSize: "1rem",
                        lineHeight: "30px",
                        color: "#0C0C0C",
                      }}
                    >
                      85486
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "normal",
                        fontSize: "1rem",
                        lineHeight: "30px",
                        color: "#0C0C0C",
                      }}
                    >
                      The United States of America
                    </Typography>
                  </Box>

                  <Divider
                    sx={{ border: "2px solid #DDDDE2", margin: "20px 0" }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        lineHeight: "35px",
                        color: "#030303",
                        paddingBottom: "10px",
                      }}
                    >
                      Billing address
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "normal",
                        fontSize: "1rem",
                        lineHeight: "30px",
                        color: "#0C0C0C",
                      }}
                    >
                      {currentUser?.full_name ?? "John Doe"}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "normal",
                        fontSize: "1rem",
                        lineHeight: "30px",
                        color: "#0C0C0C",
                      }}
                    >
                      Cheyenne Korsgaard
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "normal",
                        fontSize: "1rem",
                        lineHeight: "30px",
                        color: "#0C0C0C",
                      }}
                    >
                      Santa Ana, Illinois
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "normal",
                        fontSize: "1rem",
                        lineHeight: "30px",
                        color: "#0C0C0C",
                      }}
                    >
                      85486
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "normal",
                        fontSize: "1rem",
                        lineHeight: "30px",
                        color: "#0C0C0C",
                      }}
                    >
                      The United States of America
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Wrapper>
    </MainWrapper>
  );
};

export default Step3;
