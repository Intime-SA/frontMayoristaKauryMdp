import React, { useState, useEffect } from "react";
import CustomStepper from "../home/cart/CustomStepper";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Button } from "@mui/material";

const Pago = () => {
  const [userOrder, setUserOrder] = useState(null);
  const [userRef, setUserRef] = useState(null);

  // Obtener el pedido del localStorage al cargar el componente
  useEffect(() => {
    const userOrderJSON = localStorage.getItem("userOrder");
    if (userOrderJSON) {
      setUserOrder(JSON.parse(userOrderJSON));
    }
  }, []);

  // Actualizar la referencia de usuario cuando el pedido cambia
  useEffect(() => {
    if (userOrder) {
      const userRef = doc(db, "users", userOrder.clienteId);
      setUserRef(userRef);
    }
  }, [userOrder]);

  // Función para realizar el pedido
  const realizarPedido = async () => {
    try {
      if (userOrder) {
        // Modificar el objeto userOrder antes de guardarlo
        const modifiedUserOrder = {
          ...userOrder,
          client: userRef,
          date: serverTimestamp(),
        };
        console.log(modifiedUserOrder);

        // Agregar el pedido modificado a la colección de pedidos en la base de datos
        const collectionOrders = collection(db, "userOrders");
        await addDoc(collectionOrders, modifiedUserOrder);

        console.log("Pedido realizado con éxito");
      } else {
        console.error("No hay datos de pedido para realizar");
      }
    } catch (error) {
      console.error("Error al realizar el pedido:", error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "80vw",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
          flexGrow: 7,
          marginRight: "1rem",
        }}
      >
        <CustomStepper step={2} />
      </div>
      <Button onClick={realizarPedido}>REALIZAR PEDIDO</Button>
    </div>
  );
};

export default Pago;
