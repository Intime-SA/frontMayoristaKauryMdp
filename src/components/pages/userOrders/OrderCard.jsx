import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Alert,
  AlertTitle,
  Tooltip,
} from "@mui/material";
import {
  getDoc,
  collection,
  getDocs,
  updateDoc,
  addDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Link } from "react-router-dom";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import ModalPDF from "./ModalPDF";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const OrderCard = ({ dataOrder, setChangeStatus, changeStatus, openForm }) => {
  const [dataCliente, setDataCliente] = useState(null);
  const [idClient, setIdClient] = useState("");
  const [cardBackgroundColor, setCardBackgroundColor] = useState("#ffffff"); // Estado inicial: blanco

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {}, [changeStatus]);

  useEffect(() => {
    // Cambiar el color de fondo de la tarjeta según el estado
    if (dataOrder.status === "archivada") {
      setCardBackgroundColor("#e0e0e0"); // Gris un poco más fuerte
    } else {
      setCardBackgroundColor("#ffffff"); // Blanco
    }
  }, [dataOrder.status]);

  useEffect(() => {
    const obtenerDataCliente = async () => {
      try {
        const documentSnapshot = await getDoc(dataOrder.client);

        if (documentSnapshot.exists()) {
          setDataCliente(documentSnapshot.data());
        } else {
          console.error("El documento del cliente no existe.");
        }
      } catch (error) {
        console.error("Error al obtener los datos del cliente:", error);
      }
    };

    obtenerDataCliente();
  }, [dataOrder]);

  const estadoRender = (estado) => {
    if (estado === "nueva") {
      return (
        <Alert severity="warning">
          <AlertTitle style={{ fontSize: "100%", height: "0.5rem" }}>
            Nueva
          </AlertTitle>
          {/* <strong>El pedido ya fue preparado</strong> */}
        </Alert>
      );
    } else if (estado === "empaquetada") {
      return (
        <Alert
          variant="filled"
          severity="info"
          style={{
            fontSize: "50%",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          Empaquetada
        </Alert>
      );
    } else if (estado === "pagoRecibido") {
      return (
        <Alert variant="filled" severity="success">
          <AlertTitle
            style={{
              fontSize: "100%",
              display: "flex",
              alignItems: "center",
              width: "100%",
              marginTop: "0.1rem",
            }}
            variant="outlined"
          >
            Pago Recibido
          </AlertTitle>
          {/* <strong>El pedido fue entregado con exito</strong> */}
        </Alert>
      );
    } else if (estado === "enviada") {
      return (
        <Alert variant="filled" severity="warning">
          <AlertTitle style={{ fontSize: "100%", height: "0.5rem" }}>
            En Distribucion
          </AlertTitle>
          {/* <strong>El pedido fue entregado con exito</strong> */}
        </Alert>
      );
    } else if (estado === "cancelada") {
      return (
        <Alert
          variant="outlined"
          severity="error"
          style={{
            fontSize: "50%",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          Cancelado
        </Alert>
      );
    } else if (estado === "archivada") {
      return (
        <Alert variant="contained" color="info">
          <AlertTitle>Archivada</AlertTitle>
        </Alert>
      );
    }
  };

  const phoneNumber = () => {
    let number = 2233485438;

    handleWhatsAppClick(number, dataOrder.numberOrder);
  };

  const handleWhatsAppClick = (number, numberOrder) => {
    // Cambia '1234567890' por el número de teléfono del cliente
    const phoneNumber = `54${number}`;
    const message = `Hola! Te escribo por el pedido ID #${numberOrder}`;

    // Crea el enlace con el API de WhatsApp Business
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Abre el enlace en una nueva ventana
    window.open(whatsappLink, "_blank");
  };

  const handleDownloadPDF = () => {
    // Lógica para descargar el PDF
  };

  return (
    <Card
      sx={{
        maxWidth: isMobile ? "100vw" : "40vw",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        backgroundColor: cardBackgroundColor, // Color de fondo dinámico
      }}
    >
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            style={{ textAlign: "left", fontSize: "1.2rem" }}
            gutterBottom
            variant="h6"
            component="div"
            color="#3f51b5"
          >
            <h6 style={{ fontSize: "150%", fontFamily: '"Kanit", sans-serif' }}>
              ORDEN{" "}
              <strong style={{ fontFamily: '"Montserrat", sans-serif' }}>
                #{dataOrder.numberOrder}
              </strong>
              <PDFDownloadLink
                style={{ margin: "1rem" }}
                document={
                  <ModalPDF data={dataOrder} dataCliente={dataCliente} />
                }
                fileName={"OrdenNumero-" + dataOrder.numberOrder}
              >
                {({ blob, url, loading, error }) => (
                  <Tooltip title="Descargar">
                    <Button onClick={handleDownloadPDF}>
                      <span class="material-symbols-outlined">print</span>
                    </Button>
                  </Tooltip>
                )}
              </PDFDownloadLink>
            </h6>
          </Typography>

          <div>{estadoRender(dataOrder.status)}</div>
        </div>
        <Tooltip title="Contacto">
          <div
            style={{
              width: "100%",
              textAlign: "right",
            }}
          >
            <Button
              style={{ marginBottom: "0.5rem" }}
              onClick={() => phoneNumber(/* dataCliente?.telefono */)}
            >
              <img
                style={{ marginTop: "0.5rem" }}
                width="25rem"
                src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/1384023%20(1).png?alt=media&token=51c00452-bfcd-448d-b520-a62d44d58788"
                alt="logowsp"
              />
            </Button>
          </div>
        </Tooltip>

        <Typography
          variant="body1"
          color="text.secondary"
          fontSize="1.2rem"
          style={{ fontFamily: '"Kanit", sans-serif' }}
        >
          <strong style={{ fontFamily: '"Kanit", sans-serif' }}>Fecha:</strong>{" "}
          {new Date(dataOrder.date.seconds * 1000).toLocaleString()}
          <Divider />
          <div style={{ display: "flex", justifyContent: "flex-start" }}></div>
          <br />
          {dataOrder.tipoEnvio === 1 ? (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{ fontSize: "150%", color: "red" }}
                class="material-symbols-outlined"
              >
                local_shipping
              </span>
              <Typography
                variant="body2"
                color="error"
                style={{ marginLeft: "1rem" }}
              >
                {dataOrder.envioSeleccionado === "envioDomicilio" ? (
                  <Typography
                    variant="body2"
                    color="error"
                    style={{
                      marginLeft: "0px",
                      fontSize: "1.2rem",
                      fontWeight: "900",
                      marginBottom: "0px",
                      fontFamily: '"Kanit", sans-serif',
                    }}
                  >
                    Domicilio cliente
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    color="error"
                    style={{
                      marginLeft: "0px",
                      fontSize: "1.2rem",
                      fontWeight: "900",
                      marginBottom: "0px",
                      fontFamily: '"Kanit", sans-serif',
                    }}
                  >
                    Sucursal a Convenir
                  </Typography>
                )}
              </Typography>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex" }}>
                <span
                  style={{ fontSize: "150%", color: "red" }}
                  class="material-symbols-outlined"
                >
                  store
                </span>
                <Typography
                  variant="body2"
                  color="error"
                  style={{
                    marginLeft: "1rem",
                    fontSize: "1.2rem",
                    fontWeight: "900",
                    fontFamily: '"Kanit", sans-serif',
                  }}
                >
                  Retiro por sucursal
                </Typography>
              </div>
            </div>
          )}
          <Divider />
          <br />
          <strong style={{ fontFamily: '"Kanit", sans-serif' }}>
            Productos:
          </strong>
          {/* Agregar un contenedor con estilos de desplazamiento */}
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <List>
              {dataOrder.orderItems.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="center">
                    <div>
                      <img
                        style={{
                          width: "5rem",
                          borderRadius: "30%",
                          margin: "1rem",
                        }}
                        src={item.image}
                        alt="imagen"
                      />
                    </div>

                    <ListItemText
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            style={{ fontFamily: '"Montserrat", sans-serif' }}
                          >
                            Articulo:{" "}
                            <strong
                              style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                              #{item.name}
                            </strong>
                            <Divider />
                            <br />
                            Subtotal:{" "}
                            <strong
                              style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                              ${item.subtotal.toLocaleString("es-AR")}
                            </strong>
                            <br />
                            Precio Unitario: $
                            <strong
                              style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                              {item.unit_price.toLocaleString("es-AR")}
                            </strong>
                            <br />
                            Cantidad:
                            <strong
                              style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                              {" "}
                              {item.quantity}
                            </strong>
                            <br />
                            Talle:{" "}
                            <strong
                              style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                              {item.talle}
                            </strong>
                            <br />
                            Color:{" "}
                            <strong
                              style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                              {item.color}
                            </strong>
                            <br />
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index !== dataOrder.orderItems.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              marginRight: "2rem",
              color: "#c4072c",
              marginTop: "1rem",
              paddingTop: "0px",
            }}
          >
            <h6
              style={{
                fontSize: "1.5rem",
                fontWeight: "900",
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              TOTAL:
            </h6>
            <h5
              style={{
                fontFamily: '"Kanit", sans-serif',
                fontSize: "1.5rem",
                fontWeight: "900",
              }}
            >
              ARS ${" "}
              {dataOrder.total.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
            </h5>
          </div>
          <br />
          {/*           <strong style={{ fontFamily: '"Kanit", sans-serif' }}>
            Información de Entrega:
          </strong>
          <p style={{ fontFamily: '"Kanit", sans-serif' }}>
            <br />
            <Divider />
            País: <strong>Argentina</strong>
            <br />
            Provincia: <strong>{dataOrder.infoEntrega.estado}</strong>
            <br />
            Ciudad: <strong>{dataOrder.infoEntrega.ciudad}</strong>
            <br />
            Código Postal: <strong>{dataOrder.infoEntrega.codigoPostal}</strong>
            <br />
            Número: <strong>{dataOrder.infoEntrega.numero}</strong>
            <br />
            Calle: <strong>{dataOrder.infoEntrega.calle}</strong>
            <br />
            Piso/Dpto: <strong>{dataOrder.infoEntrega.pisoDpto}</strong>
            <Divider />
            <br />
          </p> */}
          {dataOrder.status === "archivada" && (
            <div style={{ fontSize: "200%" }}>
              {" "}
              {estadoRender(dataOrder.lastState)}
            </div>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
