import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CardArticles from "./CardArticles";
import ViewProduct from "../viewProduct/ViewProduct";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ListArticlesDesktop = () => {
  const category = useParams();
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = useState([]);
  const [openProductView, setOpenProductView] = useState(false);
  const [article, setArticle] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const productCollection = collection(db, "products");
      const q = query(productCollection, where("category", "==", category.id));
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
    };

    fetchData();
  }, [category]);

  useEffect(() => {
    window.scrollTo(0, 0); // Desplazar al inicio de la página
  }, [products]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {openProductView ? (
        <ViewProduct article={article} />
      ) : (
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            marginTop: "10rem",
            marginLeft: "3rem", // Espacio a la izquierda para centrar en versión de escritorio
          }}
        >
          {isNarrowScreen || products.length <= 1 ? (
            // Mostrar las tarjetas individualmente si la pantalla es estrecha o si hay 3 o menos productos
            products.map((product) => (
              <CardArticles
                key={product.id}
                product={product}
                setArticle={setArticle}
              />
            ))
          ) : (
            <Slider {...settings}>
              {/* Mostrar el Slider solo si hay más de 3 productos */}
              {products.map((product) => (
                <div key={product.id}>
                  <CardArticles product={product} setArticle={setArticle} />
                </div>
              ))}
            </Slider>
          )}
        </div>
      )}
    </div>
  );
};

export default ListArticlesDesktop;
