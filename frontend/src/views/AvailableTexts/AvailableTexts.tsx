import Box from "@mui/material/Box";
import Header from "../../components/Header/Header";
import StyledTextField from "../../components/Textbox/StyledTextField";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { StyledCheckbox } from "../../components/Checkbox/Checkbox";
import { Icon, MenuItem, OutlinedInput } from "@mui/material";
import { useState } from "react";
import StyledMultiSelect from "../../components/MultiSelect/MultiSelect";
import IconButton from "@mui/material/IconButton";
import { motion } from "framer-motion";
import Pagination from "@mui/material/Pagination";
import StyledPagination from "../../components/Pagination/Pagination";

const AvailableTexts: React.FC = () => {
    return (
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
        >
            <Header />
            <motion.div
                key={"my_unique_key"}
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                transition={{ duration: 1 }}
            >
                <SearchBar />
                <StyledPagination count={10}></StyledPagination>
            </motion.div>
        </Box>
    );
}

const SearchBar: React.FC = () => {
    const difficulty = ["easy", "medium", "hard"];
    const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([difficulty[0]]);
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "20vh",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "50%",
                }}
            >
                <StyledTextField
                    sx={{
                        display: "flex",
                        width: "80%",
                    }}
                />
                <IconButton
                sx={{
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#FFFFFF",
                }}
                >
                <Box
                    sx={{
                    border: "none",
                    borderRadius: "5px",
                    background: "#E2B714",
                    padding: "15px 25px 15px 25px",
                    fontWeight: "bolder",
                    fontSize: '20px',
                    wordWrap: "break-word",
                    textAlign: "center",
                    }}
                >
                    <Box>Update</Box>
                </Box>
                </IconButton>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "70%",
                }}
            >
                <JetBrainsMonoText text={"Only unplayed"} size={16} color={"#D9D9D9"} />
                <StyledCheckbox />
                <JetBrainsMonoText text={"Fiction"} size={16} color={"#D9D9D9"} />
                <StyledCheckbox />
                <JetBrainsMonoText text={"Non-fiction"} size={16} color={"#D9D9D9"} />
                <StyledCheckbox />
                <JetBrainsMonoText text={"Difficulty"} size={16} color={"#D9D9D9"} />
                <StyledMultiSelect
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    input={<OutlinedInput label="Name" />}
                    value={selectedDifficulty}
                    >
                    {difficulty.map((diff) => (
                        <MenuItem
                            key={diff}
                            value={diff}
                            >
                            {diff}
                        </MenuItem>
                    ))}
                </StyledMultiSelect>
                {/* Sort by */}
                <JetBrainsMonoText text={"Sort by"} size={16} color={"#D9D9D9"} />
                <StyledMultiSelect
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    input={<OutlinedInput label="Name" />}
                    value={selectedDifficulty}
                    >
                    {difficulty.map((diff) => (
                        <MenuItem
                            key={diff}
                            value={diff}
                            >
                            {diff}
                        </MenuItem>
                    ))}
                </StyledMultiSelect>
                {/* Clear all filters */}
                {/* Update styling */}
            </Box>
        </Box>
    );
}

// TODO: Make a component for rendering the list of available texts
// Make use of Material UI pagination

const ItemBox: React.FC = () => {
    return (
        <Box
        sx={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: "-20vh",
            width: window.innerWidth > 600 ? "50%" : "100%",
            padding: "25px",
            backgroundColor: "white",
            }}
        >
            
        </Box>
    );
}

export default AvailableTexts;