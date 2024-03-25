import React, { useEffect, useState } from "react";
import { Divider, Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const DetallesPedido = ({ userOrder }) => {
  const [dataClient, setDataClient] = useState([]);

  useEffect(() => {
    const obtenerDatosCliente = async () => {
      try {
        const refCliente = doc(db, "users", userOrder.clienteId);
        const dataCliente = await getDoc(refCliente);
        if (dataCliente.exists()) {
          setDataClient(dataCliente.data());
        } else {
          console.log("No se encontraron datos para el cliente");
        }
      } catch (error) {
        console.error("Error al obtener datos del cliente:", error);
      }
    };

    obtenerDatosCliente();
  }, [userOrder.clienteId]);

  const renderDatosEnvio = () => {
    const iconColor = "#c4072c";
    const tituloStyle = { fontWeight: "bold" };
    const renderStyle = {
      color: "black",
      fontFamily: '"Roboto Condensed", sans-serif',
    };

    if (userOrder.tipoEnvio === 1) {
      return (
        <>
          <div style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
            <span
              className="material-symbols-outlined"
              style={{ color: iconColor }}
            >
              mail
            </span>
            <Typography
              variant="body2"
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
            >
              <span style={tituloStyle}>Email:</span>{" "}
              <span style={renderStyle}>{dataClient.email}</span>
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
            <span
              className="material-symbols-outlined"
              style={{ color: iconColor }}
            >
              storefront
            </span>
            <Typography
              variant="body2"
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
            >
              <span style={tituloStyle}>Dirección de Envío:</span>
              <br />
              <span style={renderStyle}>
                {userOrder.infoEntrega.calle}
              </span>{" "}
              <br />
              <span style={renderStyle}>
                CP: {userOrder.infoEntrega.codigoPostal}
                {", "}
              </span>
              <span style={renderStyle}>
                {userOrder.infoEntrega.provincia}
                {" - "}
              </span>
              <span style={renderStyle}>
                {"+54"}
                {dataClient.telefono}
              </span>
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
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
            >
              <span style={tituloStyle}>Precio Total:</span>{" "}
              <span style={renderStyle}>
                $
                {userOrder.total.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </Typography>
          </div>
        </>
      );
    } else if (userOrder.tipoEnvio === 2) {
      return (
        <>
          <div style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
            <span
              className="material-symbols-outlined"
              style={{ color: iconColor }}
            >
              storefront
            </span>
            <Typography
              variant="body2"
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
            >
              <span style={tituloStyle}>Punto de Retiro</span>
              <div>
                {userOrder.sucursal === 1 && (
                  <>
                    Showroom - José Mármol 970 timbre 104. Atención de lunes a
                    sábados de 10 a 17hs. MAR DEL PLATA
                  </>
                )}
                {userOrder.sucursal === 2 && (
                  <>
                    Showroom 2 - Rivadavia 5931. Planta alta A. TIMBRE ¨KAURY¨.
                    De lunes a sabados de 10 a 17hs. MAR DEL PLATA
                  </>
                )}
              </div>
            </Typography>
          </div>
          <Divider />
          <div style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
            <Typography
              variant="body2"
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: iconColor }}
              >
                chat_bubble
              </span>
              <div>
                <span style={tituloStyle}>Notas de Pedido:</span>{" "}
                <span style={renderStyle}>{userOrder.note}</span>
              </div>
            </Typography>
          </div>
          <Divider />
          <div style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
            <Typography
              variant="body2"
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: iconColor }}
              >
                task
              </span>
              <br />
              <span style={tituloStyle}>Datos de Facturacion:</span>
              <br />
              <span style={renderStyle}>Consumidor Final</span>
              <br />
              <span style={renderStyle}>
                {userOrder.infoEntrega.calle}
              </span>{" "}
              <br />
              <span style={renderStyle}>
                CP: {userOrder.infoEntrega.codigoPostal}
                {", "}
              </span>
              <span style={renderStyle}>
                {userOrder.infoEntrega.provincia}
                {" - "}
              </span>
              <span style={renderStyle}>
                {"+54"}
                {dataClient.telefono}
              </span>
            </Typography>
          </div>
          <Divider />

          <div style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
            <Typography
              variant="body2"
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
            >
              <span style={tituloStyle}>Precio Total:</span>{" "}
              <span style={renderStyle}>
                $
                {userOrder.total.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </Typography>
          </div>
        </>
      );
    } else {
      return <div>Tipo de envío no válido</div>;
    }
  };

  return (
    <div
      style={{ margin: "1rem", border: "1px solid #ccc", borderRadius: "10px" }}
    >
      {renderDatosEnvio()}
    </div>
  );
};

export default DetallesPedido;
