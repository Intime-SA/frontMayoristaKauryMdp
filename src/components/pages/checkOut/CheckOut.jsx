import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  TextField,
  Typography,
} from "@mui/material";
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
import CustomStepper from "../home/cart/CustomStepper";
import CartItem from "./CartItem";
import Divider from "@mui/material/Divider";
import ClientForm from "./ClientForm";

function CheckOut() {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const [userData, setUserData] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [clienteRef, setClienteRef] = useState();
  const [nuevoId, setNuevoId] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [emailClient, setEmailCliente] = useState("");
  const [dataCliente, setDataCliente] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [tipoEnvio, setTipoEnvio] = useState(false);

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

  const handleChangeEmail = (e) => {
    const email = e.target.value;
    setEmailCliente(email);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const collectionUsers = collection(db, "users");
        const snapshotUsers = await getDocs(collectionUsers);
        const customers = snapshotUsers.docs.map((user) => user);
        setCustomers(customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, [emailClient]);

  console.log(dataCliente);

  // Obtener userOrder desde localStorage

  const userOrderJSON = localStorage.getItem("userOrder");
  let totalOrder = 0; // Inicializar el total en caso de que no haya ningún objeto userOrder en localStorage

  // Verificar si hay un objeto almacenado
  if (userOrderJSON) {
    // Parsear la cadena JSON de vuelta a un objeto JavaScript
    const userOrder = JSON.parse(userOrderJSON);

    // Verificar si la propiedad 'total' está definida en el objeto userOrder
    if (userOrder.total) {
      totalOrder = userOrder.total; // Asignar el total del objeto userOrder a la variable totalOrder
    }

    // Ahora userOrder es un objeto JavaScript que puedes utilizar en tu código
    console.log(userOrder);
  } else {
    console.log("No se encontró ningún objeto userOrder en localStorage");
  }

  // Verificar si hay un objeto almacenado

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
        <CustomStepper step={1} />
        {!orderId ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
                margin: "1rem",
              }}
            >
              Datos de destinatario
              <ClientForm
                handleChangeEmail={handleChangeEmail}
                customers={customers}
                setOpenForm={setOpenForm}
                openForm={openForm}
                setDataCliente={setDataCliente}
              />
              {dataCliente && (
                <>
                  <Typography variant="body2">
                    <strong>Nombre:</strong> {dataCliente.name}{" "}
                    {dataCliente.apellido}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Correo electrónico:</strong> {dataCliente.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Teléfono:</strong> {dataCliente.telefono}
                  </Typography>
                  <div
                    style={{
                      marginTop: "10px",
                      borderTop: "1px solid #ccc",
                      paddingTop: "10px",
                    }}
                  >
                    <Typography variant="h6" style={{ marginBottom: "10px" }}>
                      Datos de Envío
                    </Typography>
                    <Typography variant="body2">
                      <strong>Provincia:</strong>{" "}
                      {dataCliente.datosEnvio.provincia}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Ciudad:</strong> {dataCliente.datosEnvio.ciudad}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Código Postal:</strong>{" "}
                      {dataCliente.datosEnvio.codigoPostal}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Calle:</strong> {dataCliente.datosEnvio.calle}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Número:</strong> {dataCliente.datosEnvio.numero}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Piso/Dpto:</strong>{" "}
                      {dataCliente.datosEnvio.pisoDpto}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Barrio:</strong> {dataCliente.datosEnvio.barrio}
                    </Typography>
                  </div>
                  <Typography variant="body2" style={{ marginTop: "20px" }}>
                    Fecha de inicio:{" "}
                    {new Date(
                      dataCliente.fechaInicio.seconds * 1000
                    ).toLocaleDateString()}
                  </Typography>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <h4>Pago se realizo con exito</h4>
            <h4>orden de compra: {orderId}</h4>
            <Link to="/">Volver a la tienda</Link>
          </>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          marginTop: "2rem",
          flexGrow: 3,
          flexDirection: "column",
          border: "1px solid #e0e0e0",
        }}
      >
        {cart.map((product) => {
          return (
            <div
              style={{
                display: "flex",
                width: "90%",
                minWidth: "440px",
                border: "1px solid #e0e0e0",
                padding: "1rem",
                borderRadius: "5px",
                margin: "1rem",
                marginTop: "0.5rem",
                marginBotton: "0",
              }}
            >
              <Divider />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "stretch", // Ajusta la altura para llenar el contenedor principal
                  flexGrow: 2,
                  margin: "0px",
                  padding: "0px",
                  width: "auto",
                }}
              >
                <Divider />
                <CartItem product={product} />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexGrow: 8,
                  margin: "0px",
                  padding: "0px",
                }}
              >
                <Typography
                  variant="body2"
                  style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
                  gutterBottom
                  component="div"
                  color="black"
                >
                  {product.name} ( {product.talle}, {product.color} ) x{" "}
                  {product.quantity}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
                  gutterBottom
                  component="div"
                  color="black"
                >
                  $
                  {(product.quantity * product.unit_price).toLocaleString(
                    "es-ES",
                    {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </Typography>
              </div>
            </div>
          );
        })}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "space-around",
            flexDirection: "column",
            width: "90%",
            margin: "1rem",
          }}
        >
          <Typography
            variant="body2"
            style={{
              fontFamily: '"Roboto Condensed", sans-serif',
              fontSize: "50%",
            }}
            gutterBottom
            component="div"
            color="grey"
          >
            Subtotal
          </Typography>
          <Typography
            variant="body2"
            style={{
              fontFamily: '"Roboto Condensed", sans-serif',
              fontSize: "50%",
            }}
            gutterBottom
            component="div"
            color="grey"
          >
            {totalOrder.toLocaleString("es-ES", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
          <Typography
            variant="body2"
            style={{
              fontFamily: '"Roboto Condensed", sans-serif',
              fontSize: "50%",
            }}
            gutterBottom
            component="div"
            color="grey"
          >
            Costo Envio
          </Typography>
          <Typography
            variant="body2"
            style={{
              fontFamily: '"Roboto Condensed", sans-serif',
              fontSize: "50%",
            }}
            gutterBottom
            component="div"
            color="grey"
          >
            {totalOrder.toLocaleString("es-ES", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </div>
        <Divider />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "90%",
            margin: "1rem",
            marginTop: 0,
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontFamily: '"Roboto Condensed", sans-serif',
              marginLeft: "0.5rem",
            }}
            gutterBottom
            component="div"
            color="#c4072c"
          >
            TOTAL
          </Typography>
          <Typography
            variant="h6"
            style={{
              fontFamily: '"Roboto Condensed", sans-serif',
            }}
            gutterBottom
            component="div"
            color="#c4072c"
          >
            {totalOrder.toLocaleString("es-ES", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
