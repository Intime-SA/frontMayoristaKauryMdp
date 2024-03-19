import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

const VerticalCarrusel = ({ article }) => {
  const [filteredArticules, setFilteredArticules] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const collectionRef = collection(db, "articules");
      const querySnapshot = await getDocs(collectionRef);

      const filteredArticles = [];

      querySnapshot.forEach((doc) => {
        if (doc.id === article.id) {
          filteredArticles.push(doc.data().image);
        }
      });
      setFilteredArticules(filteredArticles);
    };

    fetchArticle();
  }, [article]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div style={styles.verticalCarousel}>
      <div style={styles.imageList}>
        {filteredArticules[0].map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index}`}
            style={styles.imageThumbnail}
            onClick={() => handleImageClick(image)}
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
    width: "100%",
    height: "auto",
  },
};
