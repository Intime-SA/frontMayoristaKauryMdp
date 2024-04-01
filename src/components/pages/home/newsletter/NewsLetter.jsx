import React from "react";
import { Typography, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Newsletter = () => {
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      style={{
        marginTop: "4rem",
        textAlign: "center",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "100vw",
        height: "60vh",
        maxHeight: "400px",
        backgroundColor: "#DD0831",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="p"
        gutterBottom
        style={{
          marginBottom: "0.5rem",
          fontSize: isNarrowScreen ? "70%" : "90%",
          fontWeight: 100,
          fontFamily: '"Roboto Condensed", sans-serif',
        }}
      >
        NewsLetter
      </Typography>
      <Typography
        variant="h4"
        gutterBottom
        style={{
          marginBottom: "0.5rem",
          fontSize: isNarrowScreen ? "16px" : "24px", // Reducir el tamaño de fuente en pantallas estrechas
          display: "flex",
          justifyContent: "center",
          fontWeight: 900,
          fontFamily: '"Roboto Condensed", sans-serif',
        }}
      >
        Recibí todas las ofertas y noticias
      </Typography>
      <Typography
        variant="p"
        gutterBottom
        style={{
          marginBottom: "0.5rem",
          fontSize: isNarrowScreen ? "16px" : "24px",
          fontWeight: 100,
          fontFamily: '"Roboto Condensed", sans-serif',
        }}
      >
        ¿Querés recibir nuestras ofertas? ¡Registrate ya mismo y comenzá a
        disfrutarlas!
      </Typography>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          marginBottom: "20px", // Añadir margen inferior para separación
        }}
      >
        <input
          type="email"
          placeholder="Tu correo electrónico"
          style={{
            marginBottom: "20px",
            backgroundColor: "white",
            borderRadius: "10px",
            width: "80vw", // Ancho del 100% menos los márgenes horizontales
            maxWidth: "1500px", // Ancho máximo para evitar desbordamientos en pantallas anchas
            height: "50px", // Altura fija para evitar cambios de diseño
            padding: "12px 20px",
            boxSizing: "border-box",
            border: "1px solid #ccc",
            fontSize: "16px", // Tamaño de fuente fijo
            outline: "none",
          }}
        />
      </form>
    </div>
  );
};

export default Newsletter;
