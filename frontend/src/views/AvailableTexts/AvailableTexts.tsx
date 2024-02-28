import Box from "@mui/material/Box";
import Header from "../../components/Header/Header";
import StyledTextField from "../../components/Textbox/StyledTextField";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { StyledCheckbox } from "../../components/Checkbox/Checkbox";
import {MenuItem, OutlinedInput, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import StyledMultiSelect from "../../components/MultiSelect/MultiSelect";
import IconButton from "@mui/material/IconButton";
import { AnimatePresence, motion } from "framer-motion";
import StyledPagination from "../../components/Pagination/Pagination";
import {ItemBoxHovered, ItemBox, SearchBar}from "../../components/TextCards/AvailableTextCards"

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

    return (
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
        >
            <Header />
            <AnimatePresence>
            <motion.div
                key={"my_unique_key"}
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                transition={{ duration: 1 }}
                exit={{ opacity:0 }}
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
                            const [isHovered, setIsHovered] = useState(false);
                            return (
                                <Box
                                    key={index}
                                    onMouseEnter={() => {
                                        const timeoutId = setTimeout(() => setIsHovered(true), 300);
                                        return () => clearTimeout(timeoutId);
                                    }}
                                    onMouseLeave={() => setIsHovered(false)}
                                    sx={{
                                        width: "60%",
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <ItemBox key={index} title={text.title} description={text.description} difficulty={text.difficulty} />
                                    <AnimatePresence mode="wait">
                                    {isHovered && (
                                        <motion.div
                                            key={index + "hovered"}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.15 }}
                                            exit={{ opacity: 0 }}
                                            style={{
                                                display: "flex",
                                                width: "65%",
                                                paddingTop: "20px",
                                                paddingLeft: "50px",
                                                paddingRight: "50px",
                                                flexDirection: "column",
                                                backgroundColor: "#35363a",
                                                position: 'absolute',
                                                zIndex: 1,
                                                height: "500px",
                                            }}
                                        >
                                            <ItemBoxHovered
                                                title={"The Great Gatsby"}
                                                description={
                                                    "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan."
                                                }
                                                difficulty={"Easy"}
                                            />
                                        </motion.div>

                                    )}
                                    </AnimatePresence>
                                </Box>
                            );
                        })
                    }
                </Box>
                <StyledPagination count={numPages} onChange={handleChange}/>
            </motion.div>
            </AnimatePresence>
        </Box>
    );
}

// TODO: Make a component for rendering the list of available texts
// Make use of Material UI pagination

export default AvailableTexts;