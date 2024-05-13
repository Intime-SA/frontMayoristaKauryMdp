import React, { useContext, useEffect } from "react";
import { CartContext } from "../../../context/CartContext";
import {
  Button,
  Box,
  Checkbox,
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableBody,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { AuthContext } from "../../../context/AuthContext";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CustomStepper from "./CustomStepper";
import EmptyCartMessage from "./EmptyCartMenssage";
import { createTheme } from "@mui/material/styles";

const Cart = () => {
  const { cart, deleteById, getTotalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [clienteRef, setClienteRef] = useState();

  const [orderItems, setOrderItems] = useState([]);
  const [totalOrder, setTotalOrder] = useState();
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState([]);
  const [estadoError, setEstadoError] = useState(false);

  let total = getTotalPrice();

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCheckboxChange = (event, localId) => {
    if (selectedLocal === localId) {
      // Si el local seleccionado ya está seleccionado, lo deseleccionamos
      setSelectedLocal(null);
    } else {
      // Si el local seleccionado no está seleccionado, lo seleccionamos y deseleccionamos el otro
      setSelectedLocal(localId);
    }
  };

  const locales = [
    {
      id: 1,
      direccion:
        "Showroom - José Mármol 970 timbre 104. Atención de lunes a sábados de 10 a 17hs. MAR DEL PLATA",
    },
    {
      id: 2,
      direccion:
        "Showroom 2 - Rivadavia 5931. Planta alta A. TIMBRE ¨KAURY¨. De lunes a sabados de 10 a 17hs. MAR DEL PLATA",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userOrdersCollection = collection(db, "users");
        const snapShotOrders = await getDocs(userOrdersCollection);
        snapShotOrders.forEach(async (userArray) => {
          const userDataFromOrder = userArray.data(); // Cambio aquí

          // Verificar si user existe antes de acceder a user.email
          if (user && userDataFromOrder.email === user.email) {
            const obtenerRutaCliente = (idCliente) => {
              return `users/${idCliente}`;
            };
            const clienteRef = doc(db, obtenerRutaCliente(userArray.id));
            setClienteRef(clienteRef);
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUser();
  }, [user]);

  useEffect(() => {
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

    orderItemsTransform(cart);
  }, [cart]);

  useEffect(() => {
    // Buscar si existe la propiedad userOrder en el localStorage
    const userOrderJSON = localStorage.getItem("userOrder");
    const totalCarritoJSON = localStorage.getItem("totalCarrito");

    // Si existe, borrarla
    if (userOrderJSON) {
      localStorage.removeItem("userOrder");
      console.log("La propiedad userOrder se ha eliminado del localStorage.");
    }
    if (totalCarritoJSON) {
      localStorage.removeItem("totalCarrito");
      console.log(
        "La propiedad totalCarrito se ha eliminado del localStorage."
      );
    }
  }, []);

  const handleSubmit = async () => {
    let total = await getTotalPrice();

    if (total <= 60000) {
      setEstadoError(true);
      return;
    }

    // Construir el objeto userOrder
    const userOrder = {
      canalVenta: "Usuario WEB",
      client: clienteRef,
      date: serverTimestamp(),
      infoEntrega: [],
      lastState: "nueva",
      note: "",
      orderItems: orderItems,
      status: "nueva",
      total: totalOrder,
      tipoEnvio: selectedCheckbox,
      sucursal: selectedLocal,
    };

    // Guardar userOrder en localStorage
    localStorage.setItem("userOrder", JSON.stringify(userOrder));
    window.scrollTo(0, 0); // Desplazar al principio de la página
    navigate("/checkout");

    // Aquí puedes realizar la lógica de almacenamiento de la orden en la base de datos
  };

  let precioTotalCarrito = 0; // Inicializa el precio total del carrito

  for (let i = 0; i < cart.length; i++) {
    const producto = cart[i];
    const precioTotalProducto = producto.unit_price * producto.quantity;
    precioTotalCarrito += precioTotalProducto; // Suma el precio total del producto al precio total del carrito
  }

  const precioFormateado = total.toLocaleString("es-ES", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleChange = (id) => {
    if (selectedCheckbox === id) {
      // Si el checkbox seleccionado ya está seleccionado, lo deseleccionamos
      setSelectedCheckbox(null);
    } else {
      // Si el checkbox seleccionado no está seleccionado, lo seleccionamos y deseleccionamos el otro
      setSelectedCheckbox(id);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {cart.length > 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <CustomStepper step={0} />
          <div>
            {cart.map((producto, index) => (
              <Card
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  margin: "0.5rem",
                  padding: "0.5rem",
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 75, height: 75, borderRadius: "10px" }}
                  image={producto.imageCard}
                  alt={producto.name}
                />
                <CardContent sx={{ flex: 1, paddingTop: "0rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      style={{
                        fontWeight: 600,
                        fontFamily: '"Roboto Condensed", sans-serif',
                      }}
                    >
                      {producto.name}
                    </Typography>
                    <Button
                      onClick={() => deleteById(producto.idc)}
                      size="small"
                      style={{ color: "black" }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </Button>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="body2"
                      style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
                    >
                      {producto.quantity}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
                    >
                      {(producto.unit_price * producto.quantity).toLocaleString(
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
                </CardContent>
              </Card>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
              }}
            >
              <Typography
                variant="h6"
                component="div"
                style={{
                  fontWeight: 600,
                  fontFamily: '"Roboto Condensed", sans-serif',
                }}
              >
                Subtotal (sin envio) :
              </Typography>

              <Typography
                variant="h6"
                component="div"
                style={{
                  fontWeight: 600,
                  fontFamily: '"Roboto Condensed", sans-serif',
                }}
              >
                {precioFormateado}
              </Typography>
            </div>
            <div
              style={{
                borderRadius: "20px",
                border: "1px solid #D27611",
                padding: "1rem",
                margin: "1rem",
                color: "#D27611",
                display: "flex",
                alignItems: "center",
              }}
            >
              <h6 style={{ fontFamily: '"Roboto Condensed", sans-serif' }}>
                <span
                  style={{ color: "#D27611" }}
                  className="material-symbols-outlined"
                >
                  warning
                </span>{" "}
                Por cualquier consulta que tengas no dudes en escribirnos por
                WhatsApp 2233485438
              </h6>
            </div>
            <Divider />
            <div
              style={{ display: "flex", padding: "1rem", alignItems: "center" }}
            >
              <span className="material-symbols-outlined">local_shipping</span>
              <h6
                style={{
                  marginLeft: "1rem",
                  fontFamily: '"Roboto Condensed", sans-serif',
                }}
              >
                Envío a domicilio / sucursal
              </h6>
            </div>
            <div
              style={{
                borderRadius: "5px",
                border: "2px solid #c4072c",
                color: "#D27611",
                display: "flex",
                alignItems: "stretch",
                marginBottom: "1rem", // Alinear los elementos a lo largo de toda la altura
              }}
            >
              <div
                style={{
                  backgroundColor: "#c4072c",
                  flexBasis: "6%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center", // Hacer que el primer div ocupe todo el espacio restante
                }}
              >
                <Checkbox
                  checked={selectedCheckbox === 1}
                  onChange={() => handleChange(1)}
                  inputProps={{ "aria-label": "controlled" }}
                  style={{ color: "white" }}
                />
              </div>
              <div style={{ flexGrow: 1 }}>
                <h6
                  style={{
                    margin: "1rem",
                    fontFamily: '"Roboto Condensed", sans-serif',
                  }}
                >
                  Andreani Estandar
                </h6>
                <h6
                  style={{
                    fontFamily: '"Roboto Condensed", sans-serif',
                    fontSize: "50%",
                    color: "grey",
                    marginLeft: "1rem",
                  }}
                >
                  Llega en 3 dias habiles
                </h6>
              </div>
            </div>
            <Divider />
            <div
              style={{ display: "flex", padding: "1rem", alignItems: "center" }}
            >
              <span className="material-symbols-outlined">location_on</span>
              <h6
                style={{
                  marginLeft: "1rem",
                  fontFamily: '"Roboto Condensed", sans-serif',
                }}
              >
                Retirar por
              </h6>
            </div>
            <div
              style={{
                borderRadius: "5px",
                border: "2px solid #c4072c",
                color: "#D27611",
                display: "flex",
                alignItems: "stretch",
                marginBottom: "1rem", // Alinear los elementos a lo largo de toda la altura
              }}
            >
              <div
                style={{
                  backgroundColor: "#c4072c",
                  flexBasis: "6%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center", // Hacer que el primer div ocupe todo el espacio restante
                }}
              >
                <Checkbox
                  checked={selectedCheckbox === 2}
                  onChange={() => handleChange(2)}
                  inputProps={{ "aria-label": "controlled" }}
                  style={{ color: "white" }}
                />
              </div>
              <div style={{ flexGrow: 1 }}>
                <h6
                  style={{
                    margin: "1rem",
                    fontFamily: '"Roboto Condensed", sans-serif',
                  }}
                >
                  <span style={{ color: "grey" }}>Punto de Retiro</span> - (
                  GRATIS )
                </h6>
                <h6
                  style={{
                    fontFamily: '"Roboto Condensed", sans-serif',
                    fontSize: "50%",
                    color: "grey",
                    marginLeft: "1rem",
                  }}
                >
                  Inmediato
                </h6>
                <h6
                  style={{
                    fontFamily: '"Roboto Condensed", sans-serif',
                    fontSize: "50%",
                    color: "#e0e0e0",
                    marginLeft: "1rem",
                  }}
                ></h6>
              </div>
            </div>
            <h6
              style={{
                marginLeft: "1rem",
                fontFamily: '"Roboto Condensed", sans-serif',
              }}
            >
              El tiempo de entrega no considera feriados.
            </h6>
            <Divider />
            {selectedCheckbox == 2 && (
              <div
                style={{
                  display: "flex",
                  padding: "1rem",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  maxWidth: isSmallScreen ? "100%" : "600px", // Cambia el ancho máximo en pantallas pequeñas
                  width: "100%", // Asegura que ocupe todo el ancho disponible
                }}
              >
                <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setOpen(!open)}
                    >
                      <div style={{ display: "flex" }}>
                        <span className="material-symbols-outlined">store</span>
                        <h6
                          style={{
                            marginLeft: "1rem",
                            fontFamily: '"Roboto Condensed", sans-serif',
                          }}
                        >
                          Nuestros Locales
                        </h6>
                      </div>
                      {open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {locales.map((local) => (
                              <TableRow key={local.id}>
                                <TableCell component="th" scope="row">
                                  <Checkbox
                                    checked={selectedLocal === local.id}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, local.id)
                                    }
                                    inputProps={{ "aria-label": "controlled" }}
                                  />
                                  {local.direccion}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
              }}
            >
              <Typography
                variant="h6"
                component="div"
                style={{
                  fontWeight: 800,
                  fontFamily: '"Roboto Condensed", sans-serif',
                  color: "#c4072c",
                  fontSize: "100%",
                }}
              >
                TOTAL:
              </Typography>
              <Typography
                variant="h6"
                component="div"
                style={{
                  fontWeight: 800,
                  fontFamily: '"Roboto Condensed", sans-serif',
                  color: "#c4072c",
                  fontSize: "100%",
                }}
              >
                {precioFormateado}
              </Typography>
            </div>

            <Divider />

            <div style={{ display: "flex", justifyContent: "center" }}>
              {selectedCheckbox && (
                <>
                  <Button
                    style={{
                      borderRadius: "20px",
                      fontFamily: '"Roboto Condensed", sans-serif',
                    }}
                    color="error"
                    variant="contained"
                    onClick={() => handleSubmit()}
                  >
                    Iniciar Compra
                  </Button>
                </>
              )}
            </div>

            <div>
              {estadoError && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "1rem",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    style={{
                      fontWeight: 100,
                      fontFamily: '"Roboto Condensed", sans-serif',
                      color: "#c4072c",
                    }}
                  >
                    La compra minima en el sitio mayorista es de $40.000,00
                  </Typography>
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <Link
                style={{
                  fontSize: "50%",
                  fontFamily: '"Roboto Condensed", sans-serif',
                }}
                to="/"
              >
                Ver mas productos
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <EmptyCartMessage />
      )}
    </div>
  );
};

export default Cart;
