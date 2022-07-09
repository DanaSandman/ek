import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useQuery, gql } from "@apollo/client";

import icnos from "../assets/icons.js";

const GET_PROTOCOLS = gql`
  query getProtocols($acc: String) {
      positions(where: { account: $acc }) {
        protocol {
        name
      }
    }
  }
`;
const COLUMNS = [
  { id: "icon", label: "Protocols", minWidth: 50 },
  { id: "protocol", label: "", minWidth: 50 },
];

export function ProtocolsTable({ width, accId }) {

  const [rows, setRows] = useState([]);
  const { loading, error, data, refetch } = useQuery(GET_PROTOCOLS, {
    variables: {
      acc: accId,
    },
  });

  useEffect(() => {
    if (data) {
      setRows(rows.concat(organizeData(data)));
    }
  }, [data]);

  const organizeData = (data) => {
    const rows = [];
    data.positions.forEach((pos) => {
       if(!rows.find((row) => row.protocol === pos.protocol.name)){

         rows.push({
          protocol: pos.protocol.name,
          icon: <img src={icnos.find((icon) => icon.name === pos.protocol.name).icon}></img>
        });
        
      }
    });

    return rows;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Paper sx={{ width: { width }, overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 840 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "primery",
              }}
            >
              {COLUMNS.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows &&
              rows
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {COLUMNS.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
