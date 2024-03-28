import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import Skeleton from "@mui/material/Skeleton";

const VerticalCarrusel = ({ article }) => {
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
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
      setImagesLoaded(false); // Reiniciar el estado de carga de imágenes

      if (filteredArticles.length > 0) {
        setSelectedImage(filteredArticles[0].image); // Seleccionar la primera imagen
      }
    };

    fetchArticle();
  }, [article]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  useEffect(() => {
    setImagesLoaded(true); // Marcar las imágenes como cargadas al actualizar el artículo
  }, [selectedImage]);

  return (
    <div style={styles.verticalCarousel}>
      <div style={styles.imageList}>
        {!imagesLoaded && (
          <div>
            <Skeleton
              sx={{
                bgcolor: "grey.400",
                marginBottom: "1rem",
                borderRadius: "0.2rem",
              }}
              variant="rectangular"
              width={210}
              height={118}
            />
            <Skeleton
              sx={{
                bgcolor: "grey.400",
                marginBottom: "1rem",
                borderRadius: "0.2rem",
              }}
              variant="rectangular"
              width={210}
              height={118}
            />
            <Skeleton
              sx={{
                bgcolor: "grey.400",
                marginBottom: "1rem",
                borderRadius: "0.2rem",
              }}
              variant="rectangular"
              width={210}
              height={118}
            />
            <Skeleton
              sx={{
                bgcolor: "grey.400",
                marginBottom: "1rem",
                borderRadius: "0.2rem",
              }}
              variant="rectangular"
              width={210}
              height={118}
            />
          </div>
        )}
        {filteredArticles.map((item, index) => (
          <img
            key={index}
            src={item.image}
            alt={`Article ${index + 1}`}
            style={styles.imageThumbnail}
            onClick={() => handleImageClick(item.image)}
            onLoad={() => setImagesLoaded(true)} // Marca la imagen como cargada
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
        {!imagesLoaded && (
          <div>
            <Skeleton
              sx={{
                bgcolor: "grey.400",
                marginBottom: "1rem",
                borderRadius: "30px",
              }}
              variant="rectangular"
              width="40vw"
              height={"65vh"}
            />
          </div>
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
    width: "5vw",
    height: "auto",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "0.2rem",
  },
  selectedImageContainer: {
    flex: 1,
    marginLeft: "20px",
  },
  selectedImage: {
    width: "30vw",
    height: "auto",
    borderRadius: "30px",
  },
};
