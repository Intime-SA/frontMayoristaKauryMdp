import React, { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import SelectProductMessage from "./SelectProductMenssage";
import AddIcon from "@mui/icons-material/Add";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import Divider from "@mui/material/Divider";
import { db } from "../../../../firebaseConfig";
import { CartContext } from "../../../context/CartContext";
import SkeletonLoading from "./SkeletonLoading";

const SelectProduct = ({ article }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [priceDefaultArticle, setPriceDefaultArticle] = useState(false);
  const [category, setCategory] = useState("");
  const isMobile = useMediaQuery("(max-width:760px)");
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [minimoCompra, setMinimoCompra] = useState(null);

  useEffect(() => {
    const fetchMinimo = async () => {
      try {
        const docRef = doc(db, "costos", "envio");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.minimoCompra) {
            const minimo = data.minimoCompra;

            setMinimoCompra(minimo);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchMinimo();
  }, []);

  const handleChange = (event) => {
    setProduct(event.target.value);
  };

  let newCount = count; // Variable para almacenar el nuevo valor de count

  // Verificar si la categoría cumple con las condiciones para limitar count a 10
  if (category === "PACK OFERTA X3" || category === "PACK X2 SURTIDO OFERTA") {
    // Limitar count a un máximo de 10
    newCount = Math.min(count, 10);
  }

  console.log(article.id);

  const add = () => {
    if (category == "PACK OFERTA X3" || category == "PACK X2 SURTIDO OFERTA") {
    }

    let objeto = {
      ...product,
      quantity: count,
    };

    addToCart(objeto);
    navigate(`/listArticles/${category}`);
  };

  useEffect(() => {
    // Simular una carga durante 3 segundos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let usuario = JSON.parse(localStorage.getItem("userInfo"));
    const fetchData = async () => {
      const productCollection = collection(db, "products");
      const q = query(productCollection, where("name", "==", article.id));
      console.log(q);
      const snapShotProducts = await getDocs(q);
      console.log(snapShotProducts);
      const newArray = [];
      snapShotProducts.forEach((product) => {
        console.log(product.data());
        if (product.data().stock > 0) {
          newArray.push(product.data());
        }
      });

      console.log(newArray);

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

  useEffect(() => {
    // Actualizar priceDefaultArticle cuando cambie el id
    setPriceDefaultArticle(false); // Reiniciar el valor
  }, [id]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {}, [isButtonDisabled]);

  const handleButtonClick = () => {
    if (
      (product.name === "PACK OFERTA X3" ||
        product.name === "PACK X2 SURTIDO OFERTA") &&
      count + 1 > 10
    ) {
      setErrorMessage("No puedes seleccionar más de 10 productos en este pack");
      setIsButtonDisabled(true);
    } else if (count + 1 <= product.stock) {
      setErrorMessage("");
      setCount(count + 1);
      if (count + 1 < product.stock) console.log("no hay mas");
    } else {
      setErrorMessage("No hay suficiente stock disponible");
    }
  };
  return (
    <Box
      sx={{
        width: isMobile ? "90%" : "25vw",
        padding: "20px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        margin: "1rem",
        fontFamily: '"Kanit", sans-serif',
        borderTop: "0px",
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottom: "0px",
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
      }}
    >
      {loading ? (
        // Mostrar skeletons mientras carga el componente
        <>
          <SkeletonLoading />
        </>
      ) : (
        <>
          <Typography
            style={{
              fontFamily: '"Kanit", sans-serif',
              fontWeight: 600,
              fontStyle: "normal",
            }}
          >
            Art {article.id}
          </Typography>
          <Typography
            style={{
              fontFamily: '"Kanit", sans-serif',
              fontWeight: 900,
              fontStyle: "normal",
              color: "#c4072c",
              fontSize: "110%",
            }}
          >
            {" "}
            {priceDefaultArticle === null ||
            priceDefaultArticle === false ||
            priceDefaultArticle === "" ? (
              <Skeleton
                sx={{
                  bgcolor: "grey.400",
                  display: "inline-block",
                  width: "100px", // Ajusta el ancho según sea necesario
                  height: "50px", // Ajusta la altura según sea necesario
                }}
                variant="text"
              />
            ) : (
              priceDefaultArticle.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
              })
            )}
          </Typography>
          <SelectProductMessage />
          <FormControl
            sx={{ display: "flex", justifyContent: "center" }}
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
                <MenuItem key={index} value={product}>
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
                height: "auto",
              }}
            >
              <h6
                style={{
                  display: "flex",
                  textAlign: "center",
                  fontFamily: '"Kanit", sans-serif',
                  fontSize: "40%",
                }}
              >
                <span
                  style={{ color: "#D27611", fontSize: "200%" }}
                  className="material-symbols-outlined"
                >
                  warning
                </span>{" "}
                <p style={{ fontFamily: '"Kanit", sans-serif' }}>
                  Por cualquier consulta que tengas no dudes en escribirnos por
                  WhatsApp 2233485438
                </p>
              </h6>
            </div>
            <Divider />
            <Typography
              sx={{
                fontFamily: '"Kanit", sans-serif', // Fuente especificada
                color: "#c4072c", // Color especificado
                margin: "0 10px", // Margen horizontal para separar el contador
              }}
              gutterBottom
            >
              {product.description}
            </Typography>
          </FormControl>
          {product && (
            <Box
              sx={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={product.imageCard || product.image}
                alt=""
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "8px",
                  marginRight: "20px",
                }}
              />
              <Box>
                <Typography
                  variant="body2"
                  style={{ fontFamily: '"Kanit", sans-serif' }}
                  gutterBottom
                >
                  {`Talle: ${product.talle}`}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ fontFamily: '"Kanit", sans-serif' }}
                  gutterBottom
                >
                  {`Precio: ${product.unit_price.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 2,
                  })}`}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ fontFamily: '"Kanit", sans-serif' }}
                  gutterBottom
                >
                  {`Color: ${product.color}`}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ fontFamily: '"Kanit", sans-serif' }}
                  gutterBottom
                >
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
              onClick={() => {
                if (count > 1) {
                  setCount(count - 1);
                  setErrorMessage("");
                }
              }}
              variant="text"
              disabled={count <= 1}
              sx={{
                color: "#c4072c", // Color especificado
                fontFamily: '"Kanit", sans-serif', // Fuente especificada
              }}
            >
              <HorizontalRuleIcon />
            </Button>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Kanit", sans-serif', // Fuente especificada
                color: "#c4072c", // Color especificado
                margin: "0 10px", // Margen horizontal para separar el contador
              }}
            >
              {count}
            </Typography>
            <Button
              onClick={handleButtonClick}
              variant="text"
              disabled={isButtonDisabled} // Utiliza el estado para deshabilitar el botón
              sx={{
                color: "#c4072c", // Color especificado
                fontFamily: '"Kanit", sans-serif', // Fuente especificada
              }}
            >
              <AddIcon />
            </Button>
          </Box>
          {errorMessage && (
            <Typography
              variant="body2"
              color="error"
              sx={{ marginTop: "10px", fontFamily: '"Kanit", sans-serif' }}
            >
              {errorMessage}
            </Typography>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                marginTop: "1rem",
                color: "grey",
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              <span
                style={{ fontSize: "100%" }}
                className="material-symbols-outlined"
              >
                production_quantity_limits
              </span>{" "}
              La compra mínima de un carrito es de{" "}
              {minimoCompra !== undefined && minimoCompra !== null
                ? minimoCompra.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 2,
                  })
                : ""}
            </Typography>
          </div>
          <Box sx={{ marginTop: "20px" }}>
            <Button
              onClick={add}
              variant="contained"
              fullWidth
              style={{
                borderRadius: "20px",
                fontFamily: '"Kanit", sans-serif',
              }}
              disabled={!product}
              color="error"
            >
              AGREGAR AL CARRITO
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default SelectProduct;
