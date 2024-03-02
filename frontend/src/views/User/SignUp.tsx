import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { BodyRegisterUser } from "../../api";
import Header from "../../components/Header/Header";
import StyledTextField from "../../components/Textbox/StyledTextField";
import { useSnack } from "../../context/SnackContext";
import { useRegisterUser } from "../../hooks/users";

const SignUp: React.FC = () => {
  const { register, handleSubmit } = useForm<BodyRegisterUser>();
  const [fontSize, setFontSize] = useState(calculateFontSize());

  useEffect(() => {
    function handleResize() {
      setFontSize(calculateFontSize());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function calculateFontSize() {
    const windowWidth = window.innerWidth;
    const minFontSize = 25;
    const maxFontSize = 60;

    const calculatedFontSize = Math.min(
      maxFontSize,
      Math.max(minFontSize, windowWidth / 100),
    );

    return calculatedFontSize;
  }

  const registerUser = useRegisterUser();
  const navigate = useNavigate();
  const { showSnack } = useSnack();

  const onSubmit = (data: BodyRegisterUser) => {
    registerUser.mutate(data, {
      onSuccess: () => {
        showSnack("Successfully registered!");
        navigate("/login");
      },
      onError: (error) => {
        showSnack("Failed to register: " + error.message);
      },
    });
  };

  return (
    <Box>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <Box sx={{ width: "60%" }}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              minWidth: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
            }}
          >
            <StyledTextField
              fullWidth
              type="text"
              {...register("username", {
                required: true,
              })}
              placeholder="username"
            />

            <StyledTextField
              fullWidth
              type="email"
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
              placeholder="email"
            />

            <StyledTextField
              fullWidth
              type="password"
              {...register("password", {
                required: true,
              })}
              placeholder="password"
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                width: fontSize * 7,
                fontFamily: "JetBrains Mono, monospace",
                backgroundColor: "#E2B714",
                borderRadius: "10px",
                border: "3px solid #D1D0C5",
                textTransform: "lowercase",
                fontWeight: "bolder",
                fontSize: fontSize,
              }}
            >
              Sign Up.
            </Button>
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  color: "#fff",
                  fontSize: fontSize * 0.6,
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: "bolder",
                  textDecoration: "underline",
                  "&:hover": {
                    color: "#E2B714",
                  },
                }}
              >
                Back to log in.
              </Box>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
