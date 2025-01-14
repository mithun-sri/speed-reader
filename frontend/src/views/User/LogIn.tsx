import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { UserLogin } from "../../api";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import StyledTextField from "../../components/Textbox/StyledTextField";
import { useSnack } from "../../context/SnackContext";
import { useLoginUser } from "../../hooks/users";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLogin>();
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

  const loginUser = useLoginUser();
  const navigate = useNavigate();
  const { showSnack } = useSnack();

  const onSubmit = (data: UserLogin) => {
    loginUser.mutate(data, {
      onSuccess: () => {
        navigate("/game");
      },
      onError: (error) => {
        // @ts-expect-error "message" does not exist on "error" type
        showSnack("Failed to login: " + error.response.data.message);
      },
    });
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
                  Username is required
                </Box>
              )}
            </Box>
            <Box sx={{ width: "100%" }}>
              <StyledTextField
                fullWidth
                type="password"
                {...register("password", {
                  required: true,
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
                  Password is required
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
              Log in
            </Button>
            <Link
              to="/signup"
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
                New to Speed Reader?
              </Box>
            </Link>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
