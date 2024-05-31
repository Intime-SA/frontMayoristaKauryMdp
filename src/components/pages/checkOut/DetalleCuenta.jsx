import React from "react";
import { Divider, Typography } from "@mui/material";

const DetalleCuenta = () => {
  const renderDatosBancarios = () => {
    const iconColor = "#c4072c";
    const tituloStyle = { fontWeight: "bold" };
    const renderStyle = {
      color: "black",
      fontFamily: '"Kanit", sans-serif',
    };

    return (
      <>
        <div style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
          <span
            className="material-symbols-outlined"
            style={{ color: iconColor }}
          >
            account_balance
          </span>
          <Typography
            variant="body2"
            style={{ fontFamily: '"Kanit", sans-serif' }}
          >
            <span style={tituloStyle}>Alias a transferir:</span>{" "}
            <span style={renderStyle}>KAURYMAYORISTA</span>
          </Typography>
          <Divider
            variant="middle"
            style={{
              width: "90%",
              marginTop: "5px",
              backgroundColor: "transparent",
            }}
          />
        </div>

        <div style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
          <Typography
            variant="body2"
            style={{ fontFamily: '"Kanit", sans-serif' }}
          >
            <span style={tituloStyle}>CBU:</span>{" "}
            <span style={renderStyle}>0000003100037054721391</span>
          </Typography>
          <Divider
            variant="middle"
            style={{
              width: "90%",
              marginTop: "5px",
              backgroundColor: "transparent",
            }}
          />
        </div>

        <div style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
          <Typography
            variant="body2"
            style={{ fontFamily: '"Kanit", sans-serif' }}
          >
            <span style={tituloStyle}>Titular de cuenta:</span>{" "}
            <span style={renderStyle}>RODOLFO GUILLERMO OTERO</span>
          </Typography>
          <Divider
            variant="middle"
            style={{
              width: "90%",
              marginTop: "5px",
              backgroundColor: "transparent",
            }}
          />
        </div>

        <div style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
          <Typography
            variant="body2"
            style={{ fontFamily: '"Kanit", sans-serif' }}
          >
            Te enviamos un correo electronico con el detalle de tu compra!
          </Typography>
          <Typography
            variant="body2"
            style={{ fontFamily: '"Kanit", sans-serif' }}
          >
            Recorda enviar el <strong>comprobante de pago</strong> +{" "}
            <strong>número de orden</strong> al WhatsApp (223) 348-5438
          </Typography>
        </div>
      </>
    );
  };

  return (
    <div
      style={{ margin: "1rem", border: "1px solid #ccc", borderRadius: "10px" }}
    >
      {renderDatosBancarios()}
    </div>
  );
};

export default DetalleCuenta;
