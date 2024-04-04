import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Nuevo estado de carga

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const querySnapshot = await getDocs(productsCollection);
        const productsData = [];

        querySnapshot.forEach((doc) => {
          const product = { id: doc.id, ...doc.data() };
          productsData.push(product);
        });

        setProducts(productsData);
        setLoading(false); // Marcamos la carga como completa
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading }}>
      {" "}
      {/* Ahora proporcionamos tanto los productos como el estado de carga */}
      {children}
    </ProductsContext.Provider>
  );
};
