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
import CustomStepper from "../home/cart/CustomStepper";
import CartItem from "./CartItem";
import Divider from "@mui/material/Divider";
import ClientForm from "./ClientForm";
import TipoEnvio from "./TipoEnvio";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

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
  const [tipoEnvio, setTipoEnvio] = useState(0);
  const theme = useTheme();

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

  const userOrderData = JSON.parse(userOrderJSON);

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

  // Parsear la cadena JSON de vuelta a un objeto JavaScript
  // Parsear la cadena JSON de vuelta a un objeto JavaScript
  try {
    const userOrder2 = JSON.parse(userOrderJSON);
    if (userOrder2 && typeof userOrder2.tipoEnvio !== "undefined") {
      if (userOrder2.tipoEnvio === 1 && !tipoEnvio) {
        // Añadimos una condición para evitar re-renderizados innecesarios
        setTipoEnvio(true);
      } else if (userOrder2.tipoEnvio !== 1 && tipoEnvio) {
        setTipoEnvio(false);
      }
    } else {
      console.log("tipoEnvio no está definido en el objeto JSON");
    }
  } catch (error) {
    console.error("Error al analizar el JSON:", error);
  }

  let andreaniCostoDomicilio = 8550;
  let sinEnvio = 0;

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const containerWidth = isMobile ? "90vw" : "80vw";

  // Verificar si hay un objeto almacenado

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMobile ? "center" : "space-between",
        width: containerWidth,
        flexDirection: isMobile ? "column" : "row",
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
              <div>
                <strong>Entrega</strong>
                <TipoEnvio />
              </div>

              <ClientForm
                handleChangeEmail={handleChangeEmail}
                customers={customers}
                setOpenForm={setOpenForm}
                openForm={openForm}
                setDataCliente={setDataCliente}
                andreaniCostoDomicilio={andreaniCostoDomicilio}
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
                      <strong>Datos de Envío / Facturacion</strong>
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
            {dataCliente && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Link to="/pago">
                  <Button
                    variant="contained"
                    color="error"
                    style={{ borderRadius: "20px" }}
                  >
                    CONTINUAR PARA EL PAGO
                  </Button>
                </Link>
              </div>
            )}
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
          height: "auto",
        }}
      >
        {cart.map((product) => {
          return (
            <div
              style={{
                display: "flex",
                width: "90%",
                minWidth: "300px",
                border: "1px solid #e0e0e0",
                padding: "1rem",
                borderRadius: "5px",
                margin: "1rem",
                marginTop: "0.5rem",
                marginBotton: "0",
                height: "auto",
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "space-around",
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
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "space-around",
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
              {tipoEnvio !== 0 && userOrderData.infoEntrega.length !== 0 ? (
                <>
                  {" " +
                    andreaniCostoDomicilio.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </>
              ) : (
                sinEnvio.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              )}
            </Typography>
          </div>
        </div>
        <Divider />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
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
              fontWeight: "900",
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
              fontWeight: "900",
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
