import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { Typography } from "@mui/material";

const CategoryBreadcrumb = () => {
  const category = useParams();
  const [categoriaName, setCategoriaName] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      const categoryCollection = collection(db, "categorys");
      const querySnapshot = await getDocs(categoryCollection);

      querySnapshot.forEach((doc) => {
        if (doc.id === category.id) {
          setCategoriaName(doc.data().name);
        }
      });
    };

    fetchCategory();
  }, [category.id]);

  return (
    <Typography
      variant="body2"
      sx={{ marginTop: "1rem", color: "grey", textAlign: "center" }}
    >
      Inicio > {categoriaName}
    </Typography>
  );
};

export default CategoryBreadcrumb;
