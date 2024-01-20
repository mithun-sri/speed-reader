import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import Context from "../../Context";

const calculateFontSize = () => {
  const windowWidth = window.innerWidth;
  const minFontSize = 16;
  const maxFontSize = 48;

  return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 15));
};

const VerticalLinesBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  height: 200px; /* Adjust the height of the box */
  align-items: start; /* Align lines vertically at the center */
  padding-top: 1%;
`;

const Line = styled("div")<{ height: string }>`
  width: 5px;
  background-color: #fff;
  height: ${(props) =>
    props.height || "10vh"}; /* Default height or height from prop */
  border-radius: 2.5px;
`;

const PrettoSlider = styled(Slider)(({ theme }) => ({
  color: "#E2B714",
  height: 26,
  width: "100%",
  "& .MuiSlider-rail": {
    backgroundColor: "#646669",
  },
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 54,
    width: 54,
    backgroundColor: "#D1D0C5",
    border: "6px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "none",
    },
    "&::before": {
      display: "none",
    },
    "& .MuiSlider-valueLabel": {
      display: "none",
    },
  },
}));

function SpeedSlider() {
  const context = useContext(Context);
  const [fontSize, setFontSize] = useState(calculateFontSize());

  const onSliderChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    context.setWPM(newValue as number);
  };

  useEffect(() => {
    function handleResize() {
      setFontSize(calculateFontSize());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Run effect only once on mount

  return (
    <Box sx={{ width: "55%", margin: "0 auto" }}>
      <Box
        sx={{
          paddingBottom: "5px",
          fontSize: fontSize * 1.1,
          color: "#D1D0C5",
          fontFamily: "JetBrains Mono, monospace",
          margin: "20px",
          fontWeight: "bolder",
        }}
      >
        Standard Mode.
      </Box>
      <Box
        sx={{
          margin: "20px",
          fontSize: fontSize / 1.4,
          color: "#fff",
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "bolder",
        }}
      >
        Choose your reading speed.
      </Box>
      <PrettoSlider
        valueLabelDisplay="auto"
        step={100}
        defaultValue={300}
        onChange={onSliderChange}
        marks={false}
        min={100}
        max={500}
      />
      <VerticalLinesBox>
        <Line height="7vh" />
        <Line height="5vh" />
        <Line height="7vh" />
        <Line height="5vh" />
        <Line height="7vh" />
      </VerticalLinesBox>
    </Box>
  );
}

export default SpeedSlider;
