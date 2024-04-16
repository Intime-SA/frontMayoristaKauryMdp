import React, { useEffect, useState, useRef, useCallback } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CardArticles from "./CardArticles";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  getDocsFromCache,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { Typography } from "@mui/material";
import {
  LazyLoadComponent,
  LazyLoadImage,
} from "react-lazy-load-image-component";

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

      try {
        const productCollectionRef = collection(db, "products");
        const q = query(
          productCollectionRef,
          where("category", "==", category.id)
        );
        const cacheQuerySnapshot = await getDocsFromCache(q);
        let querySnapshot;

        if (cacheQuerySnapshot.empty) {
          console.log("Fetching data from Firebase...");
          querySnapshot = await getDocs(q);
        } else {
          console.log("Fetching data from cache...");
          querySnapshot = cacheQuerySnapshot;
        }

        const newArray = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const name = data.name;
          const color = data.color;
          if (name && !newArray.some((item) => item.name === name)) {
            newArray.push(data);
          }
        });

        setProducts(newArray);
        setLoading(false);
        setLoadingMore(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [category]);

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
            <LazyLoadComponent
              alt={product.name}
              effect="blur" // Efecto de carga
              width="100%"
              height={product.imageCard ? "400px" : "350px"} // Altura de la imagen
              style={{ borderRadius: "20px 20px 0 0", maxHeight: "400px" }}
              threshold={0}
            >
              <CardArticles
                product={product}
                setArticle={setArticleWithScrollPosition}
                oferta={oferta}
              />
            </LazyLoadComponent>
          </div>
        ))
      ) : (
        <Typography>No hay productos disponibles.</Typography>
      )}
    </div>
  );
};

export default ProductList;
