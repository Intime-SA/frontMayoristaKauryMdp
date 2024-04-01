import { Button, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

const Redes = () => {
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      style={{
        height: "25vh",
        maxHeight: "400px",
        width: "100%",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "30vw",
          minWidth: "200px", // Ancho mínimo
          maxWidth: "400px", // Ancho máximo
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          height: "50%",
        }}
      >
        <img
          src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/insta.png?alt=media&token=863cb77e-ae36-46dd-af67-d30ea79e2325"
          alt="insta"
          width="50px"
          height="50px"
          style={{
            width: "10%", // Tamaño relativo al ancho del contenedor padre
            minWidth: "50px", // Ancho mínimo en píxeles
            maxWidth: "100px", // Ancho máximo en píxeles
          }}
        />
        <Typography
          variant="p"
          gutterBottom
          style={{
            marginBottom: "0.5rem",
            fontSize: isNarrowScreen ? "30%" : "60%",
            fontWeight: 100,
            fontFamily: '"Roboto Condensed", sans-serif',
          }}
        >
          Estamos en instagram
        </Typography>
        <Button
          variant="outlined"
          style={{
            width: "auto",
            borderRadius: "20px",
            color: "red",
            border: "1px solid red",
            fontSize: isNarrowScreen ? "20%" : "40%",
          }}
        >
          <Link
            style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
            to="https://www.instagram.com/kaurymdp"
          >
            SEGUINOS
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Redes;
