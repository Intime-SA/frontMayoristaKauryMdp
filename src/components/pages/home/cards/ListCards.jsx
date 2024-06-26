import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CardHome from "./CardHome";
import { db } from "../../../../firebaseConfig";
import {
  collection,
  getDocs,
  getDocsFromCache,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import ListArticles from "./ListArticles";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ListCards = () => {
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [categories, setCategories] = useState([]);
  const [openProducts, setOpenProducts] = useState(false);
  const [selectCategory, setSelectCategory] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(db, "categorys");
        const cacheQuerySnapshot = await getDocsFromCache(categoryCollection);

        let querySnapshot;

        // Verificar si la caché está vacía
        if (cacheQuerySnapshot.empty) {
          console.log("trayendo info de firebase");
          // Si la caché está vacía, realizar la consulta a Firestore
          querySnapshot = await getDocs(categoryCollection);
        } else {
          console.log("trayendo info de cache");
          // Si hay datos en caché, utilizarlos
          querySnapshot = cacheQuerySnapshot;
        }

        const categoriesData = [];

        querySnapshot.forEach((doc) => {
          if (doc.data().status === true && doc.id !== "oferta") {
            const category = { id: doc.id, ...doc.data() };
            categoriesData.push(category);
          }
        });

        setCategories(categoriesData);
      } catch (error) {
        console.log("Error al obtener las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "5rem",
        marginBottom: "5rem",
        width: "100%",
      }}
    >
      {openProducts ? (
        <ListArticles category={selectCategory} />
      ) : (
        <div style={{ width: "100%" }}>
          {!isNarrowScreen && categories.length > 4 ? (
            <Slider
              dots={false}
              infinite={true}
              speed={500}
              arrows={false}
              slidesToShow={4}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={3000}
            >
              {categories.map((category) => (
                <div key={category.id}>
                  <CardHome
                    categoryNombre={category.name}
                    categoryImage={category.image}
                    categoryId={category.id}
                    setOpenProducts={setOpenProducts}
                    setSelectCategory={setSelectCategory}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            categories.map((category) => (
              <CardHome
                key={category.id}
                categoryNombre={category.name}
                categoryImage={category.image}
                categoryId={category.id}
                setOpenProducts={setOpenProducts}
                setSelectCategory={setSelectCategory}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ListCards;
