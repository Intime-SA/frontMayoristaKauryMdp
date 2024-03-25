import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useContext, useEffect, useRef, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { menuItems } from "../../../router/navigation";
import {
  logOut,
  signUp,
  db,
  loginGoogle,
  onSingIn,
} from "../../../firebaseConfig";
import { AuthContext } from "../../context/AuthContext";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { Button, TextField } from "@mui/material";
import Newsletter from "../../pages/home/newsletter/NewsLetter";
import Contacto from "../../pages/home/contacto/Contacto";
import Redes from "../../pages/home/redes/Redes";
import Footer from "../../pages/home/footer/Footer";
import { CartContext } from "../../context/CartContext";

const drawerWidth = 200;

function Navbar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);

  const { cart } = useContext(CartContext);

  const inputRef = useRef(null);
  useEffect(() => {
    // Accede al elemento input después de que el componente se haya montado
    if (inputRef.current) {
      // Puedes manipular el elemento input aquí
      inputRef.current.style.border = "none"; // Elimina el borde
      inputRef.current.style.boxShadow = "none"; // Elimina cualquier sombra
      inputRef.current.style.outline = "none";
      inputRef.current.style.height = "1vh";
      inputRef.current.style.width = "50px";
      inputRef.current.style.display = "inline";
      inputRef.current.style.outline = "none";
      inputRef.current.style.textDecoration = "none";
      // Elimina el resaltado de enfoque
      // Puedes agregar más estilos aquí según sea necesario para eliminar otras propiedades visuales
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const welcomeUser = () => {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    if (userData) {
      return `Usuario: ${userData.email} - Rol: ${userData.rol}`;
    } else {
      return ""; // Si no hay datos de usuario en el localStorage, devuelve una cadena vacía
    }
  };

  const cartLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];

  const cerrarSesion = () => {
    logOut();
    navigate("/login");
  };

  useEffect(() => {
    setCartItemCount(cart.length);
  }, [cart]);

  const handleAbrirCarrito = () => {
    // Redirigir al usuario al carrito
    window.scrollTo(0, 0); // Desplazar al principio de la página
  };

  const drawer = (
    <div
      style={{
        color: "#c4072c",
        backgroundColor: "whitesmoke",
        height: "100%",
      }}
    >
      <Toolbar />

      <List>
        {menuItems.map(({ id, path, title, Icon }) => {
          return (
            <Link key={id} to={path}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Icon sx={{ color: "#c4072c" }} />
                  </ListItemIcon>
                  <ListItemText primary={title} sx={{ color: "#c4072c" }} />
                </ListItemButton>
              </ListItem>
            </Link>
          );
        })}

        <ListItem disablePadding>
          <ListItemButton onClick={cerrarSesion}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "#c4072c" }} />
            </ListItemIcon>
            <ListItemText primary={"Cerrar sesion"} sx={{ color: "#c4072c" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          backgroundColor: "#c4072c",
        }}
      >
        <Toolbar
          sx={{
            gap: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            backgroundColor: "white",
            alignItems: "center",
            width: "100vw",
            height: "25vh",
            maxHeight: "220px",
            background: "#DD0831",
            padding: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "white",
              alignItems: "flex-end",
              width: "100%",
              height: "auto",
              background: "#DD0831",
              paddingTop: "3rem",
            }}
          >
            <IconButton
              color="#FFFFFF"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              style={{ margin: 0, padding: 0, marginLeft: "5%" }}
            >
              <span
                style={{ color: "white", fontWeight: 100, fontSize: "3rem" }}
                className="material-symbols-outlined"
              >
                menu
              </span>
            </IconButton>
            <Link to="/" style={{ color: "#c4072c" }}>
              <div
                style={{
                  marginTop: "5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <img
                  style={{ width: "10vw", color: "white", marginTop: "5rem" }}
                  src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/logo-927322684-1687738908-786eafccc1dcfd968724c4c5cba6acf61687738908-320-0.jpg?alt=media&token=4415c358-8994-40b2-bee0-9fe378428bea"
                  alt="kaury"
                />
                <h1
                  style={{
                    color: "#c4072c",
                    marginTop: "1%",
                    fontSize: "100%",
                    color: "white",
                    fontWeight: 250,
                  }}
                >
                  Mayorista
                </h1>
              </div>
            </Link>
            <Link
              color="#FFFFFF"
              aria-label="open drawer"
              edge="start"
              to="https://front-mayorista-kaury-mdp.vercel.app/cart"
              style={{ marginRight: "5%", padding: 0, marginTop: "1rem  " }}
              onClick={handleAbrirCarrito}
            >
              <span
                style={{
                  color: "white",
                  fontWeight: 100,
                  fontSize: "3rem",
                  marginTop: "1rem",
                  marginRight: "50%",
                }}
                className="material-symbols-outlined"
              >
                shopping_cart
                {cartItemCount > 0 && (
                  <span style={{ fontSize: "14px", marginLeft: "5px" }}>
                    {cartItemCount}
                  </span>
                )}
              </span>
            </Link>
          </div>
          <div
            style={{
              width: "90%",
              marginBottom: "3rem",
              height: "1vh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField
              inputRef={inputRef}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <span
                    style={{
                      fontWeight: 300,
                      fontSize: "250%",
                      color: "#c4072c",
                    }}
                    className="material-symbols-outlined"
                  >
                    search
                  </span>
                ),
                style: { paddingRight: "0" }, // Elimina el espacio del icono
              }}
              style={{
                width: "100%",
                height: "3rem",
                borderRadius: "15px",
                backgroundColor: "white",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                display: "inline-grid",
              }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Box component="nav" aria-label="mailbox folders">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          anchor={"right"}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#1976d2",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          width: "100%",
          minHeight: "100vh",
          px: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          fontSize: "2rem",
          top: "20vh",
          position: "relative",
          width: "100%",
          padding: 0,
          margin: 0,
        }}
      >
        <Toolbar />

        <Outlet />
        <div
          style={{
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Newsletter />
        </div>
        <Redes />
        <div
          style={{
            backgroundColor: "rgba(175, 155, 144, 0.21)",
            height: "auto",
            width: "100vw",
          }}
        >
          <Contacto />
        </div>

        <div
          style={{
            backgroundColor: "rgba(175, 155, 144, 0.21)",
            height: "auto",
            width: "100vw",
            position: "relative",
            top: "0px",
          }}
        >
          <Footer />
        </div>
      </Box>
    </Box>
  );
}

export default Navbar;
