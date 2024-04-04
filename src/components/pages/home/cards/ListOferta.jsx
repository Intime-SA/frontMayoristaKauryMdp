import React, { useEffect, useState, useRef } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CardArticles from "./CardArticles";
import { db } from "../../../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  getDocsFromCache,
} from "firebase/firestore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const ListOferta = () => {
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = useState([]);
  const [oferta, setOferta] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productCollectionRef = collection(db, "products");
        const q = query(
          productCollectionRef,
          where("category", "==", "oferta")
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
        let productCount = 0;

        querySnapshot.forEach((doc) => {
          const productData = doc.data();
          if (productCount < 3) {
            newArray.push({ id: doc.id, ...productData });
            productCount++;
          }
        });

        // Verificar si se encontraron productos para la oferta
        if (newArray.length > 0) {
          setProducts(newArray);
          setOferta(true);
        } else {
          console.error(
            "No se encontraron productos para la categoría 'oferta'."
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProducts();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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

  const handlePrevClick = () => {
    sliderRef.current.slickPrev();
  };

  const handleNextClick = () => {
    sliderRef.current.slickNext();
  };

  if (isNarrowScreen) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginLeft: "1rem",
        }}
      >
        {products.map((product) => (
          <div key={product.id} style={{ marginBottom: "1rem" }}>
            <CardArticles product={product} oferta={oferta} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={handlePrevClick}
        style={{
          backgroundColor: "#c4072c",
          color: "white",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          border: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          position: "absolute",
          left: "10px",
        }}
      >
        <ArrowBack />
      </button>
      <div
        style={{
          width: "80%",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
        }}
      >
        <Slider {...settings} ref={sliderRef}>
          {products.map((product) => (
            <div key={product.id}>
              <div style={{ width: "100%", marginBottom: "1rem" }}>
                <CardArticles product={product} oferta={oferta} />
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <button
        onClick={handleNextClick}
        style={{
          backgroundColor: "#c4072c",
          color: "white",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          border: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          position: "absolute",
          right: "10px",
        }}
      >
        <ArrowForward />
      </button>
    </div>
  );
};

export default ListOferta;
