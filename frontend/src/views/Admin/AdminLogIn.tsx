import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, TextField, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";

interface LoginFormData {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
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

  const onSubmit: SubmitHandler<LoginFormData> = async (
    data: LoginFormData,
  ) => {
    try {
      // TO DO: replace with autogenerated client
      // Store access and refresh token in localStorage
      // to use in other requests
      const response = await fetch("your-login-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log(response);
      if (response.ok) {
        // Handle successful login
      } else {
        // Internal Server Error, etc
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: "14%",
            marginBottom: "20px ",
          }}
        >
          <Box
            sx={{
              fontSize: fontSize * 3,
              marginRight: "20px",
              marginLeft: "30px",
              color: "#D1D0C5",
            }}
          >
            <FontAwesomeIcon icon={faStopwatch} color="#E2B714" />
          </Box>
          <Box sx={{ color: "#D1D0C5" }}>
            <div
              style={{
                textAlign: "left",
                fontWeight: "bolder",
                fontSize: fontSize * 1.3,
                lineHeight: "1.5",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              Speed <br />
              Reader
            </div>
          </Box>
        </Box>
        <Box>
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
            <TextField
              fullWidth
              type="email"
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
              placeholder="email"
            />

            <TextField
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
              log in
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLogin;
