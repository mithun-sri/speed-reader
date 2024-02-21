import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import DifficultyBox from "../Difficulty/DifficultyBox";

interface Data {
  id: number;
  text_id: string;
  text_title: string;
  mode: string;
  difficulty: string;
  avg: number;
  min: number;
  max: number;
  accuracy: number;
}

function createData(
  id: number,
  text_id: string,
  text_title: string,
  mode: string,
  difficulty: string,
  avg: number,
  min: number,
  max: number,
  accuracy: number,
): Data {
  return {
    id,
    text_id,
    text_title,
    mode,
    difficulty,
    avg,
    min,
    max,
    accuracy,
  };
}

const rows = [
  createData(
    1,
    "1",
    "From Homeless To Harvard",
    "standard",
    "easy",
    85,
    70,
    95,
    75,
  ),
  createData(2, "2", "Val Helsing", "standard", "med", 78, 65, 85, 82),
  createData(3, "3", "Gone With The Wind", "standard", "hard", 90, 80, 95, 68),
  createData(4, "4", "Val Helsing 2", "standard", "med", 78, 65, 85, 82),
  createData(5, "5", "Val Helsing 3", "standard", "med", 78, 65, 85, 82),
  createData(6, "6", "Val Helsing 4", "standard", "med", 78, 65, 85, 82),
  // Add more rows as needed
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "text_id", numeric: false, disablePadding: true, label: "text_id" },
  { id: "text_title", numeric: false, disablePadding: false, label: "title" },
  { id: "mode", numeric: false, disablePadding: false, label: "mode" },
  {
    id: "difficulty",
    numeric: false,
    disablePadding: false,
    label: "difficulty",
  },
  { id: "avg", numeric: true, disablePadding: false, label: "avg." },
  { id: "min", numeric: true, disablePadding: false, label: "min." },
  { id: "max", numeric: true, disablePadding: false, label: "max." },
  {
    id: "accuracy",
    numeric: true,
    disablePadding: false,
    label: "accuracy (%)",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow
        sx={{
          borderBottom: "1.85px solid #646669",
          backgroundColor: "transparent",
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all texts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            sx={{
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: "light",
              fontSize: "1vw",
            }}
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              sx={{ color: "#fff" }}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("avg");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  // const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setDense(event.target.checked);
  // };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ width: 1200, height: 500, margin: "3vw 0vw 20" }}>
      <Paper
        sx={{
          width: "100%",
          height: "100%",
          mb: 2,
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <TableContainer>
          <Table
            sx={{ minWidth: 800 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{
                      cursor: "pointer",
                      borderBottom: "1.85px solid #646669",
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="warning"
                        sx={{ marginRight: "2vw" }}
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      sx={{ color: "#fff" }}
                    >
                      {row.text_id}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {row.text_title}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {row.mode}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#fff",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      <DifficultyBox difficulty={row.difficulty} />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "#fff",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "1.2vw",
                      }}
                    >
                      {row.avg}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "#fff",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "1.2vw",
                      }}
                    >
                      {row.min}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "#fff",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "1.2vw",
                      }}
                    >
                      {row.max}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#fff",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "1.2vw",
                      }}
                    >
                      {row.accuracy}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{ color: "#fff" }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
