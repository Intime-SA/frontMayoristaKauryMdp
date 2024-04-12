import React from "react";
import { Card, CardActionArea, CardMedia } from "@mui/material";
import { Link } from "react-router-dom";

function CartItem({ product }) {
  return (
    <Card sx={{ maxWidth: 150, borderRadius: "20px", width: "75px" }}>
      <CardActionArea>
        <Link to="/">
          <CardMedia
            component="img"
            height="75" // Estableciendo el ancho fijo
            src={product.imageCard || product.image}
            alt={product.name}
            sx={{ objectFit: "cover", maxHeight: "100px" }} // Establecer estilos para la imagen
          />
        </Link>
      </CardActionArea>
    </Card>
  );
}

export default CartItem;
