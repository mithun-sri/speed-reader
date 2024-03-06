import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import StyledTextField from "../../components/Textbox/StyledTextField";
import { useSnack } from "../../context/SnackContext";
import { useRegisterUser } from "../../hooks/users";

interface SignUpFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();
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

  const onSubmit = (data: SignUpFormData) => {
    registerUser.mutate(
      {
        username: data.username,
        password: data.password,
      },
      {
        onSuccess: () => {
          showSnack("Successfully registered!");
          navigate("/login");
        },
        onError: (error) => {
          showSnack("Failed to register: " + error.message);
        },
      },
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
          flex: 1,
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
            <Box sx={{ width: "100%" }}>
              <StyledTextField
                fullWidth
                type="text"
                {...register("username", {
                  required: true,
                  minLength: 3,
                  maxLength: 30,
                  pattern: /^[a-zA-Z0-9_]+$/,
                })}
                placeholder="username"
              />
              {errors.username && (
                <Box
                  sx={{
                    color: "#E2B714",
                    fontSize: fontSize * 0.6,
                    fontFamily: "JetBrains Mono, monospace",
                    marginTop: "5px",
                  }}
                >
                  {errors.username.type === "required" &&
                    "Username is required"}
                  {errors.username.type === "minLength" &&
                    "Username must be at least 3 characters"}
                  {errors.username.type === "maxLength" &&
                    "Username must be at most 30 characters"}
                  {errors.username.type === "pattern" &&
                    "Username can only contain letters, numbers, and underscores"}
                </Box>
              )}
            </Box>
            <Box sx={{ width: "100%" }}>
              <StyledTextField
                fullWidth
                type="password"
                {...register("password", {
                  required: true,
                  minLength: 8,
                })}
                placeholder="password"
              />
              {errors.password && (
                <Box
                  sx={{
                    color: "#E2B714",
                    fontSize: fontSize * 0.6,
                    fontFamily: "JetBrains Mono, monospace",
                    marginTop: "5px",
                  }}
                >
                  {errors.password.type === "required" &&
                    "Password is required"}
                  {errors.password.type === "minLength" &&
                    "Password must be at least 8 characters"}
                </Box>
              )}
            </Box>
            <Box sx={{ width: "100%" }}>
              <StyledTextField
                fullWidth
                type="password"
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) =>
                    watch("password") === value || "Passwords do not match",
                })}
                placeholder="confirm password"
              />
              {errors.confirmPassword && (
                <Box
                  sx={{
                    color: "#E2B714",
                    fontSize: fontSize * 0.6,
                    fontFamily: "JetBrains Mono, monospace",
                    marginTop: "5px",
                  }}
                >
                  {errors.confirmPassword.type === "required" &&
                    "Confirm password is required"}
                  {errors.confirmPassword.type === "validate" &&
                    "Passwords do not match"}
                </Box>
              )}
            </Box>
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
                "&:hover": {
                  backgroundColor: "#a8880f",
                },
              }}
            >
              Sign Up
            </Button>
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  color: "#D1D0C5",
                  fontSize: fontSize * 0.6,
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: "bolder",
                  textDecoration: "underline",
                  "&:hover": {
                    color: "#E2B714",
                  },
                }}
              >
                Go to log in
              </Box>
            </Link>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default SignUp;
