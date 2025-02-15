import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useGameContext } from "../../context/GameContext";
import StyledTextField from "../Textbox/StyledTextField";
import SliderLevelText from "./SliderLevelText";
import SliderRateText from "./SliderRateText";

const calculateFontSize = () => {
  const windowWidth = window.innerWidth;
  const minFontSize = 16;
  const maxFontSize = 48;

  return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 15));
};

const VerticalLinesBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  height: 60px; /* Adjust the height of the box */
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

const PrettoSlider = styled(Slider)(() => ({
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
      display: "true",
    },
  },
}));

function SpeedSlider() {
  const { setWpm } = useGameContext();

  const [fontSize, setFontSize] = useState(calculateFontSize());
  const defaultWpm = 200;
  const minWpm = 1;
  const maxWpm = 3000;
  const [customValue, setCustomValue] = useState(defaultWpm.toString());
  const [sliderValue, setSliderValue] = useState(defaultWpm);

  const onSliderChange = (
    _event: Event,
    newValue: number | number[],
    _activeThumb: number,
  ) => {
    const newNumber = newValue as number;
    setWpm(newNumber);
    setSliderValue(newNumber);
    setCustomValue(newNumber.toString());
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

  const customValueChange = (event: any) => {
    const newValueString = event.target.value.replace(/\D/g, "");
    let newValue = Math.min(
      maxWpm,
      Math.max(minWpm, parseInt(newValueString) || minWpm),
    );

    if (newValueString === "") {
      setCustomValue("");
      newValue = defaultWpm;
    } else {
      setCustomValue(newValue.toString());
    }

    setSliderValue(newValue);
    setWpm(newValue);
  };

  const customValueClickedOff = (event: any) => {
    const newValueString = event.target.value.trim();
    if (newValueString === "") {
      setCustomValue(defaultWpm.toString());
      setSliderValue(defaultWpm);
      setWpm(defaultWpm);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "55%",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            paddingBottom: "5px",
            fontSize: fontSize / 1.1,
            color: "#D1D0C5",
            fontFamily: "JetBrains Mono, monospace",
            margin: "20px",
            fontWeight: "bolder",
          }}
        >
          Standard Mode
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              margin: "20px",
              fontSize: fontSize / 2.1,
              color: "#fff",
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: "bolder",
            }}
          >
            Choose your reading speed:
          </Box>
          <StyledTextField
            value={customValue}
            onChange={customValueChange}
            onBlur={customValueClickedOff}
            sx={{
              width: `76px`,
              textAlign: "center",
            }}
            inputProps={{ maxLength: 4 }}
            rows={1}
          />
        </Box>
        <PrettoSlider
          value={sliderValue}
          valueLabelDisplay="auto"
          onChange={onSliderChange}
          marks={false}
          min={100}
          max={700}
          sx={{ marginBottom: "10px", marginTop: "10px" }}
        />
        <VerticalLinesBox>
          <Line height="7vh" />
          <Line height="5vh" />
          <Line height="7vh" />
          <Line height="5vh" />
          <Line height="7vh" />
        </VerticalLinesBox>
      </Box>
      <SliderLevelText fontSize={fontSize / 1.2} />
      <SliderRateText fontSize={fontSize / 1.2} />
    </Box>
  );
}

export default SpeedSlider;
