import { faSquareArrowUpRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { StyledFormControl, StyledInputLabel, StyledSelect } from "../Button/DropDownMenu";

interface Row {
  id: number;
  text: string;
  mode: string;
  difficulty: string;
  average: number;
  accuracy: number;
  date: string;
  page: string;
}

const columns = [
  { id: "text", label: "text", type: "string" },
  { id: "mode", label: "mode", type: "string" },
  { id: "difficulty", label: "diff.", type: "string" },
  { id: "average", label: "avg.", type: "number" },
  { id: "accuracy", label: "acc (%)", type: "number" },
  { id: "date", label: "date", type: "string" },
  { id: "page", label: "page", type: "button" },
];

// Example data
const rows: Row[] = [
  {
    id: 1,
    text: "Sample Text",
    mode: "standard",
    difficulty: "easy",
    average: 255,
    accuracy: 80,
    date: "2024 Feb 08 10:30",
    page: "https://example.com",
  },
  {
    id: 2,
    text: "Another Text",
    mode: "adaptive",
    difficulty: "med",
    average: 155,
    accuracy: 75,
    date: "2024 Feb 09 14:45",
    page: "https://example.com",
  },
  {
    id: 3,
    text: "Yet Another Text",
    mode: "summarised",
    difficulty: "hard",
    average: 400,
    accuracy: 85,
    date: "2024 Feb 10 08:15",
    page: "https://example.com",
  },
  {
    id: 4,
    text: "Sample Text",
    mode: "standard",
    difficulty: "easy",
    average: 255,
    accuracy: 80,
    date: "2024 Feb 08 10:30",
    page: "https://example.com",
  },
  {
    id: 5,
    text: "Another Text",
    mode: "adaptive",
    difficulty: "med",
    average: 155,
    accuracy: 75,
    date: "2024 Feb 09 14:45",
    page: "https://example.com",
  },
  {
    id: 6,
    text: "Yet Another Text",
    mode: "summarised",
    difficulty: "hard",
    average: 400,
    accuracy: 85,
    date: "2024 Feb 10 08:15",
    page: "https://example.com",
  },
];

const StyledTableCell = styled(TableCell)({
  backgroundColor: "#323437",
  fontFamily: "JetBrains Mono, monospace",
  color: "white",
  fontSize: "20px",
  borderColor: "#646669",
});



function UserTable() {
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
    <Paper
      sx={{
        backgroundColor: "#323437",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "18px",
      }}
    >
      <StyledFormControl>
        <StyledInputLabel>Mode Filter</StyledInputLabel>
        <StyledSelect value={modeFilter} onChange={handleModeFilterChange}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="standard">Standard</MenuItem>
          <MenuItem value="adaptive">Adaptive</MenuItem>
          <MenuItem value="summarised">Summarised</MenuItem>
        </StyledSelect>
      </StyledFormControl>
      <StyledFormControl>
        <StyledInputLabel>Diff Filter</StyledInputLabel>
        <StyledSelect
          value={difficultyFilter}
          onChange={handleDifficultyFilterChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="med">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </StyledSelect>
      </StyledFormControl>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  sx={{
                    fontSize: 25,
                    fontWeight: 1000,
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
                      ) : (
                        // Ensure only valid column IDs are used for accessing properties of Row objects
                        row[column.id as keyof Row]
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
  );
}

const StyledTablePagination = styled(TablePagination)`
  display: flex;
  justify-content: flex-end; /* Align toolbar to the right */
  border-color: #646669;

  .MuiTablePagination-toolbar {
    background-color: #323437; /* Background color */
    color: white; /* Text color */
    font-family: "JetBrains Mono";
  }

  .MuiSelect-icon {
    color: white; /* Drop down Arrow color */
  }

  .MuiTablePagination-input,
  .MuiTablePagination-displayedRows {
    color: white; /* Text colour */
    font-family: "JetBrains Mono";
    font-size: 16px;
  }

  /* 'Rows per page' text */
  .MuiTablePagination-selectLabel {
    font-family: "JetBrains Mono";
    font-size: 16px;
  }
`;

export default UserTable;
