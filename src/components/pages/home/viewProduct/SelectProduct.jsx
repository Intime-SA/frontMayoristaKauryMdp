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

const SelectProduct = ({ article }) => {
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const { id } = useParams();
  const { user, addToCart, getQuantityById } = useContext(CartContext);
  let quantity = getQuantityById(id);

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
    navigate("/");
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
      setProducts(newArray);
    };
    fetchData();
  }, [article]);

  return (
    <Box
      sx={{
        width: "25vw",
        padding: "20px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        margin: "1rem", // Aplicar la fuente
      }}
    >
      <h4 style={{ fontFamily: '"Roboto Condensed", sans-serif' }}>
        <span style={{ fontWeight: 700 }}> Art {article.id}</span>
      </h4>
      <h4
        style={{
          fontWeight: 900,
          color: "#c4072c",
          fontFamily: '"Roboto Condensed", sans-serif',
          fontSize: "110%",
        }}
      >
        $ {product.unit_price}
      </h4>
      <h6
        style={{
          fontFamily: '"Roboto Condensed", sans-serif',
          marginBottom: "1rem",
        }}
      >
        Compra minima $40.000
      </h6>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Producto</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={product}
          label="Producto"
          onChange={handleChange}
          style={{ fontFamily: '"Roboto Condensed", sans-serif' }} // Aplicar la fuente
        >
          {products.map((product, index) => (
            <MenuItem key={product.id} value={product}>
              {`Talle: ${product.talle} / Color: ${product.color}`}
            </MenuItem>
          ))}
        </Select>
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
          <Box style={{ fontFamily: '"Roboto Condensed", sans-serif' }}>
            {" "}
            {/* Aplicar la fuente */}
            <Typography
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
              variant="h6"
              gutterBottom
            >
              {article.id}
            </Typography>
            <Typography
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
              gutterBottom
            >{`ID: #${product.idc}`}</Typography>
            <Typography
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
              gutterBottom
            >{`Talle: ${product.talle}`}</Typography>
            <Typography
              gutterBottom
            >{`Precio: $${product.unit_price}`}</Typography>
            <Typography
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
              gutterBottom
            >{`Color: ${product.color}`}</Typography>
            <Typography
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
              gutterBottom
            >{`Stock: ${product.stock}`}</Typography>
          </Box>
        </Box>
      )}
      <Box
        sx={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "35%",
          border: "1px solid #e0e0e0",
          padding: "0.5rem",
          borderRadius: "10px",
        }}
      >
        <Button
          onClick={() => setCount(count - 1)}
          variant="text"
          disabled={count <= 0}
        >
          <span
            style={{ color: "black" }}
            className="material-symbols-outlined"
          >
            horizontal_rule
          </span>
        </Button>
        <Typography variant="h6">{count}</Typography>
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
        >
          <span
            style={{ color: "black" }}
            className="material-symbols-outlined"
          >
            add
          </span>
        </Button>
      </Box>
      {errorMessage && (
        <Typography variant="body2" color="error" sx={{ marginTop: "10px" }}>
          {errorMessage}
        </Typography>
      )}
      <Box sx={{ marginTop: "20px" }}>
        <Button
          onClick={add}
          variant="contained"
          fullWidth
          style={{
            borderRadius: "20px",
            fontFamily: "'Roboto Condensed', sans-serif;",
          }} // Aplicar la fuente
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
