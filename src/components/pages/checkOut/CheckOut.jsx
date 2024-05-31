import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { Form, Link, useLocation } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import {
  updateDoc,
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
  const { cart, regresoDePago } = useContext(CartContext);

  const orderId = null;
  const [openForm, setOpenForm] = useState(false);
  const [emailClient, setEmailCliente] = useState("");
  const [dataCliente, setDataCliente] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [tipoEnvio, setTipoEnvio] = useState(0);
  const theme = useTheme();
  const [totalOrderPago, setTotalOrderPago] = useState(0);
  const [desabilitarEnvio, setDesabilitarEnvio] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userOrdersCollection = collection(db, "users");
        const snapShotOrders = await getDocs(userOrdersCollection);
        snapShotOrders.forEach((user) => {
          const userDataFromOrder = user.data();
          if (userDataFromOrder.email === user.email) {
            const obtenerRutaCliente = (idCliente) => {
              return `users/${idCliente}`;
            };
            const clienteRef = doc(db, obtenerRutaCliente(user.id));
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUser();
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

  const [totalOrderOriginal, setTotalOrderOriginal] = useState(0);

  useEffect(() => {
    const userOrderJSON = localStorage.getItem("userOrder");
    if (userOrderJSON) {
      const userOrderData = JSON.parse(userOrderJSON);
      if (fromPago) {
        const totalCarritoJSON = localStorage.getItem("totalCarrito");
        const totalCarritoData = JSON.parse(totalCarritoJSON);

        setTotalOrderOriginal(totalCarritoData);
      } else {
        if (userOrderData.total) {
          setTotalOrderOriginal(userOrderData.total);
        }
        localStorage.setItem("totalCarrito", userOrderData.total.toString());
      }
    } else {
      console.log("No se encontró ningún objeto userOrder en localStorage");
    }
  }, []);

  console.log(totalOrderOriginal);

  let totalOrder = 0; // Inicializar el total en caso de que no haya ningún objeto userOrder en localStorage

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const fromPago = params.get("fromPago");
  // Verificar si hay un objeto almacenado
  if (userOrderJSON) {
    // Parsear la cadena JSON de vuelta a un objeto JavaScript
    const userOrder = JSON.parse(userOrderJSON);

    if (userOrder.total) {
      totalOrder = userOrder.total; // Asignar el total del objeto userOrder a la variable totalOrder
    }

    // Ahora userOrder es un objeto JavaScript que puedes utilizar en tu código
    console.log(userOrder);
  }
  // Verificar si la propiedad 'total' está definida en el objeto userOrder
  else {
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

  let andreaniAsucursal = 6900;
  let andreaniCostoDomicilio = 8550;
  let sinEnvio = 0;

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const containerWidth = isMobile ? "100vw" : "90vw";

  const [tipoDePago, setTipoDePago] = useState({
    pagoTransferencia: false,
    pagoEfectivo: true,
  });

  const [tipoDePagoAnterior, setTipoDePagoAnterior] = useState({
    pagoTransferencia: false,
    pagoEfectivo: false,
  });

  const handleChange = (event) => {
    const { name, checked } = event.target;

    // Almacenar el estado anterior antes de actualizar
    setTipoDePagoAnterior({ ...tipoDePago });

    // Si se desmarca la opción de transferencia, se establece pago en efectivo
    if (name === "pagoTransferencia" && !checked) {
      // Verificar si aún hay algún checkbox seleccionado
      const otroCheckboxSeleccionado = tipoDePago.pagoEfectivo;
      if (!otroCheckboxSeleccionado) {
        // Si no hay otro checkbox seleccionado, no se permite desmarcar el actual
        return;
      }
    } else if (name === "pagoEfectivo" && !checked) {
      // Verificar si aún hay algún checkbox seleccionado
      const otroCheckboxSeleccionado = tipoDePago.pagoTransferencia;
      if (!otroCheckboxSeleccionado) {
        // Si no hay otro checkbox seleccionado, no se permite desmarcar el actual
        return;
      }
    }

    setTipoDePago({
      ...tipoDePago,
      [name]: checked,
      [name === "pagoTransferencia"
        ? "pagoEfectivo"
        : "pagoTransferencia"]: false,
    });
  };

  const [envioSeleccionado, setEnvioSeleccionado] = useState("envioSucursal"); // Estado para almacenar la opción seleccionada

  const handleCheckboxChange = (event) => {
    const { name } = event.target;
    console.log(name);
    setEnvioSeleccionado(name); // Cambiar el estado solo si la opción seleccionada es diferente
  };

  const [shouldApplyEffect, setShouldApplyEffect] = useState(true);

  useEffect(() => {
    function handlePopstate() {
      setShouldApplyEffect(false); // Desactivar el efecto al detectar el evento popstate
    }

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  useEffect(() => {
    if (shouldApplyEffect) {
      // Lógica para aplicar o quitar el descuento del 15% según el método de pago seleccionado
      let newTotalOrder = totalOrder;

      if (tipoDePago.pagoTransferencia) {
        newTotalOrder += (totalOrder * 15) / 100; // Se añade el 15% al total
      } else if (
        tipoDePagoAnterior.pagoTransferencia &&
        tipoDePago.pagoEfectivo
      ) {
        newTotalOrder -= (totalOrderOriginal * 15) / 100; // Se quita el 15% al total
      }

      setTotalOrderPago(newTotalOrder);

      // Actualizamos el objeto userOrder en localStorage
      const updatedUserOrder = {
        ...userOrderData,
        total: newTotalOrder,
        tipoDePago: tipoDePago,
        envioSeleccionado: envioSeleccionado || "sinEnvio",
      };
      localStorage.setItem("userOrder", JSON.stringify(updatedUserOrder));
    }
  }, [
    shouldApplyEffect,
    tipoDePago.pagoTransferencia,
    tipoDePago.pagoEfectivo,
    envioSeleccionado,
  ]);

  function handleRegresoDePago() {
    setShouldApplyEffect(false); // Desactivar el efecto
    // Otras acciones necesarias al regresar de la página de pago
  }

  useEffect(() => {
    function handleBeforeUnload(event) {
      const params = new URLSearchParams(location.search);
      const fromPago = params.get("fromPago");

      if (fromPago === "true") {
        // El usuario vuelve desde la página de pago, ejecutar funcionalidades necesarias
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      {!isMobile ? <div></div> : <CustomStepper step={1} />}

      <div
        style={{
          display: "flex",
          justifyContent: isMobile ? "center" : "space-between",
          width: containerWidth,
          flexDirection: isMobile ? "column-reverse" : "row",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            flexBasis: isMobile ? 440 : 1000,
          }}
        >
          {isMobile ? <div></div> : <CustomStepper step={1} />}

          {!orderId ? (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  margin: "1rem",
                }}
              >
                <div>
                  <strong style={{ fontFamily: '"Kanit", sans-serif' }}>
                    Entrega
                  </strong>
                  <TipoEnvio />
                  {!desabilitarEnvio && userOrderData.tipoEnvio === 1 && (
                    <div>
                      <FormControlLabel
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        control={
                          <Checkbox
                            style={{ fontFamily: '"Kanit", sans-serif' }}
                            checked={envioSeleccionado === "envioDomicilio"}
                            onChange={handleCheckboxChange}
                            name="envioDomicilio"
                          />
                        }
                        label="Envio a domicilio"
                      />
                      <FormControlLabel
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        control={
                          <Checkbox
                            style={{ fontFamily: '"Kanit", sans-serif' }}
                            checked={envioSeleccionado === "envioSucursal"}
                            onChange={handleCheckboxChange}
                            name="envioSucursal"
                          />
                        }
                        label="Envio a sucursal"
                      />
                    </div>
                  )}

                  {userOrderData.tipoEnvio === 2 && (
                    <div style={{}}>
                      <FormControlLabel
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        control={
                          <Checkbox
                            style={{ fontFamily: '"Kanit", sans-serif' }}
                            checked={tipoDePago.pagoTransferencia}
                            onChange={handleChange}
                            name="pagoTransferencia"
                          />
                        }
                        label="Transferencia"
                      />
                      <FormControlLabel
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        control={
                          <Checkbox
                            style={{ fontFamily: '"Kanit", sans-serif' }}
                            checked={tipoDePago.pagoEfectivo}
                            onChange={handleChange}
                            name="pagoEfectivo"
                          />
                        }
                        label="Efectivo"
                      />
                    </div>
                  )}
                </div>

                <ClientForm
                  handleChangeEmail={handleChangeEmail}
                  customers={customers}
                  setOpenForm={setOpenForm}
                  openForm={openForm}
                  setDataCliente={setDataCliente}
                  andreaniCostoDomicilio={andreaniCostoDomicilio}
                  andreaniAsucursal={andreaniAsucursal}
                  setDesabilitarEnvio={setDesabilitarEnvio}
                  fromPago={fromPago}
                />
                {dataCliente && (
                  <>
                    <Typography
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                      variant="body2"
                    >
                      <strong>Nombre:</strong> {dataCliente.name}{" "}
                      {dataCliente.apellido}
                    </Typography>
                    <Typography
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                      variant="body2"
                    >
                      <strong>Correo electrónico:</strong> {dataCliente.email}
                    </Typography>
                    <Typography
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                      variant="body2"
                    >
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
                      <Typography
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        variant="body2"
                      >
                        <strong>Provincia:</strong>{" "}
                        {dataCliente.datosEnvio.provincia}
                      </Typography>
                      <Typography
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        variant="body2"
                      >
                        <strong>Ciudad:</strong> {dataCliente.datosEnvio.ciudad}
                      </Typography>
                      <Typography
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        variant="body2"
                      >
                        <strong>Código Postal:</strong>{" "}
                        {dataCliente.datosEnvio.codigoPostal}
                      </Typography>
                      <Typography
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        variant="body2"
                      >
                        <strong>Calle:</strong> {dataCliente.datosEnvio.calle}
                      </Typography>
                      <Typography
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        variant="body2"
                      >
                        <strong>Número:</strong> {dataCliente.datosEnvio.numero}
                      </Typography>
                      <Typography
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        variant="body2"
                      >
                        <strong>Piso/Dpto:</strong>{" "}
                        {dataCliente.datosEnvio.pisoDpto}
                      </Typography>
                      <Typography
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        variant="body2"
                      >
                        <strong>Barrio:</strong> {dataCliente.datosEnvio.barrio}
                      </Typography>
                    </div>
                    <Typography
                      variant="body2"
                      style={{
                        marginTop: "20px",
                        fontFamily: '"Kanit", sans-serif',
                      }}
                    >
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
                    justifyContent: "center",
                  }}
                >
                  <Link to="/pago">
                    <Button
                      variant="contained"
                      color="error"
                      style={{
                        borderRadius: "20px",
                        margin: "1rem",
                        width: "100%",
                        fontFamily: '"Kanit", sans-serif',
                      }}
                    >
                      CONTINUAR PARA EL PAGO
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <h4 style={{ fontFamily: '"Kanit", sans-serif' }}>
                Pago se realizo con exito
              </h4>
              <h4 style={{ fontFamily: '"Kanit", sans-serif' }}>
                orden de compra: {orderId}
              </h4>
              <Link to="/">Volver a la tienda</Link>
            </>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexDirection: "column",
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            maxHeight: "50vh", // Establecer una altura mínima
            flexBasis: isMobile ? 440 : 800,
            overflow: "auto", // Añadir overflow:auto para manejar el desbordamiento de contenido
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
                  borderRight: "0px",
                  borderTop: "0px",
                  borderLeft: "0px",
                  padding: "1rem",
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
                    flexGrow: 10,
                    margin: "0px",
                    padding: "0px",
                  }}
                >
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: '"Kanit", sans-serif',
                      margin: "1rem",
                    }}
                    gutterBottom
                    component="div"
                    color="black"
                  >
                    {product.name} ( {product.talle}, {product.color} ) x{" "}
                    {product.quantity}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ fontFamily: '"Kanit", sans-serif' }}
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
                  fontFamily: '"Kanit", sans-serif',
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
                  fontFamily: '"Kanit", sans-serif',
                  fontSize: "50%",
                }}
                gutterBottom
                component="div"
                color="grey"
              >
                {userOrderData.tipoEnvio === 1
                  ? totalOrderOriginal.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : totalOrder.toLocaleString("es-ES", {
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
                  fontFamily: '"Kanit", sans-serif',
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
                  fontFamily: '"Kanit", sans-serif',
                  fontSize: "50%",
                }}
                gutterBottom
                component="div"
                color="grey"
              >
                {envioSeleccionado === "envioDomicilio" &&
                  userOrderData.tipoEnvio === 1 &&
                  andreaniCostoDomicilio.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}

                {envioSeleccionado === "envioSucursal" &&
                  userOrderData.tipoEnvio === 1 &&
                  andreaniAsucursal.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                {userOrderData.tipoEnvio === 2 &&
                  sinEnvio.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
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
                fontFamily: '"Kanit", sans-serif',
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
                fontFamily: '"Kanit", sans-serif',
                fontWeight: "900",
              }}
              gutterBottom
              component="div"
              color="#c4072c"
            >
              {userOrderData.tipoEnvio === 1
                ? totalOrder.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : totalOrderPago.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
