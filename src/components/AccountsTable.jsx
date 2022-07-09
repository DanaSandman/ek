import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";

const GET_ACCOUNTS = gql`
  query getAccounts($first: Int, $skip: Int) {
    accounts(first: $first, skip: $skip) {
      id
      positions {
        id
      }
    }
  }
`;

const _columns = [
  { id: "accountId", label: "Account\u00a0ID", minWidth: 170 },
  { id: "positions", label: "Positions", minWidth: 100 },
];

export function AccountsTable({ width }) {

  const [rows, setRows] = useState([]);
  const columns = _columns;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { loading, error, data, refetch } = useQuery(GET_ACCOUNTS, {
    variables: {
      first: 10,
      skip: 0,
    },
  });

  useEffect(() => {
    if (data) {
      setRows(rows.concat(organizeData(data)));
    }
  }, [data]);

  const organizeData = (data) => {
    const rows = [];
    data.accounts.map((acc) => {
      return rows.push({
        accountId: (
          <Link className="acc-id-link" to="/account" state={acc.id}>
            {acc.id}
          </Link>
        ),
        positions: acc.positions.length,
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
              {columns.map((column) => (
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
                      {columns.map((column) => {
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
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={100}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
