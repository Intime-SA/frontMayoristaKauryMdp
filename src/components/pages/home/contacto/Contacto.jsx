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
        height: isNarrowScreen ? "80vh" : "60vh", // Cambiar el orden en dispositivos móviles
        width: "100%",
        margin: "0px",
        display: "flex",
        justifyContent: isNarrowScreen ? "center" : "space-around",
        alignItems: isNarrowScreen ? "center" : "flex-start",
        paddingTop: "3%",
        flexDirection: isNarrowScreen ? "column" : "row", // Cambiar el orden en dispositivos móviles
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "space-between",
          marginTop: "1rem",
        }}
      >
        <Typography
          variant="p"
          gutterBottom
          style={{
            marginBottom: "0.5rem",
            fontSize: isNarrowScreen ? "20%" : "60%",
            fontWeight: 600,
            color: "#c4072c",
          }}
        >
          Categorias
        </Typography>
        <div>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {category.map((cat, index) => (
              <li key={cat.id}>
                <Link
                  to={`/listArticles/${cat.id}`}
                  variant="outlined"
                  style={{
                    margin: "0.5rem",
                    color: "#c4072c",
                    fontSize: isNarrowScreen ? "25%" : "50%",
                  }}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column",
            alignItems: "flex-start",
            height: "20vh",
            marginTop: "2%",
          }}
        >
          <Typography
            variant="p"
            gutterBottom
            style={{
              fontSize: isNarrowScreen ? "20%" : "60%",
              fontWeight: 600,
              color: "#c4072c",
            }}
          >
            Contactános
          </Typography>
          <Typography
            variant="p"
            style={{
              color: "#c4072c",
              fontSize: isNarrowScreen ? "20%" : "60%",
            }}
          >
            <span
              style={{
                fontSize: isNarrowScreen ? "130%" : "80%",
              }}
              className="material-symbols-outlined"
            >
              call
            </span>
            <Typography
              variant="p"
              style={{
                color: "#c4072c",
                fontSize: isNarrowScreen ? "130%" : "80%",
                marginLeft: "1rem",
              }}
            >
              +54 (223) 348-5438
            </Typography>
          </Typography>
          <Typography
            variant="p"
            style={{
              color: "#c4072c",
              fontSize: isNarrowScreen ? "20%" : "60%",
            }}
          >
            <span
              style={{
                fontSize: isNarrowScreen ? "130%" : "80%",
              }}
              className="material-symbols-outlined"
            >
              mail
            </span>
            <Typography
              variant="p"
              style={{
                color: "#c4072c",
                fontSize: isNarrowScreen ? "130%" : "80%",
                marginLeft: "1rem",
              }}
            >
              kaurymdp.store@gmail.com
            </Typography>
          </Typography>
          <Typography
            variant="p"
            style={{
              color: "#c4072c",
              fontSize: isNarrowScreen ? "20%" : "60%",
            }}
          >
            <span
              style={{
                fontSize: isNarrowScreen ? "130%" : "80%",
              }}
              className="material-symbols-outlined"
            >
              location_on
            </span>
            <Typography
              variant="p"
              style={{
                color: "#c4072c",
                fontSize: isNarrowScreen ? "130%" : "60%",
                marginLeft: "1rem",
              }}
            >
              Jose marmol 970 timbre 104 de 10 a 17hs, Mar del Plata
            </Typography>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
