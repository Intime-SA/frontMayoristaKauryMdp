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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Modal,
  TextField,
} from "@mui/material";
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

  const [searchResults, setSearchResults] = useState([]);
  const fetchData = async (productName) => {
    console.log(productName);
    if (productName) {
      const productCollection = collection(db, "products");
      const q = query(productCollection, where("name", "==", productName));
      const querySnapshot = await getDocs(q);

      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const [searching, setSearching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleProductSelect = async (event, value) => {
    if (value) {
      setSearching(true); // Comienza la búsqueda
      setModalOpen(true); // Abre el modal

      const selectedProduct = searchResults.find(
        (product) => product.name === value.name
      ); // Encuentra el producto seleccionado por su nombre

      if (selectedProduct) {
        // Simula una demora en la búsqueda (puedes reemplazar esto con tu lógica real de búsqueda)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setSearching(false); // Finaliza la búsqueda
        setModalOpen(false); // Cierra el modal

        navigate(`/viewProduct/${selectedProduct.name}`);
      }

      if (value) {
        setSearchText(""); // Limpiar el texto de búsqueda cuando se selecciona un producto
        // Tu lógica de manejo de producto seleccionado aquí
      }
    }
  };

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

  const autocompleteStyle = {
    width: "90vw",
    maxWidth: "1000px",
    height: "3rem",
    borderRadius: "15px",
    display: "inline-grid",
    border: "none",
    padding: "0px",
    margin: "0px",
    "&:hover": {
      border: "1px solid blue", // Cambia el color del borde cuando el mouse pasa por encima
    },
  };

  const [searchText, setSearchText] = useState("");

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
                  justifyContent: "flex-start",
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
              to="/cart"
              style={{ marginRight: "5%", padding: 0, marginTop: "1rem" }}
              onClick={handleAbrirCarrito}
            >
              <span
                style={{
                  color: "white",
                  fontWeight: 100,
                  fontSize: "2rem",
                  position: "relative",
                }}
                className="material-symbols-outlined"
              >
                shopping_cart
                {cartItemCount > 0 && (
                  <span
                    style={{
                      fontSize: "10px",
                      marginLeft: "5px",
                      position: "absolute",
                      top: "-10px",
                      right: "-10px",
                      background: "white",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: "1",
                      color: "#c4072c", // Asegura que el contador esté por encima del ícono
                    }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </span>
            </Link>
          </div>
          <div>
            {/* Modal que cubre toda la pantalla */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
              <div
                style={{
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </div>
            </Modal>
          </div>
          <div
            style={{
              height: "auto",
              width: "90vw",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              borderRadius: "5px",
            }}
          >
            <Autocomplete
              disablePortal
              id="search"
              style={{ width: "100%" }}
              options={
                searchResults.length > 0
                  ? [
                      {
                        id: searchResults[0].id,
                        name: searchResults[0].name,
                        unit_price: searchResults[0].unit_price,
                        image: searchResults[0].image,
                      },
                    ]
                  : []
              } // Mapea solo la primera opción si hay resultados
              getOptionLabel={(option) => "ART " + option.name} // Define cómo obtener el nombre de la opción
              renderInput={(params) => (
                <TextField
                  onChange={(event) => setSearchText(event.target.value)}
                  style={{
                    fontFamily: '"Roboto Condensed", sans-serif',
                    fontWeight: "900",
                    fontSize: "50%",
                  }}
                  {...params}
                />
              )}
              onChange={handleProductSelect}
              onInputChange={(event, newValue) => fetchData(newValue)}
              noOptionsText="Busque por nombre de articulo"
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
