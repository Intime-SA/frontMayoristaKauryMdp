import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import Skeleton from "@mui/material/Skeleton";

const VerticalCarrusel = ({ article }) => {
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

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
              imageCard: doc.data().imageCard || doc.data().image, // Si imageMobile no existe, asignamos la imagen a imageMobile
              image: doc.data().image,
              color: color,
            });
          }
        }
      });

      setFilteredArticles(filteredArticles);

      if (filteredArticles.length > 0) {
        setSelectedImage(filteredArticles[0].image); // Seleccionar la primera imagen
      }
    };

    fetchArticle().then(() => {
      setLoading(false); // Marcar como cargado después de obtener los datos
    });
  }, [article]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setImagesLoaded(false); // Reiniciar el estado de carga de imágenes
  };

  useEffect(() => {
    if (selectedImage) {
      const image = new Image();
      image.src = selectedImage;
      image.onload = () => {
        setImagesLoaded(true); // Marcar la imagen seleccionada como cargada
      };
    }
  }, [selectedImage]);

  return (
    <div style={styles.verticalCarousel}>
      <div style={styles.imageList}>
        {!loading &&
          filteredArticles.map((item, index) => (
            <img
              key={index}
              src={item.imageCard || item.image}
              alt={`Article ${index + 1}`}
              style={styles.imageThumbnail}
              onClick={() => handleImageClick(item.image)}
              onLoad={() => setImagesLoaded(true)} // Marca la imagen como cargada
            />
          ))}
        {!imagesLoaded &&
          loading && ( // Mostrar Skeleton solo durante la carga inicial
            <div>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  sx={{
                    bgcolor: "grey.400",
                    marginBottom: "1rem",
                    borderRadius: "0.2rem",
                  }}
                  variant="rectangular"
                  width={210}
                  height={118}
                />
              ))}
            </div>
          )}
      </div>
      <div style={styles.selectedImageContainer}>
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected Image"
            style={styles.selectedImage}
          />
        )}
        {!imagesLoaded && ( // Mostrar Skeleton al cambiar de imagen
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
