import Box from "@mui/material/Box";
import Header from "../../components/Header/Header";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StyledPagination from "../../components/Pagination/Pagination";
import {ItemBoxHovered, ItemBox, SearchBar}from "../../components/TextCards/AvailableTextCards"
import { getAvailableTexts } from "../../hooks/users";

const AvailableTexts: React.FC = () => {
    let pageSize = 10;
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
            image: "https://www.gutenberg.org/cache/epub/64317/pg64317.cover.medium.jpg",
            author: "F. Scott Fitzgerald",
            is_fiction: true
        },
        {
            title: "Pride and Prejudice",
            description: "Pride and Prejudice is a romantic novel of manners written by Jane Austen in 1813. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
            difficulty: "Med",
            image: "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg",
            author: "Jane Austen",
            is_fiction: true
        },
        {
            title: "Middlemarch",
            description: "Middlemarch, A Study of Provincial Life is a novel by the English author George Eliot (Mary Anne Evans), first published in eight installments (volumes) during 1871–72. The novel is set in the fictitious Midlands town of Middlemarch during 1829–32, and it comprises several distinct (though intersecting) stories and a large cast of characters.",
            difficulty: "Hard",
            image: "https://www.gutenberg.org/cache/epub/145/pg145.cover.medium.jpg",
            author: "George Eliot",
            is_fiction: true
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
                                        const timeoutId = setTimeout(() => {
                                            setIsHovered(true);
                                        }
                                            , 300);
                                        return () => clearTimeout(timeoutId);
                                    }}
                                    onMouseLeave={() => {
                                        setIsHovered(false);
                                    }}
                                    sx={{
                                        width: "60%",
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <ItemBox key={index} title={text.title} description={text.description} difficulty={text.difficulty} image={text.image} author={text.author} is_fiction={text.is_fiction}/>
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
                                                padding: "30px",
                                                flexDirection: "column",
                                                backgroundColor: "#35363a",
                                                position: 'absolute',
                                                zIndex: 1,
                                                height: "400px",
                                            }}
                                        >
                                            <ItemBoxHovered
                                                title={text.title}
                                                description={text.description}
                                                difficulty={text.difficulty}
                                                image={text.image}
                                                author={text.author}
                                                is_fiction={text.is_fiction}
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

export default AvailableTexts;