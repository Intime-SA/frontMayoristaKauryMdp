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
        width: "100%",
        padding: "20px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          Seleccionar Producto
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={product}
          label="Producto"
          onChange={handleChange}
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
          <Box>
            <Typography variant="h6" gutterBottom>
              {article.id}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
            >{`ID: #${product.idc}`}</Typography>
            <Typography
              variant="body1"
              gutterBottom
            >{`Talle: ${product.talle}`}</Typography>
            <Typography
              variant="body1"
              gutterBottom
            >{`Precio: ${product.unit_price}`}</Typography>
            <Typography
              variant="body1"
              gutterBottom
            >{`Color: ${product.color}`}</Typography>
            <Typography
              variant="body1"
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
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={() => setCount(count - 1)}
          variant="outlined"
          disabled={count <= 0}
        >
          -1
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
          variant="contained"
          disabled={product && count >= product.stock}
        >
          +1
        </Button>
        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ marginTop: "10px" }}>
            {errorMessage}
          </Typography>
        )}
      </Box>
      <Box sx={{ marginTop: "20px" }}>
        <Button
          onClick={add}
          variant="contained"
          fullWidth
          style={{ borderRadius: "20px" }}
          disabled={!product}
        >
          AGREGAR AL CARRITO
        </Button>
      </Box>
    </Box>
  );
};

export default SelectProduct;
