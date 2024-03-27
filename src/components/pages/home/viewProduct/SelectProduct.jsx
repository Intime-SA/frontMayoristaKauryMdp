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

      setPriceDefaultArticle(newArray[0].unit_price);

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
      }}
    >
      <Typography variant="h4" fontWeight={700}>
        Art {article.id}
      </Typography>
      <Typography variant="h4" fontWeight={900} color="#c4072c" fontSize="110%">
        $ {product.unit_price ? product.unit_price : priceDefaultArticle}
      </Typography>
      <Typography variant="h6" marginBottom="1rem">
        Compra mínima $40.000
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Disponible</InputLabel>
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
            <Typography variant="h6">{article.id}</Typography>
            <Typography gutterBottom>{`ID: #${product.idc}`}</Typography>
            <Typography gutterBottom>{`Talle: ${product.talle}`}</Typography>
            <Typography
              gutterBottom
            >{`Precio: $${product.unit_price}`}</Typography>
            <Typography gutterBottom>{`Color: ${product.color}`}</Typography>
            <Typography gutterBottom>{`Stock: ${product.stock}`}</Typography>
          </Box>
        </Box>
      )}
      <Box
        sx={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: isMobile ? "100%" : "35%",
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
          -
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
          +
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
