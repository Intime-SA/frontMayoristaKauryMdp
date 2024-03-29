import React, { useEffect, useState, useRef, useCallback } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CardArticles from "./CardArticles";
import ViewProduct from "../viewProduct/ViewProduct";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
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
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const [categoriaName, setCategoriaName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const productCollection = collection(db, "products");
      const q = query(
        productCollection,
        where("category", "==", category.id),
        limit(1 + page)
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
    const fetchCategory = async () => {
      const categoryCollection = collection(db, "categorys");
      const querySnapshot = await getDocs(categoryCollection);

      querySnapshot.forEach((doc) => {
        if (doc.id === category.id) {
          setCategoriaName(doc.data().name);
        }
      });
    };

    fetchCategory();
  }, [category.id]);

  useEffect(() => {
    const storedPage = localStorage.getItem("page");
    if (storedPage) {
      setPage(parseInt(storedPage));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        containerRef.current &&
        window.innerHeight + window.scrollY >= containerRef.current.offsetHeight
      ) {
        setPage((prevPage) => {
          localStorage.setItem("page", prevPage + 1);

          return prevPage + 1;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const prevCategory = localStorage.getItem("category");
    if (prevCategory !== category.id) {
      localStorage.removeItem("scrollPosition");
      localStorage.setItem("category", category.id);
    }

    const storedScrollPosition = localStorage.getItem("scrollPosition");
    if (storedScrollPosition !== null) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(storedScrollPosition));
      }, 1000); // Retraso de 1 segundo
    } else {
      // Si no hay nada en scrollPosition, llevar al usuario al top de la página
      window.scrollTo(0, 0);
    }

    // Verificar si el category ha cambiado
  }, [category.id]);

  const setArticleWithScrollPosition = useCallback((article) => {
    localStorage.setItem("scrollPosition", window.scrollY);
    setArticle(article);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        margin: "0 auto",
        marginLeft: "0.5rem",
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
          {loading ? (
            <CircularProgressWithLabel />
          ) : products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                style={{
                  width: isNarrowScreen ? "100%" : "350px",
                  boxSizing: "border-box",
                }}
              >
                <CardArticles
                  product={product}
                  setArticle={setArticleWithScrollPosition}
                />
              </div>
            ))
          ) : (
            <Typography>No hay productos disponibles.</Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default ListArticlesDesktop;
