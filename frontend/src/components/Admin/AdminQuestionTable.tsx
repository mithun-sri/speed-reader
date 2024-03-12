import {
  faSquareArrowUpRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import * as React from "react";
import { Link } from "react-router-dom";
import { QuestionWithStatistics } from "../../api";
import { useSnack } from "../../context/SnackContext";
import { removeQuestion } from "../../hooks/admin";

interface Data {
  id: number;
  question_id: string;
  question: string;
  accuracy: number;
  statistics: string;
}

function transformQuestionsWithStatistics(
  questionsWithStatistics: QuestionWithStatistics[],
): Data[] {
  return questionsWithStatistics.map((question, index) => {
    return {
      id: index,
      question_id: question.id,
      question: question.content,
      accuracy: question.accuracy,
      statistics: `stat/${question.id}`,
    };
  });
}

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
  {
    id: "question_id",
    numeric: false,
    disablePadding: true,
    label: "question_id",
  },
  { id: "question", numeric: false, disablePadding: false, label: "question" },
  {
    id: "accuracy",
    numeric: true,
    disablePadding: false,
    label: "accuracy (%)",
  },
  {
    id: "statistics",
    numeric: false,
    disablePadding: false,
    label: "questions",
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
        <TableCell padding="checkbox" sx={{}}>
          <Checkbox
            sx={{
              color: "grey",
              "&.Mui-checked, &.MuiCheckbox-indeterminate": {
                color: "#E2B714",
              },
              "&:hover": {
                color: "#E2B714",
              },
            }}
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

interface AdminQuestionTableProps {
  text_id: string;
  data: QuestionWithStatistics[];
}

const AdminQuestionTable: React.FC<AdminQuestionTableProps> = ({
  text_id,
  data,
}) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("id");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [rows, setRows] = React.useState<Data[]>(
    transformQuestionsWithStatistics(data),
  );

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
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const checkboxClicked = event.target.type === "checkbox";
    if (!checkboxClicked) {
      return;
    }

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

  const isSelected = (id: number) => selected.indexOf(id) !== -1;
  const isCheckboxTicked = () => selected.length > 0;
  const hasAtLeastTenQuestions = () => rows.length > 10;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  const deleteQuestion = removeQuestion();
  const { showSnack } = useSnack();

  const handleDeleteQuestion = (question_id: string) => {
    deleteQuestion.mutate(
      { text_id, question_id },
      {
        onSuccess: () => {
          showSnack("Question deleted successfully");
        },
        onError: (error: Error) => {
          showSnack("Failed to delete question: " + error.message);
        },
      },
    );
  };

  return (
    <Box sx={{ width: "65vw" }}>
      <Paper
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <TableContainer>
          <Table aria-labelledby="tableTitle" size="medium">
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
                        sx={{
                          marginRight: "2vw",
                          color: "grey",
                          "&.Mui-checked": {
                            color: "#E2B714",
                          },
                          "&:hover": {
                            color: "grey",
                          },
                        }}
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
                      {row.question_id.length > 10
                        ? `${row.question_id.slice(0, 10)}...`
                        : row.question_id}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {row.question}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "#fff",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "1.2vw",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor:
                            row.accuracy < 50
                              ? "#BA1515"
                              : row.accuracy < 75
                                ? "#C7A113"
                                : "#4CAF50",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {row.accuracy}
                      </Box>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#fff",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "1.2vw",
                      }}
                    >
                      {
                        <IconButton
                          component={Link}
                          to={row.statistics}
                          sx={{
                            color: "#FFFFFF",
                            "& :hover": {
                              color: "#E2B714",
                            },
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faSquareArrowUpRight}
                            className="fa-table-page-icon"
                          />
                        </IconButton>
                      }
                    </TableCell>
                    {hasAtLeastTenQuestions() && (
                      <TableCell
                        align="center"
                        sx={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "1.2vw",
                          "&:hover": {
                            background: "#5B6066",
                          },
                        }}
                        onClick={() => {
                          handleDeleteQuestion(row.question_id);
                          setRows(rows.filter((prevRow) => prevRow !== row));
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          color="#BA1515"
                          className="fa-table-page-icon"
                        />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
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
      {isCheckboxTicked() && hasAtLeastTenQuestions() && (
        <Box mt={2} textAlign="right">
          <Button
            variant="contained"
            color="error"
            startIcon={<FontAwesomeIcon icon={faTrash} color="#FFFFFF" />}
            onClick={() => {
              selected.forEach((id) => {
                handleDeleteQuestion(rows[id].question_id);
              });
              setRows(rows.filter((_, index) => !selected.includes(index)));
              setSelected([]);
            }}
            sx={{
              color: "#fff",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "1.2vw",
              background: "#BA1515",
            }}
          >
            Delete All
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AdminQuestionTable;
