import React from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  useMediaQuery,
} from "@mui/material";
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
        width: "100%",
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
        }}
      >
        NewsLetter
      </Typography>
      <Typography
        variant="h4"
        gutterBottom
        style={{
          marginBottom: "0.5rem",
          width: "80%",
          fontSize: isNarrowScreen ? "60%" : "80%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <strong>Recibí todas las ofertas y noticias</strong>
      </Typography>
      <Typography
        variant="p"
        gutterBottom
        style={{
          marginBottom: "0.5rem",
          fontSize: isNarrowScreen ? "40%" : "90%",
          fontWeight: 100,
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
          width: "100%",
        }}
      >
        <div style={{ position: "relative" }}>
          <input
            type="email"
            placeholder="Tu correo electrónico"
            style={{
              marginBottom: "20px",
              backgroundColor: "white",
              borderRadius: "10px",
              width: "80vw",
              height: "8vh",
              padding: "12px 20px",
              boxSizing: "border-box",
              border: "1px solid #ccc",
              fontSize: "50%",
              outline: "none",
            }}
          />
        </div>

        <Button
          variant="contained"
          color="inherit"
          type="submit"
          style={{ marginBottom: "20px", color: "black" }}
        >
          Suscribirse
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;
