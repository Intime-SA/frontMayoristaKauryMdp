import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HorizontalCarrusel = ({ article }) => {
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const collectionRef = collection(db, "products");
      const querySnapshot = await getDocs(collectionRef);

      const articles = [];

      querySnapshot.forEach((doc) => {
        if (doc.data().name === article.id) {
          const color = doc.data().color;
          if (color && !articles.some((item) => item.color === color)) {
            articles.push({
              image: doc.data().image,
              color: color,
            });
          }
        }
      });

      setFilteredArticles(articles);
    };

    fetchArticles();
  }, [article]);

  return (
    <div
      style={{
        marginTop: "-5rem",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginBottom: " 1rem",
      }}
    >
      <Slider
        dots={true}
        infinite={true}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay={true}
        autoplaySpeed={3000}
        arrows={false} // Oculta las flechas de navegación
        adaptiveHeight={true} // Ajusta la altura del contenedor al contenido
      >
        {filteredArticles.map((item, index) => (
          <div key={index} style={{ height: "600px" }}>
            <img
              src={item.image}
              alt={`Article img`}
              style={{ width: "100%", height: "600px", objectFit: "contain" }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HorizontalCarrusel;
