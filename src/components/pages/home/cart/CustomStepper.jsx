import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = ["Carrito", "Entrega", "Pago"];

const CustomStepper = ({ step }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper
        style={{ fontFamily: '"Kanit", sans-serif' }}
        activeStep={step}
        alternativeLabel
      >
        {steps.map((label) => (
          <Step style={{ fontFamily: '"Kanit", sans-serif' }} key={label}>
            <StepLabel style={{ fontFamily: '"Kanit", sans-serif' }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default CustomStepper;
