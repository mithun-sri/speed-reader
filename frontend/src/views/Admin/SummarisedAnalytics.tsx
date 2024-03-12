import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import { Box, IconButton } from "@mui/material";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getTextStatistics } from "../../hooks/admin";
import NotFound from "../../components/Error/NotFound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SummarisedAnalytics: React.FC = () => {
  const { text_id } = useParams();

  if (!text_id) {
    return <NotFound />;
  }
  const { data: textStatistics } = getTextStatistics(text_id);

  return (
    <Box>
      <Header />
      <Box sx={{ marginLeft: "8vw", marginTop: "1vh", marginBottom: "1.5vh" }}>
        <IconButton onClick={() => window.history.back()}>
          <Box
            sx={{
              fontFamily: "JetBrains Mono, monospace",
              color: "#D1D0C5",
              fontWeight: "bolder",
              fontSize: "1.5vw",
            }}
          >{`< back`}</Box>
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "center",
          backgroundColor: "#323437",
          width: "80vw",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "20px",
          padding: "2vw",
          borderRadius: "1em",
        }}
      >
        <Box>
          <JetBrainsMonoText
            text={`Text Analytics - ${textStatistics.title}`}
            size={24}
            color="#E2B714"
          />
        </Box>
        <BarChartComponent
          chart_data={[
            { type: "original standard", ...textStatistics.original_standard },
            { type: "original adaptive", ...textStatistics.original_adaptive },
            {
              type: "summarised standard",
              ...textStatistics.summarised_standard,
            },
            {
              type: "summarised adaptive",
              ...textStatistics.summarised_adaptive,
            },
            {
              type: "summarised overall",
              ...textStatistics.summarised_overall,
            },
          ]}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            flexDirection: "row",
            alignItems: "center",
            justifyItems: "right",
            width: "100%",
            margin: "2vw",
          }}
        >
          <Link to={`/admin/text/${text_id}/edit`}>
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
                  padding: "10px 20px 10px 20px",
                  fontWeight: "bolder",
                  fontSize: "16px",
                  wordWrap: "break-word",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: "#cba412",
                  },
                  transition: "0.1s ease-out",
                }}
              >
                <Box>Edit text</Box>
                <FontAwesomeIcon
                  icon={"edit"}
                  className="fa-table-page-icon"
                  style={{ marginLeft: "10px" }}
                />
              </Box>
            </IconButton>
          </Link>
          <Link to={`/admin/questions/${text_id}`}>
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
                  padding: "10px 20px 10px 20px",
                  fontWeight: "bolder",
                  fontSize: "16px",
                  wordWrap: "break-word",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: "#cba412",
                  },
                  transition: "0.1s ease-out",
                }}
              >
                <Box>Edit questions</Box>
                <FontAwesomeIcon
                  icon={"edit"}
                  className="fa-table-page-icon"
                  style={{ marginLeft: "10px" }}
                />
              </Box>
            </IconButton>
          </Link>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            flexDirection: "column",
            alignItems: "center",
            justifyItems: "left",
            backgroundColor: "#323437",
            width: "100%",
            margin: "2vw",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "left",
              flexDirection: "row",
              alignItems: "center",
              justifyItems: "left",
            }}
          >
            <JetBrainsMonoText text="Original Text" size={20} color="#E2B714" />
          </Box>
          <Box>
            <JetBrainsMonoText
              text={textStatistics.content}
              size={20}
              color="white"
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            flexDirection: "column",
            alignItems: "center",
            justifyItems: "left",
            backgroundColor: "#323437",
            width: "100%",
            margin: "2vw",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "left",
              flexDirection: "row",
              alignItems: "center",
              justifyItems: "left",
            }}
          >
            <JetBrainsMonoText
              text="Summarise Text"
              size={20}
              color="#E2B714"
            />
          </Box>
          <Box>
            <JetBrainsMonoText
              text={textStatistics.summary}
              size={20}
              color="white"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SummarisedAnalytics;

const BarChartComponent = ({ chart_data }: { chart_data: any }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chart_data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="average_wpm"
          fill="#8884d8"
          barSize={30}
          name="Average WPM"
        />
        <Bar
          dataKey="average_score"
          fill="#82ca9d"
          barSize={30}
          name="Average Score"
        />
        <Bar
          dataKey="twenty_fifth_percentile"
          fill="#ffc658"
          barSize={30}
          name="25th Percentile WPM"
        />
        <Bar
          dataKey="fiftieth_percentile"
          fill="#2c82c9"
          barSize={30}
          name="50th Percentile WPM"
        />
        <Bar
          dataKey="seventy_fifth_percentile"
          fill="#f2784b"
          barSize={30}
          name="75th Percentile WPM"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
