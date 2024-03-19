import React, { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { Button, Modal, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const ExpandMore = styled(({ expand, ...other }) => <IconButton {...other} />)(
  ({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  })
);

const Cart = () => {
  const { cart, deleteById, getTotalPrice, clearCart } =
    useContext(CartContext);

  let total = getTotalPrice();

  const [estado, setEstado] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (anchorEl && open) {
      // Si el menú está abierto, ciérralo
      setAnchorEl(null);
      setOpen(false); // Actualiza el estado a cerrado
    } else {
      // Si el menú está cerrado, ábrelo
      setAnchorEl(event.currentTarget);
      setOpen(true); // Actualiza el estado a abierto
    }
  };

  const handleClose2 = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setEstado(false);
  };

  const handleDelete = () => {
    clearCart();
  };

  const handleOpen = () => {
    setEstado(true);
  };

  const [expanded, setExpanded] = useState(false);
  const [fechaHora, setFechaHora] = useState(null);

  const obtenerFechaHoraActual = () => {
    const fechaActual = new Date();
    const horaActual = fechaActual.toLocaleTimeString();
    const fechaActualTexto = fechaActual.toLocaleDateString();

    const fechaHoraActual = `${fechaActualTexto} ${horaActual}`;
    setFechaHora(fechaHoraActual);
  };

  const handleExpandClick = () => {
    obtenerFechaHoraActual();
    setExpanded(!expanded);
  };
  const emailUser = JSON.parse(localStorage.getItem("userInfo")).email;
  console.log(emailUser);

  let precioTotalCarrito = 0; // Inicializa el precio total del carrito

  for (let i = 0; i < cart.length; i++) {
    const producto = cart[i];
    const precioTotalProducto = producto.unit_price * producto.quantity;
    precioTotalCarrito += precioTotalProducto; // Suma el precio total del producto al precio total del carrito
    console.log(
      `Producto: ${producto.name}, Precio Total: ${precioTotalProducto}`
    );
  }

  const precioFormateado = precioTotalCarrito.toLocaleString("es-ES", {
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

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20vh" }}
    >
      {cart.length > 0 ? (
        <div>
          <h1>Carrito de Compras</h1>
          {cart.map((producto) => (
            <Card sx={{ display: "flex" }}>
              <CardMedia
                component="img"
                sx={{ width: 150, height: 150 }}
                image={producto.image}
                alt={producto.name}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" component="div">
                  {producto.name}
                </Typography>
                <Typography variant="body2">
                  Cantidad: {producto.quantity}
                </Typography>
                <Typography variant="body2">
                  Precio Unitario: {producto.unit_price}
                </Typography>
                <Typography variant="body2">
                  Precio Total:{" "}
                  {(producto.unit_price * producto.quantity).toFixed(2)}
                </Typography>
                <Button
                  onClick={() => {
                    deleteById(producto.idc);
                  }}
                  size="small"
                >
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          ))}
          <div>
            <h4>Total Compra: {precioTotalCarrito}</h4>
            <Button variant="contained" onClick={handleDelete}>
              Vaciar Carrito
            </Button>
            <Button variant="contained">
              <Link to="/checkout">Finalizar Compra</Link>
            </Button>
          </div>
        </div>
      ) : (
        <h1>No hay elementos en el carrito</h1>
      )}
    </div>
  );
};

export default Cart;
