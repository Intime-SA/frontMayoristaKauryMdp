import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  LinearProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import OrderCard from "./OrderCard";
import emailjs from "emailjs-com";

function Row(props) {
  const {
    row,
    setOpenOrder,
    setDataOrder,
    setChangeStatus,
    changeStatus,
    openOrder,
    selected,
    handleChangeCheckbox,
    setProgress,
  } = props;
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [nombreCliente, setNombreCliente] = useState(null);
  const [status, setStatus] = useState("Estado no encontrado");
  const [openModalEmail, setOpenModalEmail] = useState(false);
  const [closeModalEmail, setCloseModalEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [toname, setToname] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const openDataOrderCard = async (id) => {
    try {
      const refCollection = collection(db, "userOrders");
      const snapShotCollection = await getDocs(refCollection);

      setOpenOrder(true);

      snapShotCollection.forEach((element) => {
        const data = element.data();
        const orderId = element.id;

        console.log(data);

        if (orderId === id) {
          setDataOrder({ id: orderId, ...data });
        }
      });

      setProgress(false);
    } catch (error) {
      console.error("Error al abrir los datos de la orden:", error);
      setProgress(false);
    }
  };

  const open2 = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const estadoRender = (estado) => {
    if (estado === "Nueva") {
      return (
        <Alert severity="warning">
          <AlertTitle
            style={{
              marginTop: "10%",
              fontSize: "75%",
              fontFamily: '"Kanit", sans-serif',
              textAlign: "center",
            }}
          >
            {!isMobile && "Pendiente"}
          </AlertTitle>
          {/* <strong>El pedido ya fue preparado</strong> */}
        </Alert>
      );
    } else if (estado === "Empaquetada") {
      return (
        <Alert
          style={{
            fontSize: "75%",
            fontFamily: '"Kanit", sans-serif',
            textAlign: "center",
          }}
          size="small"
          severity="info"
        >
          {!isMobile && "Empaquetada"}
        </Alert>
      );
    } else if (estado === "Pago Recibido") {
      return (
        <Alert severity="success">
          <AlertTitle
            style={{
              marginTop: "10%",
              fontSize: "75%",
              fontFamily: '"Kanit", sans-serif',
              textAlign: "center",
            }}
            variant="outlined"
          >
            {!isMobile && "Pago Recibido"}
          </AlertTitle>
          {/* <strong>El pedido fue entregado con exito</strong> */}
        </Alert>
      );
    } else if (estado === "Enviada") {
      return (
        <Alert variant="outlined" severity="success">
          <AlertTitle
            style={{
              marginTop: "10%",
              fontSize: "75%",
              fontFamily: '"Kanit", sans-serif',
              textAlign: "center",
              display: "flex",
              marginLeft: "1rem",
            }}
          >
            {!isMobile && "En Distribucion"}
          </AlertTitle>
          {/* <strong>El pedido fue entregado con exito</strong> */}
        </Alert>
      );
    } else if (estado === "Cancelada") {
      return (
        <Alert
          style={{
            fontSize: "100%",
            fontFamily: '"Kanit", sans-serif',
            textAlign: "center",
          }}
          variant="outlined"
          severity="error"
        >
          <AlertTitle
            style={{
              fontSize: "75%",
              fontFamily: '"Kanit", sans-serif',
              textAlign: "center",
            }}
          >
            {!isMobile && "Cancelada"}
          </AlertTitle>
        </Alert>
      );
    } else if (estado === "Archivada") {
      return (
        <Alert variant="contained" color="info">
          <AlertTitle
            style={{
              fontSize: "100%",
              fontFamily: '"Kanit", sans-serif',
              textAlign: "center",
            }}
          >
            {!isMobile && "Archivada"}
          </AlertTitle>
        </Alert>
      );
    }
  };

  useEffect(() => {
    const obtenerNombre = async () => {
      try {
        const nombre = await obtenerNombreCliente(row.client);
        setNombreCliente(nombre);
      } catch (error) {
        console.error("Error al obtener el nombre del cliente:", error);
      }
    };
    const calcularStatusCliente = async (estado) => {
      try {
        const refCollection = collection(db, "orderStatus");
        const querySnapshot = await getDocs(refCollection);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (doc.id === estado) {
            setStatus(data.name);
          }
        });

        return status;
      } catch (error) {
        console.error("Error al calcular el estado:", error);
        throw error;
      }
    };

    calcularStatusCliente(row.status);
    obtenerNombre();
  }, [row.client.id, row.status]);

  const obtenerNombreCliente = async (clientRef) => {
    // Corregir el nombre del parámetro
    try {
      // Obtener el documento del cliente utilizando la referencia directa
      const clienteDoc = await getDoc(clientRef);

      // Verificar si el documento del cliente existe
      if (clienteDoc.exists()) {
        // Si existe, obtener los datos del cliente y construir el nombre
        const clienteData = clienteDoc.data();
        const nombreCliente = clienteData.name + " " + clienteData.apellido; // Suponiendo que el campo del nombre del cliente se llama "nombre"
        return nombreCliente;
      } else {
        // Si el documento del cliente no existe, devolver un mensaje de cliente no encontrado
        return "Cliente no encontrado";
      }
    } catch (error) {
      console.error("Error al obtener el nombre del cliente:", error);
      throw error; // Lanzar el error para manejarlo fuera de la función
    }
  };

  const calcularTotalOrden = (productos) => {
    let total = 0;
    for (const producto of productos) {
      total += producto.subtotal;
    }
    return total;
  };

  const date = new Date(row.date.seconds * 1000);

  // Formatear la fecha como string en formato dd/mm/yyyy
  const formattedFechaInicio = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  const handleOpenModal = async (clientRef) => {
    try {
      const clienteDoc = await getDoc(clientRef);

      if (clienteDoc.exists()) {
        // Si existe, obtener los datos del cliente y construir el nombre
        const clienteData = clienteDoc.data();
        const nombreCliente = clienteData.name;
        const emailCliente = clienteData.email; // Suponiendo que el campo del nombre del cliente se llama "nombre"

        // Establecer los valores de toname, email y abrir el modal
        setToname(nombreCliente);
        setEmail(emailCliente);
        setOpenModalEmail(true);

        return nombreCliente;
      } else {
        console.log("El documento del cliente no existe.");
        return null;
      }
    } catch (error) {
      console.error("Error al abrir el modal:", error);
      return null;
    }
  };

  const sendEmail = (subject, message, toname) => {
    emailjs
      .send(
        "service_trtdi6v",
        "template_59j1wkl",
        {
          from_email: email,
          subject: subject,
          message: message,
          to_name: toname,
        },
        "uAivPuB-RJ_3LBVlN"
      )
      .then(
        (response) => {
          console.log("Correo electrónico enviado con éxito:", response);
        },
        (error) => {
          console.error("Error al enviar el correo electrónico:", error);
        }
      );
  };

  const agregarDocumentoAFirebase = async (
    docSnapshot,
    lastState,
    nuevoEstado
  ) => {
    try {
      const newCollectionRef = collection(db, "archivadas"); // Reemplaza "nuevaColeccion" con el nombre de tu nueva colección
      await addDoc(newCollectionRef, {
        ...docSnapshot.data(), // Copia todos los campos existentes del documento
        lastState: lastState,
        status: nuevoEstado,
      });
      console.log("Documento guardado en la nueva colección correctamente.");
    } catch (error) {
      console.error(
        "Error al guardar el documento en la nueva colección:",
        error
      );
    }
  };

  return (
    <React.Fragment>
      {row.status && (
        <TableRow sx={{ "& > *": { borderBottom: "unset" }, width: "100%" }}>
          {!isMobile && (
            <TableCell style={{ fontSize: "1.2rem" }}>
              <Checkbox
                onClick={() => handleChangeCheckbox(row)} // Manejar los cambios en el checkbox
                inputProps={{ "aria-label": "controlled" }}
              />
            </TableCell>
          )}

          {!isMobile && (
            <TableCell
              align="center"
              style={{ width: "5%", fontSize: "1.2rem" }}
            >
              <Button
                style={{
                  fontSize: "1.2rem",
                  fontFamily: '"Kanit", sans-serif',
                }}
                onClick={() => openDataOrderCard(row.id)}
              >
                #{" "}
                <strong style={{ fontFamily: '"Kanit", sans-serif' }}>
                  {" "}
                  {row.numberOrder}{" "}
                </strong>
              </Button>
            </TableCell>
          )}

          <TableCell
            style={{
              width: "15%",
              fontSize: "1.2rem",
              fontFamily: '"Montserrat", sans-serif',
            }}
          >
            {formattedFechaInicio}
          </TableCell>
          <TableCell
            style={{
              width: "15%",
              fontSize: "1.2rem",
              fontFamily: '"Kanit", sans-serif',
            }}
            align="right"
          >
            <p
              style={{
                fontFamily: "sans-serif",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
                fontSize: "1.2rem",
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              {`$${calcularTotalOrden(row.orderItems).toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </p>
          </TableCell>
          {!isMobile && (
            <TableCell
              align="right"
              style={{ width: "5%", fontSize: "1.2rem" }}
              component="th"
              scope="row"
            >
              <IconButton
                style={{ marginLeft: "1rem" }}
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
          )}

          <TableCell style={{ width: "15%", fontSize: "1.2rem" }} align="right">
            <Button
              style={{
                fontSize: "1.2rem",
                fontFamily: '"Kanit", sans-serif',
              }}
              onClick={() => openDataOrderCard(row.id)}
            >
              <div>{estadoRender(status)}</div>
            </Button>
          </TableCell>
        </TableRow>
      )}
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
              ></Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow style={{ fontFamily: '"Kanit", sans-serif' }}>
                    <TableCell style={{ fontFamily: '"Kanit", sans-serif' }}>
                      ID Producto
                    </TableCell>
                    <TableCell
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                      align="right"
                    >
                      Cantidad
                    </TableCell>
                    <TableCell
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                      align="right"
                    >
                      Precio Unitario
                    </TableCell>
                    <TableCell
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                      align="right"
                    >
                      SubTotal
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orderItems.map((producto) => (
                    <TableRow
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                      key={producto.productId}
                    >
                      {/*                       <TableCell>
                        <img
                          style={{
                            width: "3rem",
                            borderRadius: "50px",
                            height: "3rem",
                          }}
                          src={producto.image}
                          alt=""
                        />
                      </TableCell> */}
                      <TableCell
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        align="left"
                        component="th"
                        scope="row"
                      >
                        {producto.productId}{" "}
                        {/* Reemplaza 'nombre' con la propiedad correcta que contiene el nombre del producto */}
                      </TableCell>
                      <TableCell align="right">{producto.quantity}</TableCell>{" "}
                      {/* Reemplaza 'cantidad' con la propiedad correcta que contiene la cantidad del producto */}
                      <TableCell
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        align="right"
                      >
                        ${" "}
                        {producto.unit_price.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>{" "}
                      {/* Reemplaza 'precio' con la propiedad correcta que contiene el precio unitario del producto */}
                      <TableCell
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                        align="right"
                      >
                        ${" "}
                        {producto.subtotal.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function UserOrdersDetail({
  ordersLenght,
  orders,
  setChangeStatus,
  changeStatus,
  openForm,
  currentPage,
}) {
  const [openOrder, setOpenOrder] = useState(false);
  const [dataOrder, setDataOrder] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [progress, setProgress] = useState(false);
  const [totalOrders, setTotalOrders] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (openOrder) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [openOrder]);

  const handleCheckboxChange = (order) => {
    // Verifica si la orden ya está seleccionada
    const selectedIndex = selectedOrders.findIndex(
      (selectedOrder) => selectedOrder.id === order.id
    );
    const newSelectedOrders = [...selectedOrders];

    // Si la orden ya está seleccionada, la quita del arreglo; de lo contrario, la agrega
    if (selectedIndex === -1) {
      newSelectedOrders.push(order);
    } else {
      newSelectedOrders.splice(selectedIndex, 1);
    }

    setSelectedOrders(newSelectedOrders);
  };
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "nowrap",
        flexDirection: isMobile ? "column-reverse" : "row",
        width: "100%",
        height: "auto",
        backgroundColor: "transparent",
        zoom: "",
        justifyContent: "center",
        alignItems: isMobile ? "center" : "",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <h6> Pagina: {currentPage}</h6>
        </div>
        <TableContainer
          component={Paper}
          style={{ backgroundColor: "rgba(249, 214, 224, 0.6)" }}
        >
          <Table
            aria-label="collapsible table"
            style={{ backgroundColor: "white" }}
          >
            <TableHead style={{ backgroundColor: "#E0E0E0" }}>
              {!isMobile && (
                <TableCell
                  align="center"
                  style={{
                    width: "5%",
                    paddingLeft: "8px",
                    fontFamily: '"Kanit", sans-serif',
                    fontSize: "1.5rem",
                  }}
                >
                  <span class="material-symbols-outlined">check_box</span>
                </TableCell>
              )}
              {!isMobile && (
                <TableCell
                  align="center"
                  style={{
                    width: "5%",
                    paddingLeft: "8px",
                    fontFamily: '"Kanit", sans-serif',
                    fontSize: "1.5rem",
                    fontSize: "1.5rem",
                  }}
                >
                  ID
                </TableCell>
              )}

              <TableCell
                align="left"
                style={{
                  width: "30%",
                  fontFamily: '"Kanit", sans-serif',
                  fontSize: "1.5rem",
                }}
              >
                Fecha
              </TableCell>
              <TableCell
                align="center"
                style={{
                  width: "15%",
                  fontFamily: '"Kanit", sans-serif',
                  fontSize: "1.5rem",
                }}
              >
                Total
              </TableCell>
              {!isMobile && (
                <TableCell
                  align="right"
                  style={{
                    width: "5%",
                    fontFamily: '"Kanit", sans-serif',
                    fontSize: "1.5rem",
                  }}
                >
                  Productos
                </TableCell>
              )}

              <TableCell
                align="center"
                style={{
                  width: "10%",
                  fontFamily: '"Kanit", sans-serif',
                  fontSize: "1.5rem",
                }}
              >
                {!isMobile && "Estado"}
              </TableCell>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <Row
                  key={order.id}
                  row={order}
                  setOpenOrder={setOpenOrder}
                  setDataOrder={setDataOrder}
                  setChangeStatus={setChangeStatus}
                  changeStatus={changeStatus}
                  openOrder={openOrder}
                  selected={selectedOrders} // Indicar si la orden está seleccionada
                  handleChangeCheckbox={handleCheckboxChange}
                  setProgress={setProgress} // Pasar la función de manejo de cambio del checkbox
                />
              ))}
            </TableBody>
          </Table>
          {progress && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}
        </TableContainer>
      </div>

      {openOrder ? (
        <div
          style={{
            width: isMobile ? "100vw" : "60vw",
            marginLeft: "0.5rem",
            marginRigth: isMobile ? "0rem" : "0.5rem",
            borderRadius: "5px",
            marginBottom: "1rem",
          }}
        >
          <OrderCard
            dataOrder={dataOrder}
            setChangeStatus={setChangeStatus}
            changeStatus={changeStatus}
            openForm={openForm}
          ></OrderCard>
        </div>
      ) : null}
    </div>
  );
}

UserOrdersDetail.propTypes = {
  products: PropTypes.array.isRequired, // Definiendo las propTypes
};

export default UserOrdersDetail;
