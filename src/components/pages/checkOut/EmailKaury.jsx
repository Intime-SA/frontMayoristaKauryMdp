import React, { useEffect } from "react";
import emailjs from "emailjs-com";

const EmailKaury = ({ userOrder, email, toname }) => {
  const frase = [
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "El futuro pertenece a quienes creen en la belleza de sus sueños.",
    "Cada pequeño paso te acerca más a tus grandes metas.",
    "Los grandes logros son el resultado de pequeños esfuerzos que se hacen día tras día.",
    "Los sueños se hacen realidad con determinación y perseverancia en cada paso del camino.",
    "El camino hacia el éxito está pavimentado con pequeños pasos de valentía.",
    "Cada paso adelante es un paso más cerca de alcanzar tus sueños.",
    "No subestimes el poder de dar un pequeño paso cada día hacia tus metas.",
    "El progreso no es una línea recta, es el resultado de pequeños esfuerzos consistentes.",
    "Las grandes metas se alcanzan con pequeños pasos y grandes dosis de determinación.",
    "El único modo de hacer un gran trabajo es amar lo que haces.",
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "El futuro pertenece a quienes creen en la belleza de sus sueños.",
    "El éxito no es definitivo, el fracaso no es fatal: es el coraje para continuar lo que cuenta.",
    "La diferencia entre lo imposible y lo posible radica en la determinación de una persona.",
    "No te preguntes si es posible; pregúntate cómo lo harás.",
    "No importa lo lento que vayas, siempre y cuando no te detengas.",
    "El éxito no es la clave de la felicidad. La felicidad es la clave del éxito. Si amas lo que estás haciendo, tendrás éxito.",
    "El emprendimiento es vivir unos años de tu vida como la mayoría no quiere, para que puedas vivir el resto de tu vida como la mayoría no puede.",
    "La única forma de hacer un gran trabajo es amar lo que haces.",
    "El único límite para tus logros es tu imaginación.",
    "Cada día es una nueva oportunidad para ser mejor que ayer.",
    "El éxito no es el resultado de un acto espontáneo, sino el resultado de años de esfuerzo constante.",
    "Sueña en grande y atrévete a fallar.",
    "El éxito no es definitivo, el fracaso no es fatal.",
    "El emprendimiento no es un destino, es un viaje. Disfruta del viaje y celebra cada paso del camino.",
    "El éxito no es el resultado de un acto espontáneo, sino el resultado de años de esfuerzo constante.",
    "Sueña en grande y atrévete a fallar.",
    "El único límite para tus logros es tu imaginación.",
    "Cada día es una nueva oportunidad para cambiar tu vida.",
  ];
  console.log(frase);

  const seleccionarFraseAleatoria = () => {
    const indice = Math.floor(Math.random() * frase.length);
    return frase[indice];
  };

  const sendEmail = (subject, frase) => {
    const asunto = `¡Confirmacion de Compra! - Numero de Orden: #${subject}`;
    const datosOrder = `
      Cliente: ${toname}
      ${email}

      TOTAL A PAGAR: ${userOrder.total.toLocaleString("es-ES", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}

      Tipo de envio: 
      Envio a domicilio.
  
      Datos de envio:
      Calle: ${userOrder.infoEntrega.calle} ${" "} ${
      userOrder.infoEntrega.numero
    }
      Ciudad: ${userOrder.infoEntrega.ciudad}
      Codigo Postal: ${userOrder.infoEntrega.codigoPostal}
      Provincia: ${userOrder.infoEntrega.provincia}

    `;
    const datosOrderSucursal = `
    Cliente: ${toname}
      ${email}

    TOTAL A PAGAR: ${userOrder.total.toLocaleString("es-ES", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}

    Tipo de envio: 
    Sucursal a coordinar con el cliente.

    Ciudad: ${userOrder.infoEntrega.ciudad}
    Codigo Postal: ${userOrder.infoEntrega.codigoPostal}
    Provincia: ${userOrder.infoEntrega.provincia}

  `;

    const datosOrderShowroom1 = `
  Cliente: ${toname}
      ${email}
      Ciudad: ${userOrder.infoEntrega.ciudad}
      Codigo Postal: ${userOrder.infoEntrega.codigoPostal}
      Provincia: ${userOrder.infoEntrega.provincia}

  TOTAL A PAGAR: ${userOrder.total.toLocaleString("es-ES", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}

  Tipo de envio: 
  Retiro por showroom > Jose Mármol 970, timbre 104 de 10 a 17hs, MAR DEL PLATA



`;
    const datosOrderShowroom2 = `
Cliente: ${toname}
      ${email}
      Ciudad: ${userOrder.infoEntrega.ciudad}
      Codigo Postal: ${userOrder.infoEntrega.codigoPostal}
      Provincia: ${userOrder.infoEntrega.provincia}

  TOTAL A PAGAR: ${userOrder.total.toLocaleString("es-ES", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}

  Tipo de envio: 
  Retiro por showroom > Rivadavia 5931. Planta Alta A, de 10 a 17hs. MAR DEL PLATA



`;

    if (
      userOrder.tipoEnvio === 1 &&
      userOrder.envioSeleccionado === "envioDomicilio"
    ) {
      emailjs
        .send(
          "service_trtdi6v",
          "template_opc2fbv",
          {
            from_email: "kaurymdp.store@gmail.com",
            subject: asunto,
            message: datosOrderSucursal,
            frase: frase,
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
      userOrder.tipoEnvio === 1 &&
      userOrder.envioSeleccionado === "envioSucursal"
    ) {
      emailjs
        .send(
          "service_trtdi6v",
          "template_opc2fbv",
          {
            from_email: "kaurymdp.store@gmail.com",
            subject: asunto,
            message: datosOrder,
            frase: frase,
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
    } else if (userOrder.tipoEnvio === 2 && userOrder.sucursal === 1) {
      emailjs
        .send(
          "service_trtdi6v",
          "template_opc2fbv",
          {
            from_email: "kaurymdp.store@gmail.com",
            subject: asunto,
            message: datosOrderShowroom1,
            frase: frase,
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
    } else if (userOrder.tipoEnvio === 2 && userOrder.sucursal === 2) {
      emailjs
        .send(
          "service_trtdi6v",
          "template_opc2fbv",
          {
            from_email: "kaurymdp.store@gmail.com",
            subject: asunto,
            message: datosOrderShowroom2,
            frase: frase,
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
    }
  };

  const fraseAleatoria = seleccionarFraseAleatoria();

  sendEmail(userOrder.numberOrder, fraseAleatoria);

  return <div></div>;
};

export default EmailKaury;
