import Box from "@mui/material/Box";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StyledPagination from "../../components/Pagination/Pagination";
import {
  ItemBoxHovered,
  ItemBox,
  SearchBar,
  NoTexts,
} from "../../components/TextCards/AvailableTextCards";
import { getAvailableTexts } from "../../hooks/users";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { TextFilter } from "../../api";

const AvailableTexts: React.FC = () => {
  const { page } = useParams();
  const [pageNum, setPageNum] = useState(Number(page) || 1);
  const [customSearch, setCustomSearch] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [textFilter, setTextFilter] = useState<TextFilter>({
    difficulty: searchParams.get("difficulty") || "",
    include_fiction:
      searchParams.get("fiction") === "true" || !searchParams.get("fiction"),
    include_nonfiction:
      searchParams.get("nonfiction") === "true" ||
      !searchParams.get("nonfiction"),
    only_unplayed: searchParams.get("unplayed") === "true" || false,
    keyword: searchParams.get("search") || "",
  });

  const pageSize = 10;
  const { data: newData, refetch} = getAvailableTexts(pageNum, pageSize, textFilter);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const availableTexts = newData;
  const numPages = Math.ceil(newData.total_texts / newData.page_size);

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    let base = `/available-texts/${value}`;
    if (customSearch) {
      base += `?difficulty=${textFilter.difficulty}`;
      base += `&fiction=${textFilter.include_fiction}`;
      base += `&nonfiction=${textFilter.include_nonfiction}`;
      base += `&search=${textFilter.keyword}`;
    }
    navigate(base, { replace: true });
    setPageNum(value);
  };

  const handleUpdatedFilters = async (newFilters: TextFilter) => {
    setTextFilter(newFilters);
    let base = `/available-texts/1`;
    const queryParams = [];

    queryParams.push(`difficulty=${newFilters.difficulty}`);
    queryParams.push(`fiction=${newFilters.include_fiction}`);
    queryParams.push(`nonfiction=${newFilters.include_nonfiction}`);

    if (newFilters.only_unplayed) {
      queryParams.push(`unplayed=${newFilters.only_unplayed}`);
    }

    if (newFilters.keyword) {
      queryParams.push(`search=${newFilters.keyword}`);
    }

    if (queryParams.length > 0) {
      base += `?${queryParams.join("&")}`;
    }
    setCustomSearch(true);
    navigate(base, { replace: true });
  };

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
    };
  
    fetchData();
  }, [pageNum, textFilter, refetch]);

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
          <SearchBar
            initialFilters={textFilter}
            onUpdateFilters={handleUpdatedFilters}
          />
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
             availableTexts.texts.length > 0 ? (
              availableTexts.texts.slice(0, pageSize).map((text, index) => {
                return (
                  <Box
                    key={index}
                    onMouseEnter={() => {
                      setHoveredIndex(index);
                    }}
                    onMouseLeave={() => {
                      setHoveredIndex(-1);
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
                      {hoveredIndex == index && (
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
              })
            ) : (
              <NoTexts />
            )}
          </Box>
          <StyledPagination
            page={pageNum}
            count={numPages}
            onChange={handleChange}
          />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default AvailableTexts;
