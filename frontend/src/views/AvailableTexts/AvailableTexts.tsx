import Box from "@mui/material/Box";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StyledPagination from "../../components/Pagination/Pagination";
import {
  ItemBoxHovered,
  ItemBox,
  SearchBar,
} from "../../components/TextCards/AvailableTextCards";
import { getAvailableTexts } from "../../hooks/users";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { TextFilter } from "../../api";

const AvailableTexts: React.FC = () => {
  const {page, page_size} = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [pageNum, setPageNum] = useState(Number(page) || 1);
  const [textFilter, setTextFilter] = useState<TextFilter>({
    difficulty: searchParams.get("difficulty") || "",
    include_fiction: searchParams.get("fiction") === "true" || !searchParams.get("fiction"),
    include_nonfiction: searchParams.get("nonfiction") === "true" || !searchParams.get("nonfiction"),
    only_unplayed: searchParams.get("unplayed") === "true" || false,
    keyword: searchParams.get("search") || "",
  });
  console.log(textFilter);
  const pageSize = Number(page_size) || 10;

  const { data: newData } = getAvailableTexts(pageNum, pageSize, textFilter);
  const [availableTexts, setAvailableTexts] = useState(newData);
  const numPages = Math.ceil(newData.total_texts / newData.page_size);

  const handleChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    let base = `/available-texts/${value}/${pageSize}`;
    base += `?difficulty=${textFilter.difficulty}`;
    base += `&fiction=${textFilter.include_fiction}`;
    base += `&nonfiction=${textFilter.include_nonfiction}`;
    base += `&search=${textFilter.keyword}`;
    navigate(base, { replace: true });
    // window.location.reload();
    // navigate(`/available-texts/${value}/${pageSize}`, { replace: true });
    setPageNum(value);
    window.location.reload();
  };

  const handleUpdatedFilters = async (newFilters: TextFilter) => {
    setTextFilter(newFilters);
    let base = `/available-texts/1/${pageSize}`;
    let added = false;
    if (newFilters.difficulty) {
      base += `?difficulty=${newFilters.difficulty}`;
      added = true;
    }
    if (added) {
      base += `&fiction=${newFilters.include_fiction}`;
    }
    else {
      base += `?fiction=${newFilters.include_fiction}`;
      added = true;
    }
    if (added) {
      base += `&nonfiction=${newFilters.include_nonfiction}`;
    }
    else {
      base += `?nonfiction=${newFilters.include_nonfiction}`;
      added = true;
    }
    if (added && newFilters.only_unplayed) {
      base += `&unplayed=${newFilters.only_unplayed}`;
    }
    else if (newFilters.only_unplayed) {
      base += `?unplayed=${newFilters.only_unplayed}`;
      added = true;
    }
    if (added && newFilters.keyword) {
      base += `&search=${newFilters.keyword}`;
    }
    else if (newFilters.keyword) {
      base += `?search=${newFilters.keyword}`;
    }
    navigate(base, { replace: true });
    window.location.reload();
  };

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          exit={{ opacity: 0 }}
        >
          <SearchBar onUpdateFilters={handleUpdatedFilters} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {availableTexts.texts
              .slice(0, pageSize)
              .map((text, index) => {
                const [isHovered, setIsHovered] = useState(false);
                return (
                  <Box
                    key={index}
                    onMouseEnter={() => {
                      setIsHovered(true);
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
                    <ItemBox
                      id={text.id}
                      title={text.title}
                      content={text.content}
                      summary={text.summary}
                      word_count={text.word_count}
                      description={text.description}
                      difficulty={text.difficulty}
                      image_url={text.image_url}
                      author={text.author}
                      fiction={text.fiction}
                      source={text.source}
                    />
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
                            padding: "3vh",
                            flexDirection: "column",
                            backgroundColor: "#35363a",
                            position: "absolute",
                            zIndex: 1,
                            minHeight: "30vh",
                          }}
                        >
                          <ItemBoxHovered
                            id={text.id}
                            title={text.title}
                            content={text.content}
                            summary={text.summary}
                            word_count={text.word_count}
                            description={text.description}
                            difficulty={text.difficulty}
                            image_url={text.image_url}
                            author={text.author}
                            fiction={text.fiction}
                            source={text.source}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                );
              })}
          </Box>
          <StyledPagination page={pageNum} count={numPages} onChange={handleChange} />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default AvailableTexts;
