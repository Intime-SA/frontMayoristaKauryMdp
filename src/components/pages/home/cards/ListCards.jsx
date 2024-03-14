import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CardHome from "./CardHome";
import { db } from "../../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const ListCards = () => {
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm")); // Verificar si el ancho de la pantalla es menor que 'sm' (600px)
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(db, "categorys");
        const querySnapshot = await getDocs(categoryCollection);
        const categoriesData = [];

        querySnapshot.forEach((doc) => {
          if (doc.data().status === true && doc.id !== "oferta") {
            const category = { id: doc.id, ...doc.data() };
            categoriesData.push(category);
          }
        });

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, [categories]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "5rem",
        marginBottom: "5rem",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isNarrowScreen ? "column" : "row", // Si es una pantalla estrecha, centrar los elementos, de lo contrario, espacio alrededor
          width: "100%",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {categories.map((category) => (
          <CardHome
            key={category.id}
            categoryNombre={category.name}
            categoryImage={category.image}
          />
        ))}
      </div>
    </div>
  );
};

export default ListCards;
