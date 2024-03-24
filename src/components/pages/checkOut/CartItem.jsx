import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

function CartItem({ product }) {
  return (
    <Card sx={{ maxWidth: 150, borderRadius: "20px", width: "auto" }}>
      <CardActionArea>
        <Link to="/">
          <CardMedia
            component="img"
            height="100" // Estableciendo el ancho fijo
            src={product.image}
            alt={product.name}
            sx={{ objectFit: "contain", maxHeight: "100px" }} // Establecer estilos para la imagen
          />
        </Link>
      </CardActionArea>
    </Card>
  );
}

export default CartItem;
