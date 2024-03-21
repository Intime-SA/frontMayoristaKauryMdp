import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

const VerticalCarrusel = ({ article }) => {
  const [filteredArticules, setFilteredArticules] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  console.log(article);

  useEffect(() => {
    const fetchArticle = async () => {
      const collectionRef = collection(db, "products");
      const querySnapshot = await getDocs(collectionRef);

      const filteredArticles = [];

      querySnapshot.forEach((doc) => {
        if (doc.data().name === article.id) {
          const color = doc.data().color;
          // Verificar si el color ya está presente en filteredArticles
          if (color && !filteredArticles.some((item) => item.color === color)) {
            // Si el color no está presente, agregamos el objeto con la imagen y el color
            filteredArticles.push({
              image: doc.data().image,
              color: color,
            });
          }
        }
      });
      setFilteredArticules(filteredArticles);

      if (filteredArticles.length > 0 && !selectedImage) {
        setSelectedImage(filteredArticles[0].image);
      }
    };

    fetchArticle();
  }, [article]);

  console.log(filteredArticules);

  const handleImageClick = (image) => {
    console.log(image);
    setSelectedImage(image);
  };
  console.log(filteredArticules);

  return (
    <div style={styles.verticalCarousel}>
      <div style={styles.imageList}>
        {filteredArticules.map((item, index) => (
          <img
            key={index}
            src={item.image}
            alt={`Article ${index + 1}`}
            style={styles.imageThumbnail}
            onClick={() => handleImageClick(item.image)}
          />
        ))}
      </div>
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

export default VerticalCarrusel;

const styles = {
  verticalCarousel: {
    display: "flex",
    alignItems: "center",
  },
  imageList: {
    display: "flex",
    flexDirection: "column",
  },
  imageThumbnail: {
    width: "50px",
    height: "50px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  selectedImageContainer: {
    flex: 1,
    marginLeft: "20px",
  },
  selectedImage: {
    width: "30vw",
    height: "auto",
  },
};
