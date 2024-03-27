import React, { useEffect, useState, useRef } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CardArticles from "./CardArticles";
import ViewProduct from "../viewProduct/ViewProduct";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { Box, CircularProgress, Skeleton } from "@mui/material";

const ListArticlesDesktop = () => {
  const category = useParams();
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = useState([]);
  const [openProductView, setOpenProductView] = useState(false);
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const productCollection = collection(db, "products");
      const q = query(
        productCollection,
        where("category", "==", category.id),
        limit(10 * page) // Limitar la carga de productos por página
      );
      const snapShotProducts = await getDocs(q);
      const newArray = [];

      snapShotProducts.forEach((product) => {
        const name = product.data().name;
        const color = product.data().color;
        if (
          name &&
          color &&
          !newArray.some((item) => item.name === name && item.color === color)
        ) {
          newArray.push(product.data());
        }
      });

      setProducts(newArray);
      setLoading(false);
    };

    fetchData();
  }, [category, page]);

  useEffect(() => {
    window.scrollTo(0, 0); // Desplazar al inicio de la página
  }, []);

  // Función para cargar más productos cuando el usuario llegue al final de la página
  const handleScroll = () => {
    if (
      containerRef.current &&
      window.innerHeight + window.scrollY >=
        containerRef.current.offsetHeight &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {openProductView ? (
        <ViewProduct article={article} />
      ) : (
        <div
          ref={containerRef}
          style={{
            display: "flex",
            flexDirection: isNarrowScreen ? "column" : "row", // Cambiar a column si es una pantalla estrecha
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "1500px", // Aumenta el ancho máximo del contenedor si es necesario
            marginLeft: "auto",
            marginRight: "auto", // Centrar en la pantalla
            flexWrap: "wrap", // Asegurar que las tarjetas se envuelvan correctamente
            position: "relative", // Ajustar posición relativa para agregar el loading spinner
          }}
        >
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={350}
                  height={400}
                  style={{ margin: "1rem" }}
                />
              ))
            : products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    padding: "1rem",
                    width: isNarrowScreen ? "100%" : "350px", // Mostrar 4 tarjetas por fila en desktop
                    boxSizing: "border-box", // Asegurar que el padding no aumente el tamaño de las tarjetas
                  }}
                >
                  <CardArticles product={product} setArticle={setArticle} />
                </div>
              ))}
          {loading && (
            <Box
              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
            >
              <CircularProgress />
            </Box>
          )}
        </div>
      )}
    </div>
  );
};

export default ListArticlesDesktop;
