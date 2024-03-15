import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CardOfert from "./CardOfert";
import { db } from "../../../../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ListOferta = () => {
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Obtener la referencia a la categoría "oferta" desde Firebase
        const categoryRef = doc(db, "categorys", "oferta");
        const categorySnapshot = await getDoc(categoryRef);

        if (categorySnapshot.exists()) {
          const categoryData = categorySnapshot.data();
          // Obtener la referencia de la categoría desde la referencia de Firebase
          const categoryReference = categoryData.category;

          // Si la categoría "oferta" existe, obtenemos todos los productos de esa categoría
          const productCollection = collection(db, "products");
          const querySnapshot = await getDocs(productCollection);
          const productsData = [];

          querySnapshot.forEach((product) => {
            const productData = product.data();
            if (productData.category == "oferta") {
              console.log(productData);
              productsData.push({ id: product.id, ...productData });
            }
          });

          setProducts(productsData);
        } else {
          console.error("La categoría 'oferta' no existe.");
        }
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2, // Número de tarjetas que deseas mostrar en el carrusel
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

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          marginLeft: isNarrowScreen ? "0rem" : "row", // Si es una pantalla estrecha, centrar los elementos, de lo contrario, espacio alrededor
        }}
      >
        <Slider {...settings}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                width: "100%",
                maxWidth: "800px",
                marginLeft: isNarrowScreen ? "3rem" : "row", // Si es una pantalla estrecha, centrar los elementos, de lo contrario, espacio alrededor
              }}
            >
              <CardOfert product={product} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ListOferta;
