import React, { useState, useEffect } from "react";
import { formatUnits } from "@ethersproject/units";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useQuery, gql } from "@apollo/client";

const GET_MARKETS = gql`
  query getMarkets($acc: String) {
    positions(where: { account: $acc, isActive: false }) {
      market {
        id
        asset {
          name
          decimals
        }
      }
      borrowed
      deposited
      withdrawn
      repaid
    }
  }
`;

const COLUMNS = [
  { id: "marketId", label: "Market\u00a0ID", minWidth: 20 },
  { id: "assetName", label: "Asset\u00a0Name", minWidth: 20 },
  { id: "decimals", label: "Decimals", minWidth: 80 },
  { id: "deposited", label: "Deposited", minWidth: 80 },
  { id: "withdrawn", label: "Withdrawn", minWidth: 80 },
  { id: "borrowed", label: "Borrowed", minWidth: 80 },
  { id: "repaid", label: "Repaid", minWidth: 80 },
];

export function MarketsTable({ width, accId }) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { loading, error, data, refetch } = useQuery(GET_MARKETS, {
    variables: {
      acc: accId,
    },
  });

  useEffect(() => {
    if (data) {
      setRows(rows.concat(organizeData(data)));
    }
  }, [data]);

  const formatWei = (wei, decimal) => {
    return parseFloat(formatUnits(wei, decimal)).toFixed(4);
  };

  const organizeData = (data) => {
    const rows = [];
    data.positions.map((pos) => {
      return rows.push({
        marketId: pos.market.id,
        assetName: pos.market.asset.name,
        decimals: pos.market.asset.decimals,
        deposited: formatWei(pos.deposited, pos.market.asset.decimals),
        withdrawn: formatWei(pos.withdrawn, pos.market.asset.decimals),
        borrowed: formatWei(pos.borrowed, pos.market.asset.decimals),
        repaid: formatWei(pos.repaid, pos.market.asset.decimals),
      });
    });
    return rows;
  };

  const handleChangePage = (event, newPage) => {
    if (newPage * 10 >= rows.length) {
      refetch({ skip: newPage * 10 });
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
      <TablePagination
        rowsPerPageOptions={[10, 10]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
