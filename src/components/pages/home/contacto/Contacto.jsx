import { useMediaQuery } from "@mui/material";
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
        if (doc.data().status === true) {
          const dataCategoria = doc.data();
          const id = doc.id; // Obtener el ID del documento
          categoriasArray.push({ id, ...dataCategoria }); // Agregar el ID a los datos de la categoría
        }
      });

      setCategory(categoriasArray);
    };

    fetchData();
  }, []);

  const styles = {
    fontFamily: '"Kanit", sans-serif',
    backgroundColor: "#f0f0f0",
    color: "#333",
    fontSize: "16px", // Ajusta el tamaño de fuente según tus necesidades
    // Otros estilos que necesites
  };

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
        fontFamily: '"Kanit", sans-serif', // Fuente para todo el componente
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
                  fontSize: isNarrowScreen ? "0.8rem" : "1.2rem",
                  color: "#c4072c",
                  textAlign: isNarrowScreen ? "center" : "left",
                  fontFamily: '"Kanit", sans-serif',
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
            alignItems: "flex-start",
            marginTop: "3rem",
            fontFamily: '"Kanit", sans-serif',
          }}
        >
          <Link
            variant="outlined"
            style={{
              margin: isNarrowScreen ? "0.5rem" : "1rem",
              fontSize: isNarrowScreen ? "0.7rem" : "1.2rem",
              color: "#c4072c",
              textAlign: isNarrowScreen ? "center" : "left",
              fontFamily: '"Kanit", sans-serif',
            }}
          >
            <span
              style={{ fontSize: isNarrowScreen ? "1rem" : "1.3rem" }}
              className="material-symbols-outlined"
            >
              call
            </span>{" "}
            +54 (223) 348-5438
          </Link>

          <Link
            variant="outlined"
            style={{
              margin: isNarrowScreen ? "0.5rem" : "1rem",
              fontSize: isNarrowScreen ? "0.7rem" : "1.2rem",
              color: "#c4072c",
              textAlign: isNarrowScreen ? "center" : "left",
              fontFamily: '"Kanit", sans-serif',
            }}
          >
            <span
              style={{ fontSize: isNarrowScreen ? "1rem" : "1.3rem" }}
              className="material-symbols-outlined"
            >
              mail
            </span>{" "}
            kaurymdp.store@gmail.com
          </Link>

          <Link
            to="https://maps.app.goo.gl/v5xmxXnhAXRHyeAc8"
            variant="outlined"
            style={{
              margin: "0.5rem",
              fontSize: isNarrowScreen ? "0.7rem" : "1.2rem",
              color: "#c4072c",
              textAlign: isNarrowScreen ? "center" : "left",
              maxWidth: isNarrowScreen ? "375px" : "100%",
              margin: isNarrowScreen ? "0.5rem" : "1rem",
              fontFamily: '"Kanit", sans-serif',
            }}
          >
            <span
              style={{ fontSize: isNarrowScreen ? "1rem" : "1.3rem" }}
              className="material-symbols-outlined"
            >
              location_on
            </span>{" "}
            Jose Mármol 970, timbre 104 de 10 a 17hs, Mar del Plata
          </Link>
          <Link
            to="https://maps.app.goo.gl/gUDvuRrCas3q1ioQ9"
            variant="outlined"
            style={{
              margin: "0.5rem",
              fontSize: isNarrowScreen ? "0.7rem" : "1.2rem",
              color: "#c4072c",
              textAlign: isNarrowScreen ? "center" : "left",
              maxWidth: isNarrowScreen ? "375px" : "100%",
              margin: isNarrowScreen ? "0.5rem" : "1rem",
              fontFamily: '"Kanit", sans-serif',
            }}
          >
            <span
              style={{ fontSize: isNarrowScreen ? "1rem" : "1.3rem" }}
              className="material-symbols-outlined"
            >
              location_on
            </span>{" "}
            Rivadavia 5931, Planta Alta A de 10 a 17hs, Mar del Plata
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
