import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HorizontalCarrusel = ({ article }) => {
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      const collectionRef = collection(db, "products");
      const querySnapshot = await getDocs(collectionRef);

      const filteredArticles = [];

      querySnapshot.forEach((doc) => {
        if (doc.data().name === article.id) {
          const color = doc.data().color;
          if (color && !filteredArticles.some((item) => item.color === color)) {
            filteredArticles.push({
              image: doc.data().image,
              color: color,
            });
          }
        }
      });

      setFilteredArticles(filteredArticles);

      if (filteredArticles.length > 0 && !selectedImage) {
        setSelectedImage(filteredArticles[0].image);
      }
    };

    fetchArticles();
  }, [article]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div style={styles.horizontalCarrusel}>
      <Slider {...settings}>
        {filteredArticles.map((item, index) => (
          <div key={index} style={{ padding: "0 10px" }}>
            <img
              src={item.image}
              alt={`Article ${index + 1}`}
              style={styles.imageThumbnail}
              onClick={() => handleImageClick(item.image)}
            />
          </div>
        ))}
      </Slider>
      <div style={styles.selectedImageContainer}>
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected Image"
            style={styles.selectedImage}
          />
        )}
      </div>
    </div>
  );
};

export default HorizontalCarrusel;

const styles = {
  horizontalCarrusel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  imageThumbnail: {
    width: "80%",
    height: "auto",
    cursor: "pointer",
    borderRadius: "0.2rem",
  },
  selectedImageContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedImage: {
    maxWidth: "90%",
    height: "auto",
    borderRadius: "30px",
  },
};
