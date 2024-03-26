import React from "react";
import Typography from "@mui/material/Typography";

const EmptyCartMessage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <Typography
        variant="h4"
        style={{
          fontWeight: 600,
          fontFamily: '"Roboto Condensed", sans-serif',
          color: "#c4072c",
        }}
      >
        ¡Tu carrito está vacío!
      </Typography>
      <Typography
        variant="body1"
        style={{
          fontFamily: '"Roboto Condensed", sans-serif',
          marginTop: "1rem",
        }}
      >
        ¡Agrega algunos productos y comienza tu compra!
      </Typography>
    </div>
  );
};

export default EmptyCartMessage;
