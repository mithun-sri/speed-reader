import Box from "@mui/material/Box";
import Header from "../../components/Header/Header";
import StyledTextField from "../../components/Textbox/StyledTextField";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { StyledCheckbox } from "../../components/Checkbox/Checkbox";
import { Icon, MenuItem, OutlinedInput } from "@mui/material";
import { useState } from "react";
import StyledMultiSelect from "../../components/MultiSelect/MultiSelect";
import IconButton from "@mui/material/IconButton";

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
            <SearchBar />
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
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: "-20vh",
            }}
        >
            <StyledTextField
                sx={{
                    width: "50%",
                }}
            />
            <JetBrainsMonoText text={"Only unplayed"} size={16} color={"white"} />
            <StyledCheckbox />
            <JetBrainsMonoText text={"Fiction"} size={16} color={"white"} />
            <StyledCheckbox />
            <JetBrainsMonoText text={"Non-fiction"} size={16} color={"white"} />
            <StyledCheckbox />
            <JetBrainsMonoText text={"Difficulty"} size={16} color={"white"} />
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
            <JetBrainsMonoText text={"Sort by"} size={16} color={"white"} />
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
            <IconButton
                sx={{
                    color: "white",
                    backgroundColor: "black",
                    "&:hover": {
                        backgroundColor: "black",
                    },
                }}
            >
                <Icon>clear</Icon>
            </IconButton>
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