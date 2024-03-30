import React, { useState, useEffect, useContext } from "react";
import CustomStepper from "../home/cart/CustomStepper";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Button, Typography } from "@mui/material";
import DetallesPedido from "./DetallesPedido";
import DetalleCuenta from "./DetalleCuenta";
import EmailModalOrder from "./EmailModalOrder";
import emailjs from "emailjs-com";
import { number } from "yup";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import useMediaQuery from "@mui/material/useMediaQuery";

const Pago = () => {
  const [userOrder, setUserOrder] = useState(null);
  const [userRef, setUserRef] = useState(null);
  const [numberOrder, setNumberOrder] = useState();
  const [renderOrder, setRenderOrder] = useState(false);
  const [email, setEmail] = useState("");
  const [toname, setToname] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0); // Hace scroll al tope de la página
  }, []);

  const { clearCart } = useContext(CartContext);

  const isMobile = useMediaQuery("(max-width:760px)");
  const sendEmail = (subject) => {
    const asunto = `¡Confirmacion de Compra! - Numero de Orden: #${subject}`;

    console.log(userOrder.tipoDePago.pagoEfectivo);

    // Datos bancarios
    const datosBancarios = `
      Alias a transferir: KAURYMAYORISTA
      CBU: 0000003100037054721391
      Titular de cuenta: RODOLFO GUILLERMO OTERO
      Recorda enviar el comprobante de pago + número de orden al WhatsApp (223) 348-5438
  
      Datos de envio:
      Calle: ${userOrder.infoEntrega.calle} ${" "} ${
      userOrder.infoEntrega.numero
    }
      Ciudad: ${userOrder.infoEntrega.ciudad}
      Codigo Postal: ${userOrder.infoEntrega.codigoPostal}
      Provincia: ${userOrder.infoEntrega.provincia}

    `;
    const datosBancariosShowroom = `
    Alias a transferir: KAURYMAYORISTA
    CBU: 0000003100037054721391
    Titular de cuenta: RODOLFO GUILLERMO OTERO
    Recorda enviar el comprobante de pago + número de orden al WhatsApp (223) 348-5438  
    
    Te esperamos en el showroom para retirar tu pedido.
    
    `;

    if (userOrder.tipoEnvio === 1) {
      emailjs
        .send(
          "service_trtdi6v",
          "template_nnhw8ep",
          {
            from_email: email,
            subject: asunto,
            message: datosBancarios,
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
    } else if (
      userOrder.tipoDePago.pagoEfectivo === true &&
      userOrder.tipoEnvio === 2
    ) {
      emailjs
        .send(
          "service_trtdi6v",
          "template_nnhw8ep",
          {
            from_email: email,
            subject: asunto,
            message: `Modalidad de pago: SOLAMENTE EFECTIVO. \n Transferencia con recargo 15%`,
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
    } else if (
      userOrder.tipoEnvio === 2 &&
      userOrder.tipoDePago.pagoEfectivo === false
    ) {
      emailjs
        .send(
          "service_trtdi6v",
          "template_nnhw8ep",
          {
            from_email: email,
            subject: asunto,
            message: datosBancariosShowroom,
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
    } else {
      console.log("no se pudo enviar correo");
    }
  };

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
      const numberOrder = userOrder.numberOrder;
      setNumberOrder(numberOrder);

      const obtenerEmail = async () => {
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setEmail(userData.email);
            setToname(userData.name);
          } else {
            console.log("No se encontró el documento del usuario");
          }
        } catch (error) {
          console.error("Error al obtener el email:", error);
        }
      };

      obtenerEmail();
    }
  }, [userOrder]);

  const navigate = useNavigate();
  const volver = () => {
    navigate("/");
  };

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
    setRenderOrder(true);
    sendEmail(numberOrder);
    clearCart();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: isMobile ? "90vw" : "60vw",
      }}
    >
      {!renderOrder && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            flexGrow: 7,
            marginRight: "1rem",
            width: "80%",
          }}
        >
          <CustomStepper step={2} />
        </div>
      )}

      {!renderOrder && (
        <div
          style={{
            borderRadius: "10px",
            border: "1px solid #D27611",
            padding: "0.5rem",
            margin: "0.5rem",
            color: "#D27611",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "auto",
            backgroundColor: "#DD083126",
          }}
        >
          <div>
            <h6
              style={{
                fontFamily: '"Roboto Condensed", sans-serif',
                fontSize: "40%",
                color: "#912137",
              }}
            >
              <span class="material-symbols-outlined">info</span> Por cualquier
              consulta que tengas no dudes en escribirnos por WhatsApp
              2233485438
            </h6>
          </div>
        </div>
      )}

      <div style={{ width: "100%" }}>
        {renderOrder && (
          <>
            <div>
              <div
                style={{
                  borderRadius: "10px",
                  border: "1px solid #4CAF50", // Cambiar el color del borde al color de éxito
                  padding: "0.5rem",
                  margin: "0.5rem",
                  color: "#4CAF50", // Cambiar el color del texto al color de éxito
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "auto",
                  backgroundColor: "#E8F6E4", // Cambiar el color de fondo al color de éxito más claro
                }}
              >
                <div>
                  <h6
                    style={{
                      fontFamily: '"Roboto Condensed", sans-serif',
                      fontSize: "40%",
                      color: "#388E3C", // Cambiar el color del texto al color de éxito más oscuro
                    }}
                  >
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>{" "}
                    SU ORDEN DE COMPRA FUE CREADA CON ÉXITO!
                  </h6>
                </div>
              </div>
            </div>
            <Typography
              variant="body2"
              style={{
                fontFamily: '"Roboto Condensed", sans-serif',
                marginLeft: "2rem",
              }}
            >
              Numero de Orden #{numberOrder}
            </Typography>
            {userOrder.tipoEnvio === 1 && <DetalleCuenta />}
          </>
        )}
        {userOrder && (
          <DetallesPedido
            userOrder={userOrder}
            setRenderOrder={setRenderOrder}
          />
        )}
        {userOrder && (
          <div
            style={{
              display: "flex",
              justifyContent: " center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {renderOrder && (
              <Button onClick={() => volver()} variant="contained" color="info">
                Volver
              </Button>
            )}
          </div>
        )}
      </div>
      {!renderOrder && (
        <div
          style={{
            display: "flex",
            justifyContent: " center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="error"
            style={{ borderRadius: "50px" }}
            onClick={realizarPedido}
          >
            REALIZAR PEDIDO
          </Button>
          <Link to="/checkout">
            <Button variant="contained" color="info">
              Volver
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Pago;
