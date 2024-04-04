import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const CategoriesContext = createContext();

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Nuevo estado de carga

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(db, "categorys");
        const querySnapshot = await getDocs(categoryCollection);
        const categoriesData = [];

        querySnapshot.forEach((doc) => {
          if (doc.data().status) {
            const category = { id: doc.id, ...doc.data() };
            categoriesData.push(category);
          }
        });

        setCategories(categoriesData);
        setLoading(false); // Marcamos la carga como completa
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading }}>
      {" "}
      {/* Proporcionamos tanto las categorías como el estado de carga */}
      {children}
    </CategoriesContext.Provider>
  );
};
