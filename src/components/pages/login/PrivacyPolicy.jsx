import React from "react";
import { Box, Typography } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Política de Privacidad
      </Typography>
      <Typography variant="body1" paragraph>
        Al utilizar nuestro servicio de inicio de sesión, aceptas que
        recopilemos y procesemos tu información personal de acuerdo con nuestra
        política de privacidad. Esto incluye tu dirección de correo electrónico
        y cualquier otra información que proporciones durante el proceso de
        inicio de sesión.
      </Typography>
      <Typography variant="body1" paragraph>
        Utilizamos tu información personal para autenticarte y proporcionarte
        acceso a nuestra plataforma. También podemos utilizar tu dirección de
        correo electrónico para comunicarnos contigo sobre tu cuenta y enviar
        notificaciones relacionadas con el servicio.
      </Typography>
      <Typography variant="body1" paragraph>
        Tu privacidad es importante para nosotros y nos comprometemos a proteger
        tu información personal. No compartiremos tu información con terceros
        sin tu consentimiento, excepto cuando sea necesario para cumplir con la
        ley o proteger nuestros derechos.
      </Typography>
      <Typography variant="body1" paragraph>
        Si tienes alguna pregunta sobre nuestra política de privacidad o cómo
        manejamos tu información personal, no dudes en ponerte en contacto con
        nosotros.
      </Typography>
    </Box>
  );
};

export default PrivacyPolicy;
