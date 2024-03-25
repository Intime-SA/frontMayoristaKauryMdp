import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";

const TipoEnvio = () => {
  const [tipoEnvio, setTipoEnvio] = useState(0);

  useEffect(() => {
    // Obtener el objeto userOrder del localStorage
    const userOrderJSON = localStorage.getItem("userOrder");

    // Verificar si hay un objeto almacenado
    if (userOrderJSON) {
      // Parsear la cadena JSON de vuelta a un objeto JavaScript
      const userOrder = JSON.parse(userOrderJSON);

      // Obtener el valor de tipoEnvio del objeto userOrder y establecerlo en el estado
      if (userOrder && userOrder.tipoEnvio) {
        setTipoEnvio(userOrder.tipoEnvio);
      }
    }
  }, []);

  console.log(tipoEnvio);
  const renderEnvioDomicilio = () => (
    <>
      <div style={{ display: "flex", padding: "1rem", alignItems: "center" }}>
        <span className="material-symbols-outlined">local_shipping</span>
        <h6
          style={{
            marginLeft: "1rem",
            fontFamily: '"Roboto Condensed", sans-serif',
          }}
        >
          Envío a domicilio
        </h6>
      </div>
      <div
        style={{
          borderRadius: "5px",
          border: "2px solid #c4072c",
          color: "#D27611",
          display: "flex",
          alignItems: "stretch",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#c4072c",
            flexBasis: "6%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
        <div style={{ flexGrow: 1 }}>
          <h6
            style={{
              margin: "1rem",
              fontFamily: '"Roboto Condensed", sans-serif',
            }}
          >
            Andreani Estandar "Envío a domicilio"
          </h6>
          <h6
            style={{
              fontFamily: '"Roboto Condensed", sans-serif',
              fontSize: "50%",
              color: "#e0e0e0",
              marginLeft: "1rem",
            }}
          >
            Llega en 3 días hábiles
          </h6>
        </div>
      </div>
    </>
  );

  const renderRetiroSucursal = () => (
    <>
      <div style={{ display: "flex", padding: "1rem", alignItems: "center" }}>
        <span className="material-symbols-outlined">location_on</span>
        <h6
          style={{
            marginLeft: "1rem",
            fontFamily: '"Roboto Condensed", sans-serif',
          }}
        >
          Retirar por
        </h6>
      </div>
      <div
        style={{
          borderRadius: "5px",
          border: "2px solid #c4072c",
          color: "#D27611",
          display: "flex",
          alignItems: "stretch",
          marginBottom: "1rem", // Alinear los elementos a lo largo de toda la altura
        }}
      >
        <div
          style={{
            backgroundColor: "#c4072c",
            flexBasis: "6%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Hacer que el primer div ocupe todo el espacio restante
          }}
        ></div>
        <div style={{ flexGrow: 1 }}>
          <h6
            style={{
              margin: "1rem",
              fontFamily: '"Roboto Condensed", sans-serif',
            }}
          >
            <span style={{ color: "grey" }}>Punto de Retiro</span> - ( GRATIS )
          </h6>
          <h6
            style={{
              fontFamily: '"Roboto Condensed", sans-serif',
              fontSize: "50%",
              color: "#e0e0e0",
              marginLeft: "1rem",
            }}
          >
            Inmediato
          </h6>
          <h6
            style={{
              fontFamily: '"Roboto Condensed", sans-serif',
              fontSize: "50%",
              color: "#e0e0e0",
              marginLeft: "1rem",
            }}
          ></h6>
        </div>
      </div>
    </>
  );

  return (
    <div>
      {tipoEnvio === 1 && renderEnvioDomicilio()}

      <Divider />
      {tipoEnvio === 2 && renderRetiroSucursal()}
    </div>
  );
};

export default TipoEnvio;
