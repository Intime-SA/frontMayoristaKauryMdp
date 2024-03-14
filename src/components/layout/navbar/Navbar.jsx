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
import { useEffect, useRef, useState } from "react";
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

const drawerWidth = 200;

function Navbar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const inputRef = useRef(null);
  useEffect(() => {
    // Accede al elemento input después de que el componente se haya montado
    if (inputRef.current) {
      // Puedes manipular el elemento input aquí
      inputRef.current.style.border = "none"; // Elimina el borde
      inputRef.current.style.boxShadow = "none"; // Elimina cualquier sombra
      inputRef.current.style.outline = "none";
      inputRef.current.style.height = "30px";
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

  const cerrarSesion = () => {
    logOut();
    navigate("/login");
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
            justifyContent: "center",
            backgroundColor: "white",
            alignItems: "center",
            width: "100vw",
            height: "20vh",
            background: "#DD0831",
            paddingTop: "1rem",
            padding: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "white",
              alignItems: "flex-start",
              width: "100%",
              height: "auto",
              background: "#DD0831",
              paddingTop: "1rem",
            }}
          >
            <IconButton
              color="#FFFFFF"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              style={{ margin: 0, padding: 0 }}
            >
              <span
                style={{ color: "white", fontWeight: 100, fontSize: "5rem" }}
                class="material-symbols-outlined"
              >
                menu
              </span>
            </IconButton>
            <Link to="/" style={{ color: "#c4072c" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  style={{ width: "15vw", color: "white" }}
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
            <Button>
              <span
                style={{
                  color: "white",
                  fontWeight: 100,
                  fontSize: "4rem",
                }}
                class="material-symbols-outlined"
              >
                shopping_cart
              </span>
            </Button>
          </div>
          <div
            style={{
              width: "80%",
              marginBottom: "1rem",
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
                      position: "relative",
                    }}
                    class="material-symbols-outlined"
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
        }}
      >
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
}

export default Navbar;
