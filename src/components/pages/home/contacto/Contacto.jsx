import { Button, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { Link } from "react-router-dom";

const Contacto = () => {
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const categorias = collection(db, "categorys");
      const querySnapshot = await getDocs(categorias);
      const categoriasArray = [];
      querySnapshot.forEach((doc) => {
        const dataCategoria = doc.data();
        const id = doc.id; // Obtener el ID del documento
        categoriasArray.push({ id, ...dataCategoria }); // Agregar el ID a los datos de la categoría
      });
      setCategory(categoriasArray);
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "rgba(175, 155, 144, 0.21)",
        height: "auto",
        paddingBottom: "1rem",
        paddingTop: "1rem",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: isNarrowScreen ? "column" : "row",
        color: "#c4072c", // Color para todo el componente
        fontFamily: '"Roboto Condensed", sans-serif', // Fuente para todo el componente
      }}
    >
      {/* Renderizar categorías */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: isNarrowScreen ? "center" : "space-around",
          alignItems: isNarrowScreen ? "center" : "flex-start",
          width: "50%",
        }}
      >
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            alignItems: isNarrowScreen ? "center" : "flex-start",
          }}
        >
          {category.map((cat, index) => (
            <li
              key={cat.id}
              style={{
                textAlign: isNarrowScreen ? "center" : "left",
                margin: isNarrowScreen ? "0.5rem" : "1rem",
              }}
            >
              <Link
                to={`/listArticles/${cat.id}`}
                variant="outlined"
                style={{
                  marginTop: "0.5rem",
                  fontSize: isNarrowScreen ? "0.8rem" : "1rem",
                  color: "#c4072c",
                  textAlign: isNarrowScreen ? "center" : "left",
                }}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Renderizar información de contacto */}
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: isNarrowScreen ? "center" : "flex-start",
            marginTop: "3rem",
          }}
        >
          <Link
            variant="outlined"
            style={{
              margin: isNarrowScreen ? "0.5rem" : "1rem",
              fontSize: isNarrowScreen ? "1rem" : "1rem",
              color: "#c4072c",
              textAlign: isNarrowScreen ? "center" : "left",
            }}
          >
            <span className="material-symbols-outlined">call</span> +54 (223)
            348-5438
          </Link>

          <Link
            variant="outlined"
            style={{
              margin: isNarrowScreen ? "0.5rem" : "1rem",
              fontSize: isNarrowScreen ? "1rem" : "1rem",
              color: "#c4072c",
              textAlign: isNarrowScreen ? "center" : "left",
            }}
          >
            <span className="material-symbols-outlined">mail</span>{" "}
            kaurymdp.store@gmail.com
          </Link>

          <Link
            to="https://maps.app.goo.gl/v5xmxXnhAXRHyeAc8"
            variant="outlined"
            style={{
              margin: "0.5rem",
              fontSize: isNarrowScreen ? "1rem" : "1rem",
              color: "#c4072c",
              textAlign: isNarrowScreen ? "center" : "left",
              maxWidth: isNarrowScreen ? "375px" : "100%",
              margin: isNarrowScreen ? "0.5rem" : "1rem",
            }}
          >
            <span className="material-symbols-outlined">location_on</span> Jose
            Mármol 970, timbre 104 de 10 a 17hs, Mar del Plata
          </Link>
          <Link
            to="https://maps.app.goo.gl/v5xmxXnhAXRHyeAc8"
            variant="outlined"
            style={{
              margin: "0.5rem",
              fontSize: isNarrowScreen ? "1rem" : "1rem",
              color: "#c4072c",
              textAlign: isNarrowScreen ? "center" : "left",
              maxWidth: isNarrowScreen ? "375px" : "100%",
              margin: isNarrowScreen ? "0.5rem" : "1rem",
            }}
          >
            <span className="material-symbols-outlined">location_on</span> Jose
            Rivadavia 5931, planta alta A de 10 a 17hs, Mar del Plata
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
