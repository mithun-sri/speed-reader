import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import { Box, IconButton } from "@mui/material";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTextStatistics } from "../../hooks/admin";
import NotFound from "../../components/Error/NotFound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SummarisedAnalytics: React.FC = () => {
    const { text_id } = useParams();

    if(!text_id) {
        return <NotFound />;
    }
    const {data: textStatistics} = getTextStatistics(text_id);

    return (
        <Box>
            <Header />
            <Box sx={{ marginLeft: "8vw", marginTop: "1vh", marginBottom: "1.5vh" }}>
                <Link to="/admin">
                    <IconButton>
                        <Box
                        sx={{
                            fontFamily: "JetBrains Mono, monospace",
                            color: "#D1D0C5",
                            fontWeight: "bolder",
                            fontSize: "1.5vw",
                        }}
                        >{`< back`}</Box>
                    </IconButton>
                </Link>
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
                    borderRadius: "1em"
                }}
            >
                <Box>
                    <JetBrainsMonoText
                        text={`Text Analytics - ${textStatistics.title}`}
                        size={24}
                        color="#E2B714"
                    />
                </Box>
                <BarChartComponent chart_data={[textStatistics.original_standard]} />
                <Box>
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
                        margin: "2vw"
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
                        <JetBrainsMonoText text={textStatistics.content} size={20} color="white" />
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
                        margin: "2vw"
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
                        <JetBrainsMonoText text="Summarise Text" size={20} color="#E2B714" />
                    </Box>
                    <Box>
                        <JetBrainsMonoText text={textStatistics.summary} size={20} color="white" />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default SummarisedAnalytics;

interface ChartData {
    type: string;
    average_wpm: number;
    average_score: number;
    twenty_fifth_percentile_wpm: number;
    fiftieth_percentile_wpm: number;
    seventy_fifth_percentile_wpm: number;
  }

const data: ChartData[] = [
  {
    type: 'original_standard',
    average_wpm: 438,
    average_score: 40,
    twenty_fifth_percentile_wpm: 231,
    fiftieth_percentile_wpm: 472,
    seventy_fifth_percentile_wpm: 619,
  },
  {
    type: 'original_adaptive',
    average_wpm: 506,
    average_score: 34,
    twenty_fifth_percentile_wpm: 447,
    fiftieth_percentile_wpm: 558,
    seventy_fifth_percentile_wpm: 917,
  },
  {
    type: 'summarised_standard',
    average_wpm: 630,
    average_score: 23,
    twenty_fifth_percentile_wpm: 426,
    fiftieth_percentile_wpm: 769,
    seventy_fifth_percentile_wpm: 910,
  },
  {
    type: 'summarised_adaptive',
    average_wpm: 541,
    average_score: 34,
    twenty_fifth_percentile_wpm: 462,
    fiftieth_percentile_wpm: 654,
    seventy_fifth_percentile_wpm: 717,
  },
  {
    type: 'summarised_overall',
    average_wpm: 575,
    average_score: 30,
    twenty_fifth_percentile_wpm: 426,
    fiftieth_percentile_wpm: 686,
    seventy_fifth_percentile_wpm: 814,
  },
];

const BarChartComponent = ({chart_data}: {chart_data: any}) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chart_data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="average_wpm" fill="#8884d8" barSize={30} name="Average WPM"/>
                <Bar dataKey="average_score" fill="#82ca9d" barSize={30} name="Average Score" />
                <Bar dataKey="twenty_fifth_percentile_wpm" fill="#ffc658" barSize={30} name="25th Percentile WPM" />
                <Bar dataKey="fiftieth_percentile_wpm" fill="#2c82c9" barSize={30} name="50th Percentile WPM" />
                <Bar dataKey="seventy_fifth_percentile_wpm" fill="#f2784b" barSize={30} name="75th Percentile WPM" />
            </BarChart>
        </ResponsiveContainer>
    );
};