import React from "react";
import Typography from "@mui/material/Typography";

const SelectProductMessage = () => {
  return (
    <div style={{ textAlign: "left", marginTop: "2rem", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography
          variant="body2"
          style={{
            fontFamily: '"Roboto Condensed", sans-serif',
            marginTop: "1rem",
            color: "grey",
          }}
        >
          <span style={{ fontSize: "100%" }} class="material-symbols-outlined">
            payments
          </span>{" "}
          El precio es pago en EFECTIVO
        </Typography>
      </div>

      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <Typography
          variant="body2"
          style={{
            fontFamily: '"Roboto Condensed", sans-serif',
            marginTop: "1rem",
            color: "grey",
          }}
        >
          <span style={{ fontSize: "100%" }} class="material-symbols-outlined">
            account_balance
          </span>{" "}
          Pago con transferencia tiene un 15% de recargo.
        </Typography>
      </div>
    </div>
  );
};

export default SelectProductMessage;
