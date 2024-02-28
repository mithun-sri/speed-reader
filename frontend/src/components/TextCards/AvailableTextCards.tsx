import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useState } from 'react';
import JetBrainsMonoText from "../Text/TextComponent";
import { StyledCheckbox } from '../Checkbox/Checkbox';
import { MenuItem, OutlinedInput } from '@mui/material';
import StyledMultiSelect from '../MultiSelect/MultiSelect';
import IconButton from '@mui/material/IconButton';
import StyledTextField from '../Textbox/StyledTextField';
import DifficultyBox from '../Difficulty/DifficultyBox';

interface TextProps {
    title: string;
    description: string;
    difficulty: string;
    image?: string;
    author?: string;
}

export const SearchBar: React.FC = () => {
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
                    placeholder="Search for a text..."
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
                    <Box>Update Filters</Box>
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

export const ItemBoxHovered: React.FC<TextProps> = (
    {
        title,
        description,
        difficulty,
        image,
        author
    }
) => {
    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
        }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "20px",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Box
                    component={"img"}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "15%"
                    }}
                    src={image}
                />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "85%",
                        padding: "20px",
                    }}
                >
                    <JetBrainsMonoText text={title} size={24} color={"#D9D9D9"} />
                    <JetBrainsMonoText text={"By " + author} size={16} color={"#D9D9D9"} />
                    <JetBrainsMonoText text={description} size={16} color={"#D9D9D9"} />
                </Box>
       </Box>
       <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        backgroundColor: "#35363a",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "30%",
                        }}
                    >
                        <DifficultyBox difficulty={difficulty} />
                    </Box>
                    <JetBrainsMonoText text={"Summarised"} size={16} color={"#D9D9D9"} />
                    <StyledCheckbox />
                </Box>
    </Box>
    )
}

export const ItemBoxHoveredSkeleton: React.FC<TextProps> = (
    {
        title,
        description,
        difficulty,
        author
    }
) => {
    const [loading,setLoading] = useState(true)
    setTimeout(()=>setLoading(false) , 5000)
    return (
        <Box>
            <Box
                sx={{
                    marginTop: "30px",
                    marginBottom: "10px",
                }}
            >
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="300px"
                />
            </Box>
            <Box
                sx={{
                    marginBottom: "10px",
                }}
            >
                  <Skeleton
                    variant="rectangular"
                    width="70%"
                    height="50px"
                />
            </Box>
            <Skeleton
                variant="rectangular"
                width="60%"
                height="50px"
            />
       </Box>
    )
}

export const ItemBox: React.FC<TextProps> = (
    {
        title,
        description,
        difficulty,
        image,
        author
    }
) => {
    const truncatedDescription = description.length > 200 ? description.substring(0, 200) + "..." : description;
    return (
        <Box
        sx={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            marginBottom: "20px",
            backgroundColor: "#323437",
            }}
        >
            <Box
                component={"img"}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "15%",
                }}
                src={image}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "85%",
                    padding: "20px",
                }}
            >
                <JetBrainsMonoText text={title} size={24} color={"#D9D9D9"} />
                <JetBrainsMonoText text={"By " + author} size={16} color={"#c7c7c7"} />
                <JetBrainsMonoText text={truncatedDescription} size={16} color={"#D9D9D9"} />
                <Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "30%",
                    
                    }}>
                        <DifficultyBox difficulty={difficulty} />
                    </Box>
                    {/* <JetBrainsMonoText text={"Difficulty: " + difficulty} size={16} color={"#D9D9D9"} /> */}
                </Box>
            </Box>
        </Box>
    );
}