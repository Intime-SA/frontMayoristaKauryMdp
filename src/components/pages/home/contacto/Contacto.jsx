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
        categoriasArray.push(dataCategoria);
      });
      setCategory(categoriasArray);
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "rgba(175, 155, 144, 0.21)",
        height: "50vh",
        width: "100%",
        margin: "0px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        paddingTop: "2%",
      }}
    >
      <div>
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
              <li>
                <Link
                  to="/products"
                  variant="outlined"
                  style={{
                    margin: "0.5rem",
                    color: "#c4072c",
                    fontSize: "50%",
                  }}
                >
                  {cat.name}{" "}
                  {/* Suponiendo que el nombre de la categoría está almacenado en la propiedad "nombre" */}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "space-around",
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
          Contactános
        </Typography>
        <Typography variant="p" style={{ color: "#c4072c", fontSize: "60%" }}>
          <span style={{ marginTop: "1rem" }} class="material-symbols-outlined">
            call
          </span>
          <Typography
            variant="p"
            style={{
              color: "#c4072c",
              fontSize: "40%%",
              marginLeft: "1rem",
              marginTop: "1rem",
            }}
          >
            +54 (223) 348-5438
          </Typography>
        </Typography>
        <Typography variant="p" style={{ color: "#c4072c", fontSize: "60%" }}>
          <span style={{ marginTop: "1rem" }} class="material-symbols-outlined">
            mail
          </span>
          <Typography
            variant="p"
            style={{ color: "#c4072c", fontSize: "40%%", marginLeft: "1rem" }}
          >
            kaurymdp.store@gmail.com
          </Typography>
        </Typography>
        <Typography variant="p" style={{ color: "#c4072c", fontSize: "60%" }}>
          <span style={{ marginTop: "1rem" }} class="material-symbols-outlined">
            location_on
          </span>
          <Typography
            variant="p"
            style={{ color: "#c4072c", fontSize: "40%%", marginLeft: "1rem" }}
          >
            Jose marmol 970 timbre 104 de 10 a 17hs, Mar del Plata
          </Typography>
        </Typography>
      </div>
    </div>
  );
};

export default Contacto;
