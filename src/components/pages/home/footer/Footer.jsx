import React from "react";
import { Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

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
        height: "auto",
        paddingBottom: "1rem",
        paddingTop: "1rem",
      }}
    >
      <Link to="https://atlantics.dev/">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/00000altanticdev-removebg-preview.png?alt=media&token=933ef3e7-fc96-48ac-bd20-8a43858dceab"
          alt=""
          srcset=""
          style={{ width: "7rem" }}
        />
      </Link>
      <Typography
        variant="p"
        gutterBottom
        style={{
          marginBottom: "0.5rem",
          fontSize: isNarrowScreen ? "70%" : "100%",
          fontWeight: 100,
          marginTop: "0.5%",
          fontFamily: '"Danfo", serif',
        }}
      >
        atlantics.dev
      </Typography>
    </div>
  );
};

export default Footer;
