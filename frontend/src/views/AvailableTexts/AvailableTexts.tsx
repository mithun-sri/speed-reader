import Box from "@mui/material/Box";
import Header from "../../components/Header/Header";
import StyledTextField from "../../components/Textbox/StyledTextField";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { StyledCheckbox } from "../../components/Checkbox/Checkbox";
import {MenuItem, OutlinedInput, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import StyledMultiSelect from "../../components/MultiSelect/MultiSelect";
import IconButton from "@mui/material/IconButton";
import { motion } from "framer-motion";
import StyledPagination from "../../components/Pagination/Pagination";
import axios from "axios";
import { forEach } from "cypress/types/lodash";

interface TextProps {
    title: string;
    description: string;
    difficulty: string;
}

const AvailableTexts: React.FC = () => {
    let pageSize = 25;
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(10);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    // const [texts, setTexts] = useState<TextProps[]>([]);
    const texts = [
        {
            title: "The Great Gatsby",
            description: "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
            difficulty: "Easy",
        },
        {
            title: "The Catcher in the Rye",
            description: "The Catcher in the Rye is a novel by J. D. Salinger, partially published in serial form in 1945–1946 and as a novel in 1951. It was originally intended for adults, but is often read by adolescents for its themes of angst and alienation, and as a critique on superficiality in society.",
            difficulty: "Medium",
        },
        {
            title: "To Kill a Mockingbird",
            description: "To Kill a Mockingbird is a novel by Harper Lee published in 1960. Instantly successful, widely read in high schools and middle schools in the United States, it has become a classic of modern American literature, winning the Pulitzer Prize.",
            difficulty: "Hard",
        },
    ]

    // useEffect(() => {
    //     axios.get("/api/v1/current/available_texts")
    //     .then((response) => {
    //         forEach(response.data, (text) => {
    //             console.log(text);
    //         }
    //         );
    //     })
    // }, []);

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
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {
                        texts.slice((page - 1) * pageSize, page * pageSize).map((text, index) => {
                            return (
                                <ItemBox key={index} title={text.title} description={text.description} difficulty={text.difficulty} />
                            );
                        })
                    }
                </Box>
                <StyledPagination count={numPages} onChange={handleChange}/>
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

const ItemBox: React.FC<TextProps> = (
    {
        title,
        description,
        difficulty
    }
) => {
    const truncatedDescription = description.length > 200 ? description.substring(0, 200) + "..." : description;
    return (
        <Box
        sx={{
            display: "flex",
            width: window.innerWidth > 600 ? "50%" : "100%",
            padding: "25px",
            margin: "10px",
            flexDirection: "row",
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
                src={"https://www.gutenberg.org/cache/epub/73059/pg73059.cover.medium.jpg"}
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
                <JetBrainsMonoText text={truncatedDescription} size={16} color={"#D9D9D9"} />
                <Box
                    sx={{
                        backgroundColor: "#E2B714",
                        padding: "10px",
                        borderRadius: "5px",
                    }}
                >
                    <JetBrainsMonoText text={"Difficulty: " + difficulty} size={16} color={"#D9D9D9"} />
                </Box>
            </Box>
        </Box>
    );
}

export default AvailableTexts;