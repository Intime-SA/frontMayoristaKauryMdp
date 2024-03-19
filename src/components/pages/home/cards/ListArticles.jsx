import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CardOfert from "./CardOfert";
import { db } from "../../../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardArticles from "./CardArticles";
import ViewProduct from "../viewProduct/ViewProduct";
import { useParams } from "react-router-dom";

const ListArticles = () => {
  const category = useParams();
  console.log(category);
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
        newArray.push(product.data());
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
    slidesToShow: isNarrowScreen ? 1 : 3, // Cambiar el número de tarjetas según la pantalla
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
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      {openProductView ? (
        <ViewProduct article={article} />
      ) : (
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            marginLeft: isNarrowScreen ? "0rem" : "row",
            marginTop: "10rem", // Si es una pantalla estrecha, centrar los elementos, de lo contrario, espacio alrededor
          }}
        >
          {!isNarrowScreen ? (
            <div style={{ top: "30rem" }}>
              <Slider {...settings}>
                {products.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      width: "100%",
                      maxWidth: "800px",
                    }}
                  >
                    <CardArticles product={product} setArticle={setArticle} />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <div style={{ marginLeft: "3rem" }}>
              <Slider {...settings}>
                {products.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      width: "100%",
                      maxWidth: "800px",
                    }}
                  >
                    <CardArticles product={product} setArticle={setArticle} />
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListArticles;
