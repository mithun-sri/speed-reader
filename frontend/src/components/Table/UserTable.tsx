import { faSquareArrowUpRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  IconButton,
  MenuItem,
  Paper,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  StyledFormControl,
  StyledInputLabel,
  StyledSelect,
  StyledTablePagination,
} from "../Button/DropDownMenu";
import { HistoryWithText } from "../../api";
import DifficultyBox from "../Difficulty/DifficultyBox";

interface Row {
  id: number;
  text_id: string;
  mode: string;
  difficulty: string;
  average: number;
  accuracy: number;
  page: string;
}

function convertHistoryToRows(histories: HistoryWithText[]): Row[] {
  return histories.map((history, index) => ({
    id: index + 1,
    date: new Date(history.date).toLocaleDateString(),
    text_title: history.text_title,
    text_id: history.text_id,
    mode: history.game_mode,
    difficulty: history.difficulty,
    average: history.average_wpm,
    accuracy: history.score,
    page: `history/${history.id}`,
  }));
}

const columns = [
  { id: "date", label: "date", type: "string" },
  { id: "text_title", label: "text", type: "string" },
  { id: "mode", label: "mode", type: "string" },
  { id: "difficulty", label: "diff.", type: "string" },
  { id: "average", label: "avg.", type: "number" },
  { id: "accuracy", label: "acc (%)", type: "number" },
  { id: "page", label: "page", type: "button" },
];

const StyledTableCell = styled(TableCell)({
  backgroundColor: "transparent",
  fontFamily: "JetBrains Mono, monospace",
  color: "white",
  // fontSize: "20px",
  borderColor: "#646669",
});

interface UserTableProps {
  results: Array<HistoryWithText>;
}

const UserTable: React.FC<UserTableProps> = ({ results }) => {
  const rows = convertHistoryToRows(results);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modeFilter, setModeFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleModeFilterChange = (event: SelectChangeEvent<string>) => {
    setModeFilter(event.target.value as string);
  };

  const handleDifficultyFilterChange = (event: SelectChangeEvent<string>) => {
    setDifficultyFilter(event.target.value as string);
  };

  const handleSort = (columnId: string) => {
    if (columnId === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (sortColumn !== "") {
      const validColumnIds: (keyof Row)[] = columns.map(
        (col) => col.id as keyof Row,
      );
      if (validColumnIds.includes(sortColumn as keyof Row)) {
        if (a[sortColumn as keyof Row] < b[sortColumn as keyof Row])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn as keyof Row] > b[sortColumn as keyof Row])
          return sortDirection === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredRows = sortedRows.filter((row) => {
    return (
      (!modeFilter || row.mode === modeFilter) &&
      (!difficultyFilter || row.difficulty === difficultyFilter)
    );
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {rows.length === 0 ? (
        <Box
          sx={{
            fontFamily: "JetBrains Mono, monospace",
            color: "#fff",
            fontSize: "3vh",
            margin: "9vh 27vw",
          }}
        >
          No History Available.
        </Box>
      ) : (
        <Paper
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            fontSize: "18px",
            width: "70vw",
          }}
        >
          <StyledFormControl>
            <StyledInputLabel>Mode</StyledInputLabel>
            <StyledSelect value={modeFilter} onChange={handleModeFilterChange}>
              <MenuItem
                value=""
                sx={{
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                All
              </MenuItem>
              <MenuItem
                value="standard"
                sx={{
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                Standard
              </MenuItem>
              <MenuItem
                value="adaptive"
                sx={{
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                Adaptive
              </MenuItem>
              <MenuItem
                value="summarised"
                sx={{
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                Summarised
              </MenuItem>
            </StyledSelect>
          </StyledFormControl>
          <StyledFormControl>
            <StyledInputLabel>Difficulty</StyledInputLabel>
            <StyledSelect
              value={difficultyFilter}
              onChange={handleDifficultyFilterChange}
            >
              <MenuItem
                value=""
                sx={{
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                All
              </MenuItem>
              <MenuItem
                value="easy"
                sx={{
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                Easy
              </MenuItem>
              <MenuItem
                value="medium"
                sx={{
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                Medium
              </MenuItem>
              <MenuItem
                value="hard"
                sx={{
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                Hard
              </MenuItem>
            </StyledSelect>
          </StyledFormControl>
          <TableContainer>
            <Table aria-labelledby="tableTitle" size="medium">
              <TableHead
                sx={{
                  color: "#cba412",
                }}
              >
                <TableRow>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      sx={{
                        fontSize: "1.3vw",
                        fontWeight: "bolder",
                        color: "#cba412",
                      }}
                    >
                      {column.type === "button" ? (
                        column.label
                      ) : (
                        <TableSortLabel
                          active={sortColumn === column.id}
                          direction={
                            sortColumn === column.id ? sortDirection : "asc"
                          }
                          sx={{
                            color: "#cba412",
                            "&.Mui-active": {
                              color: "#E2B714",
                            },
                            "&.MuiTableSortLabel-root": {
                              color: "#E2B714",
                              "&:hover": {
                                color: "#E2B714",
                              },
                            },
                            "& .MuiTableSortLabel-icon": {
                              color: "#E2B714 !important",
                            },
                          }}
                          onClick={() => handleSort(column.id)}
                        >
                          {column.label}
                        </TableSortLabel>
                      )}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      {columns.map((column) => (
                        <StyledTableCell key={column.id}>
                          {column.type === "button" ? (
                            <IconButton
                              component={Link}
                              to={row.page}
                              target="_blank"
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
                          ) : // Ensure only valid column IDs are used for accessing properties of Row objects
                          column.id !== "difficulty" ? (
                            row[column.id as keyof Row]
                          ) : (
                            <DifficultyBox difficulty={row.difficulty} />
                          )}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <StyledTablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

export default UserTable;
