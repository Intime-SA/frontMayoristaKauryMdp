import React from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div
      style={{
        backgroundColor: "#DD0831",
        color: "white",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: "20vh",
      }}
    >
      <Typography
        variant="p"
        gutterBottom
        style={{
          marginBottom: "0.5rem",
          fontSize: isNarrowScreen ? "30%" : "50%",
          fontWeight: 100,
        }}
      >
        Desarrollos TECH
      </Typography>
      <span class="material-symbols-outlined">language</span>
      <Typography
        variant="p"
        gutterBottom
        style={{
          marginBottom: "0.5rem",
          fontSize: isNarrowScreen ? "30%" : "50%",
          fontWeight: 100,
          marginTop: "0.5%",
        }}
      >
        www.atlantictech.com
      </Typography>
    </div>
  );
};

export default Footer;
