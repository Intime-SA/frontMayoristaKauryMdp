import React, { useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import VerticalCarrusel from "./VerticalCarrusel";
import SelectProduct from "./SelectProduct";
import { useParams } from "react-router-dom";
import HorizontalCarrusel from "./HorizontalCarrusel";

const ViewProduct = () => {
  const article = useParams();
  const isMobile = useMediaQuery("(max-width:760px)");

  useEffect(() => {
    window.scrollTo(0, 0); // Desplazar al inicio de la página
  }, [article]);

  return (
    <div style={{ width: "100%", justifyContent: "center" }}>
      {isMobile ? (
        // Mostrar componentes uno encima del otro en dispositivos móviles
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <HorizontalCarrusel article={article} />
          <SelectProduct article={article} />
        </div>
      ) : (
        // Mostrar componentes uno al lado del otro en pantallas más grandes
        <div style={{ display: "flex", justifyContent: "center" }}>
          <VerticalCarrusel article={article} />
          <SelectProduct article={article} />
        </div>
      )}
    </div>
  );
};

export default ViewProduct;
