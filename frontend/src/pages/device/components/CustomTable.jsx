import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "#F4F4F5 0% 0% no-repeat padding-box",
    color: "#111111",
    fontStyle: "normal",
    fontSize: "13px",
    lineHeight: "24px",
    fontFamily: "Poppins, sans-serif",
    fontWeight: "bold",
    border: "1px solid #E2E3E3",
  },
  [`&.${tableCellClasses.body}`]: {
    color: "#030303",
    fontStyle: "normal",
    fontSize: "16px",
    lineHeight: "25px",
    fontFamily: "Poppins, sans-serif",
    border: "1px solid #E2E3E3",
    background: "#FCFCFC 0% 0% no-repeat padding-box",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

export default function CustomTable({ tableData }) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 700 }} aria-label="customized table" size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>IMSI</StyledTableCell>
            <StyledTableCell>Assign Devices type/Network slice</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((data) => (
            <StyledTableRow key={data.id}>
              <StyledTableCell component="th" scope="row">
                {data.imsi}
              </StyledTableCell>
              <StyledTableCell>{data.type}</StyledTableCell>
              <StyledTableCell>{data.status}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
