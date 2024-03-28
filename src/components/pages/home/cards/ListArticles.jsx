import React, { useEffect, useState, useRef } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CardArticles from "./CardArticles";
import ViewProduct from "../viewProduct/ViewProduct";
import CircularProgressWithLabel from "./CircularProgressWithLabel"; // Importa tu componente CircularProgressWithLabel aquí
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { Typography } from "@mui/material";

const ListArticlesDesktop = () => {
  const category = useParams();
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = useState([]);
  const [openProductView, setOpenProductView] = useState(false);
  const [article, setArticle] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); // Estado para controlar si se están cargando los productos
  const containerRef = useRef(null);
  const [categoriaName, setCategoriaName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const productCollection = collection(db, "products");
      const q = query(
        productCollection,
        where("category", "==", category.id),
        limit(1 * page)
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
      setLoading(false); // Cuando se completa la carga de productos, cambia el estado de loading a false
    };

    fetchData();
  }, [category, page]);

  useEffect(() => {
    const fetchCategory = async () => {
      const categoryCollection = collection(db, "categorys");
      const querySnapshot = await getDocs(categoryCollection);

      querySnapshot.forEach((doc) => {
        // Aquí comparamos el id del documento con el id deseado
        if (doc.id === category.id) {
          // Si el id coincide, establecemos el nombre de la categoría
          setCategoriaName(doc.data().name);
        }
      });
    };

    fetchCategory();
  }, [category.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleScroll = () => {
    if (
      containerRef.current &&
      window.innerHeight + window.scrollY >= containerRef.current.offsetHeight
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
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
        marginLeft: "0.5rem", // Para centrar horizontalmente
        padding: "0px",
      }}
    >
      <div>
        <Typography variant="body2" sx={{ marginTop: "1rem", color: "grey" }}>
          Inicio > {categoriaName}
        </Typography>
      </div>
      {openProductView ? (
        <ViewProduct article={article} />
      ) : (
        <div
          ref={containerRef}
          style={{
            display: "flex",
            flexDirection: isNarrowScreen ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "1500px",
            marginLeft: "auto",
            marginRight: "auto",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          {loading ? ( // Si se están cargando los productos, renderiza CircularProgressWithLabel
            <CircularProgressWithLabel />
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                style={{
                  width: isNarrowScreen ? "100%" : "350px",
                  boxSizing: "border-box",
                }}
              >
                <CardArticles product={product} setArticle={setArticle} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ListArticlesDesktop;
