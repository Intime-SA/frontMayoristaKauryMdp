import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../../../firebaseConfig";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button, Typography } from "@mui/material";
import { CartContext } from "../../../context/CartContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import SelectProductMessage from "./SelectProductMenssage";
import AddIcon from "@mui/icons-material/Add";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import Divider from "@mui/material/Divider";

const SelectProduct = ({ article }) => {
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(1);
  const isMobile = useMediaQuery("(max-width:760px)");
  const [errorMessage, setErrorMessage] = useState("");
  const { id } = useParams();
  const { user, addToCart, getQuantityById } = useContext(CartContext);
  let quantity = getQuantityById(id);
  const [priceDefaultArticle, setPriceDefaultArticle] = useState(false);
  const [category, setCategory] = useState("");

  const handleChange = (event) => {
    setProduct(event.target.value);
    console.log(event.target.value);
  };

  const navigate = useNavigate();

  const add = () => {
    let objeto = {
      ...product,
      quantity: count,
    };
    console.log(objeto);

    addToCart(objeto);
    navigate(`/listArticles/${category}`);
  };

  useEffect(() => {}, [errorMessage]);

  const manejoStock = useEffect(() => {
    let usuario = JSON.parse(localStorage.getItem("userInfo"));
    const fetchData = async () => {
      const productCollection = collection(db, "products");
      const q = query(productCollection, where("name", "==", article.id));
      const snapShotProducts = await getDocs(q);
      const newArray = [];
      snapShotProducts.forEach((product) => {
        if (product.data().stock > 0) {
          newArray.push(product.data());
        }
      });

      setPriceDefaultArticle(newArray[0].unit_price);
      setCategory(newArray[0].category);

      // Ordenar newArray por color
      newArray.sort((a, b) => {
        if (a.talle < b.talle) {
          return -1;
        }
        if (a.talle > b.talle) {
          return 1;
        }
        return 0;
      });

      setProducts(newArray);
    };
    fetchData();
  }, [article]);

  return (
    <Box
      sx={{
        width: isMobile ? "90%" : "25vw",
        padding: "20px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        margin: "1rem",
        fontFamily: '"Roboto Condensed", sans-serif',
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        Art {article.id}
      </Typography>
      <Typography variant="h6" fontWeight={900} color="#c4072c" fontSize="110%">
        {" "}
        {product.unit_price
          ? product.unit_price.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
            })
          : priceDefaultArticle.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
            })}
      </Typography>
      <SelectProductMessage />
      <FormControl
        style={{ display: "flex", justifyContent: "center" }}
        fullWidth
      >
        <InputLabel sx={{ height: "1rem" }} id="demo-simple-select-label">
          <p style={{ fontSize: "60%" }}>Disponible</p>
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={product}
          label="Producto"
          onChange={handleChange}
          sx={{
            fontSize: "small",
            height: "45px",
            padding: "1rem",
          }} // Ajustes de tamaño de fuente y altura
        >
          {products.map((product, index) => (
            <MenuItem key={product.id} value={product}>
              {`Talle: ${product.talle} / Color: ${product.color}`}
            </MenuItem>
          ))}
        </Select>
        <div
          style={{
            borderRadius: "10px",
            border: "1px solid #D27611",
            padding: "0.5rem",
            marginTop: "0.5rem",
            marginBottom: "0.5rem",
            color: "#D27611",
            display: "flex",
            alignItems: "center",
          }}
        >
          <h6
            style={{
              textAlign: "center",
              fontFamily: '"Roboto Condensed", sans-serif',
              fontSize: "40%",
            }}
          >
            <span
              style={{ color: "#D27611", fontSize: "100%" }}
              className="material-symbols-outlined"
            >
              warning
            </span>{" "}
            Por cualquier consulta que tengas no dudes en escribirnos por
            WhatsApp 2233485438
          </h6>
        </div>
        <Divider />
      </FormControl>
      {product && (
        <Box sx={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
          <img
            src={product.image}
            alt=""
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "8px",
              marginRight: "20px",
            }}
          />
          <Box>
            <Typography variant="h6">{article.id}</Typography>
            <Typography variant="body2" gutterBottom>
              {`ID: #${product.idc}`}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {`Talle: ${product.talle}`}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {`Precio: $${product.unit_price}`}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {`Color: ${product.color}`}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {`Stock: ${product.stock}`}
            </Typography>
          </Box>
        </Box>
      )}
      <Box
        sx={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: isMobile ? "100%" : "45%",
          border: "1px solid #e0e0e0",
          padding: "0.5rem",
          borderRadius: "10px",
        }}
      >
        <Button
          onClick={() => setCount(count - 1)}
          variant="text"
          disabled={count <= 0}
          sx={{
            color: "#c4072c", // Color especificado
            fontFamily: '"Roboto Condensed", sans-serif', // Fuente especificada
          }}
        >
          <HorizontalRuleIcon />
        </Button>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Roboto Condensed", sans-serif', // Fuente especificada
            color: "#c4072c", // Color especificado
            margin: "0 10px", // Margen horizontal para separar el contador
          }}
        >
          {count}
        </Typography>
        <Button
          onClick={() => {
            if (count + 1 <= product.stock) {
              setCount(count + 1);
            } else {
              setErrorMessage("No hay suficiente stock disponible");
            }
          }}
          variant="text"
          disabled={product && count >= product.stock}
          sx={{
            color: "#c4072c", // Color especificado
            fontFamily: '"Roboto Condensed", sans-serif', // Fuente especificada
          }}
        >
          <AddIcon />
        </Button>
      </Box>

      {errorMessage && (
        <Typography variant="body2" color="error" sx={{ marginTop: "10px" }}>
          {errorMessage}
        </Typography>
      )}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <Typography variant="body2" sx={{ marginTop: "1rem", color: "grey" }}>
          <span style={{ fontSize: "100%" }} class="material-symbols-outlined">
            production_quantity_limits
          </span>{" "}
          La compra mínima de un carrito es de $40.000,00 ARS.
        </Typography>
      </div>
      <Box sx={{ marginTop: "20px" }}>
        <Button
          onClick={add}
          variant="contained"
          fullWidth
          style={{ borderRadius: "20px" }}
          disabled={!product}
          color="error"
        >
          AGREGAR AL CARRITO
        </Button>
      </Box>
    </Box>
  );
};

export default SelectProduct;
