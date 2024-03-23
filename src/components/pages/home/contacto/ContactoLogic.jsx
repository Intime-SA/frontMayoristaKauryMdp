import React, { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

const ContactoLogic = ({ setCategory }) => {
  useEffect(() => {
    const fetchData = async () => {
      const categorias = collection(db, "categorys");
      const querySnapshot = await getDocs(categorias);
      const categoriasArray = [];
      querySnapshot.forEach((doc) => {
        const dataCategoria = doc.data();
        const id = doc.id; // Obtener el ID del documento
        categoriasArray.push({ id, ...dataCategoria }); // Agregar el ID a los datos de la categoría
      });
      setCategory(categoriasArray);
    };

    fetchData();
  }, [setCategory]);

  return null; // No se necesita un renderizado en este componente
};

export default ContactoLogic;
