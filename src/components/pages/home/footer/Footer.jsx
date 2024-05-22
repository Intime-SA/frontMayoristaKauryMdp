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
      <Link to="https://www.instagram.com/kaurymdp/?hl=es">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/logo-927322684-1687738908-786eafccc1dcfd968724c4c5cba6acf61687738908-320-0.jpg?alt=media&token=4415c358-8994-40b2-bee0-9fe378428bea"
          alt=""
          srcset=""
          style={{
            width: "30vh",
            marginLeft: "1rem",
            marginBottom: "0rem",
            padding: "0px",
          }}
        />
      </Link>
      <Typography
        variant="p"
        gutterBottom
        style={{
          fontSize: isNarrowScreen ? "50%" : "70%",
          fontWeight: 100,

          fontFamily: "'Roboto Condensed', sans-serif",
          textAlign: "center",
        }}
      >
        @kaurymdp
      </Typography>
      <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
        <img
          style={{ width: "3vw", marginBottom: "1rem" }}
          src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/00000altanticdev-removebg-preview.png?alt=media&token=933ef3e7-fc96-48ac-bd20-8a43858dceab"
          alt=""
        />
        <p
          style={{
            fontSize: isNarrowScreen ? "20%" : "40%",
            fontWeight: 100,
            fontFamily: "'Roboto Condensed', sans-serif",
            color: "white",
          }}
        >
          Copyright © 2024 | atlantics.dev | Desarrollos Tech
        </p>
      </div>
    </div>
  );
};

export default Footer;
