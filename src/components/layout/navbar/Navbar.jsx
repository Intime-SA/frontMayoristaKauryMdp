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
import Toolbar from "@mui/material/Toolbar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useContext, useEffect, useRef, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { menuItems } from "../../../router/navigation";
import CategoryIcon from "@mui/icons-material/Category";

import { logOut, db } from "../../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Autocomplete,
  CircularProgress,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Newsletter from "../../pages/home/newsletter/NewsLetter";
import Contacto from "../../pages/home/contacto/Contacto";
import Redes from "../../pages/home/redes/Redes";
import Footer from "../../pages/home/footer/Footer";
import { CartContext } from "../../context/CartContext";
import { useTheme } from "@mui/material/styles";
import { AuthContext } from "../../context/AuthContext";
const drawerWidth = 200;

function Navbar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { handleLogoutContext } = useContext(AuthContext);

  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categorias = collection(db, "categorys");
        const querySnapshot = await getDocs(categorias);
        const categoriasArray = [];

        querySnapshot.forEach((doc) => {
          const dataCategoria = doc.data();
          const id = doc.id; // Obtener el ID del documento

          // Verificar si la categoría está activa antes de agregarla al array
          if (dataCategoria.status === true) {
            categoriasArray.push({ id, ...dataCategoria }); // Agregar el ID a los datos de la categoría
          }
        });

        setCategory(categoriasArray);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchData();
  }, []);

  const { cart } = useContext(CartContext);

  const inputRef2 = useRef(null);

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

  const [modalOpen, setModalOpen] = useState(false);

  const handleProductSelect = async (event, value) => {
    if (value) {
      setModalOpen(true); // Abre el modal

      const selectedProduct = searchResults.find(
        (product) => product.name === value.name
      ); // Encuentra el producto seleccionado por su nombre

      if (selectedProduct) {
        // Simula una demora en la búsqueda (puedes reemplazar esto con tu lógica real de búsqueda)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setModalOpen(false); // Cierra el modal

        // Acceder al elemento input y quitar el foco
        if (value) {
          // Ocultar el teclado en dispositivos móviles
          inputRef2.current.blur();
        }

        navigate(`/viewProduct/${selectedProduct.name}`);
      }
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const cerrarSesion = () => {
    handleLogoutContext();
    navigate("/login");
  };

  useEffect(() => {
    setCartItemCount(cart.length);
  }, [cart]);

  const [showCategories, setShowCategories] = useState(false);

  // Función para alternar la visualización de las categorías
  const toggleCategories = () => {
    setShowCategories(!showCategories);
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

      {/* Lista de elementos del menú */}
      <List>
        {menuItems.map(({ id, path, title, Icon }) => (
          <Link
            style={{ fontFamily: '"Kanit", sans-serif' }}
            key={id}
            to={path}
          >
            <ListItem
              style={{ fontFamily: '"Kanit", sans-serif' }}
              disablePadding
            >
              <ListItemButton style={{ fontFamily: '"Kanit", sans-serif' }}>
                <ListItemIcon>
                  <Icon sx={{ color: "#c4072c" }} />
                </ListItemIcon>

                <h6
                  style={{
                    color: "#c4072c",
                    fontFamily: '"Kanit", sans-serif',
                  }}
                >
                  {title}
                </h6>
              </ListItemButton>
            </ListItem>
          </Link>
        ))}

        <ListItem disablePadding>
          <ListItemButton onClick={toggleCategories}>
            <ListItemIcon>
              <CategoryIcon sx={{ color: "#c4072c" }} />
            </ListItemIcon>
            <h6 style={{ color: "#c4072c", fontFamily: '"Kanit", sans-serif' }}>
              Categorias
            </h6>
          </ListItemButton>
        </ListItem>

        {/* Renderizado de las categorías si showCategories es verdadero */}
        {showCategories &&
          category.map((cat) => (
            <ListItem disablePadding key={cat.id}>
              <Link
                to={`/listArticles/${cat.id}`}
                style={{
                  width: "100%",
                  textDecoration: "none", // Agregamos para eliminar subrayado
                  color: "#c4072c",
                  fontFamily: '"Kanit", sans-serif',
                }}
              >
                <Typography
                  variant="body1"
                  style={{
                    padding: "12px 16px", // Mismo padding que en los otros elementos del menú
                    fontSize: isNarrowScreen ? "0.8rem" : "1rem",
                    color: "#c4072c",
                    textAlign: "left",
                    color: "#c4072c",
                    fontFamily: '"Kanit", sans-serif',
                  }}
                >
                  {cat.name}
                </Typography>
              </Link>
            </ListItem>
          ))}

        <ListItem disablePadding>
          <ListItemButton onClick={cerrarSesion}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "#c4072c" }} />
            </ListItemIcon>
            <h6 style={{ color: "#c4072c", fontFamily: '"Kanit", sans-serif' }}>
              Cerrar Sesion
            </h6>
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            backgroundColor: "white",
            alignItems: "center",
            width: "100vw",
            height: "auto",
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
              alignItems: "center",
              width: "100%",
              height: "auto",
              background: "#DD0831",
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
            <Link
              to="/"
              style={{ color: "#c4072c", width: "10%", height: "10%" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: "300px",
                  maxHeight: "5rem",
                }}
              >
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/logo-927322684-1687738908-786eafccc1dcfd968724c4c5cba6acf61687738908-320-0.jpg?alt=media&token=4415c358-8994-40b2-bee0-9fe378428bea"
                  alt="kaury"
                  width="200px" // Ancho en píxeles
                  height="100px" // Altura en píxeles
                  style={{
                    width: isNarrowScreen ? "5rem" : "10rem", // Ancho dependiendo de isNarrowScreen
                    height: "auto", // Altura automática para mantener la proporción
                    maxWidth: isNarrowScreen ? "200px" : "400px", // Ancho máximo en relación al tamaño del contenedor
                  }}
                />
                <h1
                  style={{
                    color: "white",
                    marginTop: "1%",
                    fontSize: "100%",
                    fontWeight: 250,
                    width: "100%", // Ancho del h1
                    height: "100%",
                    textAlign: "center", // Altura del h1
                  }}
                ></h1>
              </div>
            </Link>
            <Link
              color="#FFFFFF"
              aria-label="open drawer"
              edge="start"
              to="/cart"
              style={{ marginRight: "5%", padding: 0, marginTop: "1rem" }}
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
                  inputRef={inputRef2} // Utiliza la misma referencia aquí
                  label="Productos"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  InputProps={{
                    style: {
                      fontFamily: '"Roboto Condensed", sans-serif',
                      fontWeight: "900",
                      fontSize: "50%",
                    },
                    onKeyPress: (event) => {
                      if (event.key === "Enter") {
                        inputRef2.current.blur(); // Destildar el input
                      }
                    },
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
