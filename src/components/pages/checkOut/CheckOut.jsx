import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import {
  addDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  collection,
  doc,
  getDoc,
} from "firebase/firestore";
import CheckoutScreen from "./CheckoutScreen";

function CheckOut() {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const [userData, setUserData] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [clienteRef, setClienteRef] = useState();
  const [nuevoId, setNuevoId] = useState(0);
  const [orderItems, setOrderItems] = useState([]);
  const [totalOrder, setTotalOrder] = useState();
  const [userOrder, setUserOrder] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userOrdersCollection = collection(db, "users");
        const snapShotOrders = await getDocs(userOrdersCollection);
        snapShotOrders.forEach((user) => {
          const userDataFromOrder = user.data();
          if (userDataFromOrder.email === user.email) {
            setUserData(userDataFromOrder);
            const obtenerRutaCliente = (idCliente) => {
              return `users/${idCliente}`;
            };
            const clienteRef = doc(db, obtenerRutaCliente(user.id));
            setClienteRef(clienteRef);
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const traerId = async () => {
      try {
        const refContador = doc(db, "contador", "contador");
        const docContador = await getDoc(refContador);

        const nuevoValor = docContador.data().autoincremental + 1;
        setNuevoId(nuevoValor);

        const nuevoValorObj = { autoincremental: nuevoValor };

        await updateDoc(refContador, nuevoValorObj);
      } catch (error) {
        console.error("Error al obtener el nuevo ID:", error);
      }
    };
    traerId();
  }, []);

  const orderItemsTransform = (cart) => {
    let total = 0;
    const orderItems = cart.map((item) => {
      const subtotal = item.quantity * item.unit_price;
      total += subtotal;
      return {
        color: item.color || "",
        descuento: 0,
        image: item.image || "",
        name: item.name || "",
        productId: item.idc || "",
        quantity: item.quantity || "",
        subtotal: subtotal,
        talle: item.talle || "",
        unit_price: item.unit_price || "",
      };
    });
    setOrderItems(orderItems);
    setTotalOrder(total);
    return total;
  };

  const handleSubmit = async () => {
    if (!clienteRef) return; // Verificar si clienteRef está definido

    let userOrder = {
      canalVenta: "Usuario WEB",
      client: clienteRef,
      date: serverTimestamp(),
      infoEntrega: [],
      lastState: "nueva",
      note: "",
      numberOrder: nuevoId,
      orderItems: orderItems,
      status: "nueva",
      total: totalOrder,
    };
    setUserOrder(userOrder);

    // Aquí puedes realizar la lógica de almacenamiento de la orden en la base de datos
  };

  // handleSubmit(); // No llames a handleSubmit dentro del componente

  const handleBuy = async () => {
    let order = {
      cp: userData.cp,
      phone: userData.phone,
      items: cart,
      total: totalOrder,
      email: userData.email,
    };
    // Aquí puedes agregar la lógica para el pago
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: "10rem",
      }}
    >
      {!orderId ? (
        <>
          <CheckoutScreen order={userOrder} />
          <TextField
            onChange={handleChange}
            name="cp"
            variant="outlined"
            label="Codigo Postal"
          />
          <TextField
            onChange={handleChange}
            name="phone"
            variant="outlined"
            label="Telefono"
          />
          <Button onClick={handleBuy}>Metodo Pago</Button>
        </>
      ) : (
        <>
          <h4>Pago se realizo con exito</h4>
          <h4>orden de compra: {orderId}</h4>
          <Link to="/">Volver a la tienda</Link>
        </>
      )}
    </div>
  );
}

export default CheckOut;
