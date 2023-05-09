import React from "react";
import { Button, styled } from "@mui/material";

const CustomBtn = styled(Button)({
  borderRadius: "10px",
  fontFamily: "Poppins",
  fontWeight: "normal",
  fontSize: "18px",
  lineHeight: "27px",
  height: "64px",
  minWidth: "180px",
  textTransform: "none",
});

const CustomButton = ({
  background,
  children,
  type = "contained",
  sx,
  onClick,
  fullWidth = false,
  disabled = false,
}) => {
  return (
    <CustomBtn
      sx={{ backgroundColor: { background }, ...sx }}
      variant={type}
      onClick={onClick}
      fullWidth={fullWidth}
      disabled={disabled}
      type="submit"
    >
      {children ?? ""}
    </CustomBtn>
  );
};

export default CustomButton;
