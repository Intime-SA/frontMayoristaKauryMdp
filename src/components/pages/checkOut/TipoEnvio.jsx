import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";

const TipoEnvio = () => {
  const [tipoEnvio, setTipoEnvio] = useState(0);
  const [local, setLocal] = useState(0);

  useEffect(() => {
    // Obtener el objeto userOrder del localStorage
    const userOrderJSON = localStorage.getItem("userOrder");

    // Verificar si hay un objeto almacenado
    if (userOrderJSON) {
      // Parsear la cadena JSON de vuelta a un objeto JavaScript
      const userOrder = JSON.parse(userOrderJSON);
      setLocal(userOrder.sucursal);

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
            fontFamily: '"Kanit", sans-serif',
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
              fontFamily: '"Kanit", sans-serif',
            }}
          >
            Andreani Estandar
          </h6>
          <h6
            style={{
              fontFamily: '"Kanit", sans-serif',
              fontSize: "50%",
              color: "grey",
              marginLeft: "1rem",
            }}
          >
            Llega en 3 días hábiles
          </h6>
        </div>
      </div>
    </>
  );

  const renderRetiroSucursal = (local) => (
    <>
      <div style={{ display: "flex", padding: "1rem", alignItems: "center" }}>
        <span className="material-symbols-outlined">location_on</span>
        <h6
          style={{
            marginLeft: "1rem",
            fontFamily: '"Kanit", sans-serif',
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
        <div style={{ maxWidth: "300px", flexGrow: 1 }}>
          <h6
            style={{
              margin: "1rem",
              fontFamily: '"Kanit", sans-serif',
            }}
          >
            <span style={{ color: "grey" }}>Punto de Retiro</span> - ( GRATIS )
          </h6>
          <h6
            style={{
              fontFamily: '"Kanit", sans-serif',
              fontSize: "50%",
              color: "grey",
              marginLeft: "1rem",
            }}
          >
            {local === 1 && (
              <>
                Showroom - José Mármol 970 timbre 104. Atención de lunes a
                sábados de 10 a 17hs. MAR DEL PLATA
              </>
            )}
            {local === 2 && (
              <>
                Showroom 2 - Rivadavia 5931. Planta alta A. TIMBRE ¨KAURY¨. De
                lunes a sabados de 10 a 17hs. MAR DEL PLATA
              </>
            )}
          </h6>
        </div>
      </div>
    </>
  );

  return (
    <div>
      {tipoEnvio === 1 && renderEnvioDomicilio()}

      <Divider />
      {tipoEnvio === 2 && renderRetiroSucursal(local)}
    </div>
  );
};

export default TipoEnvio;
