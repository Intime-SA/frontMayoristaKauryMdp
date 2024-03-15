import React from "react";
import { Typography, TextField, Button, Container } from "@mui/material";

const Newsletter = () => {
  return (
    <div
      maxWidth="sm"
      style={{
        marginTop: "2rem",
        textAlign: "center",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "100%",
        height: "30vh",
        backgroundColor: "#DD0831",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="body1" gutterBottom style={{ marginBottom: "20px" }}>
        NewsLetter
      </Typography>
      <Typography
        variant="h4"
        gutterBottom
        style={{
          marginBottom: "20px",
          width: "80%",
          fontSize: "70%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Recibí todas las ofertas y noticias
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
              width: "50vw",
              height: "4vh",
              padding: "12px 20px",
              boxSizing: "border-box",
              border: "1px solid #ccc",
              fontSize: "16px",
              outline: "none",
            }}
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginBottom: "20px" }}
        >
          Suscribirse
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;
