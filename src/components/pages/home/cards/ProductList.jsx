import React, { useEffect, useState, useRef, useCallback } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CardArticles from "./CardArticles";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { Typography } from "@mui/material";

const ProductList = () => {
  const category = useParams();
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [oferta, setOferta] = useState(false);
  const [article, setArticle] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingMore(true);
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
      setLoadingMore(false);
    };

    fetchData();
  }, [category, page]);

  useEffect(() => {
    const prevCategory = localStorage.getItem("category");
    if (category.id === "oferta") {
      setOferta(true);
    }
    if (prevCategory !== category.id) {
      localStorage.removeItem("page");
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

  const setArticleWithScrollPosition = useCallback(() => {
    localStorage.setItem("scrollPosition", window.scrollY);
    setArticle(article);
  }, []);

  useEffect(() => {
    const storedPage = localStorage.getItem("page");
    if (storedPage) {
      setPage(parseInt(storedPage));
    }
  }, []);

  const handleScroll = () => {
    if (
      containerRef.current &&
      window.innerHeight + window.scrollY >=
        containerRef.current.offsetHeight &&
      !loadingMore
    ) {
      setPage((prevPage) => {
        localStorage.setItem("page", prevPage + 1);
        return prevPage + 1;
      });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadingMore]);

  return (
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
        marginLeft: "1rem",
      }}
    >
      {loading ? (
        <CircularProgressWithLabel />
      ) : products.length > 0 ? (
        products.map((product, index) => (
          <div
            key={index}
            style={{
              width: isNarrowScreen ? "100%" : "350px",
              boxSizing: "border-box",
            }}
          >
            <CardArticles
              product={product}
              setArticle={setArticleWithScrollPosition}
              oferta={oferta}
            />
          </div>
        ))
      ) : (
        <Typography>No hay productos disponibles.</Typography>
      )}
    </div>
  );
};

export default ProductList;