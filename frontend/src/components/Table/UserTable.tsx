import {
  Button,
  FormControl,
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
  { id: "text", label: "Text", type: "string" },
  { id: "mode", label: "Mode", type: "string" },
  { id: "difficulty", label: "Difficulty", type: "string" },
  { id: "average", label: "Average", type: "number" },
  { id: "accuracy", label: "Accuracy", type: "number" },
  { id: "date", label: "Date", type: "string" },
  { id: "page", label: "Page", type: "button" },
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
    date: "2024-02-08 10:30",
    page: "https://example.com",
  },
  {
    id: 2,
    text: "Another Text",
    mode: "adaptive",
    difficulty: "med",
    average: 155,
    accuracy: 75,
    date: "2024-02-09 14:45",
    page: "https://example.com",
  },
  {
    id: 3,
    text: "Yet Another Text",
    mode: "summarised",
    difficulty: "hard",
    average: 400,
    accuracy: 85,
    date: "2024-02-10 08:15",
    page: "https://example.com",
  },
];

const StyledTableCell = styled(TableCell)({
  backgroundColor: "#323437",
  fontFamily: "JetBrains Mono, monospace",
  color: "white",
  fontSize: "18px",
});

const StyledFormControl = styled(FormControl)({
  margin: "10px",
  width: "200px",
});

const StyledSelect = styled(Select<string>)({
  backgroundColor: "#323437",
  color: "white",
  "&:focus": {
    backgroundColor: "#323437",
  },
});

const StyledInputLabel = styled(InputLabel)({
  fontFamily: "JetBrains Mono, monospace",
  color: "white",
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
        color: "white",
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
        <StyledInputLabel>Difficulty Filter</StyledInputLabel>
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
                <StyledTableCell key={column.id}>
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
                        <Button href={row.page}>Link</Button>
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          fontFamily: "JetBrains Mono, monospace",
          color: "white",
          fontSize: "18px",
        }}
      />
    </Paper>
  );
}

export default UserTable;
