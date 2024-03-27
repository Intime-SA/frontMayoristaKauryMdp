import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  CardActionArea,
  CardActions,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function CardArticles({
  product,
  setOpenProductView,
  setArticle,
}) {
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = (article) => {
    setArticle(article);
  };

  return (
    <Card
      sx={{
        maxWidth: isNarrowScreen ? 350 : 250, // Reducir el maxWidth en pantallas estrechas
        borderRadius: "20px",
        margin: "1rem",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        marginLeft: isNarrowScreen ? "0rem" : "0", // Si es una pantalla estrecha, centrar los elementos, de lo contrario, espacio alrededor
      }}
    >
      <Link to={`/viewProduct/${product.name}`}>
        <CardActionArea onClick={() => handleClick(product.name)}>
          <CardMedia
            component="img"
            height={product.image ? "auto" : "350px"} // Si hay una imagen, usa altura automática, de lo contrario, establece la altura mínima en 350px
            image={
              product.image
                ? product.image
                : "https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/Mayorista%20Mar%20del%20Plata%20(2).png?alt=media&token=87bdf689-8eb7-49b1-9317-f6a52a9a0781"
            }
            alt={product.name}
            style={{ borderRadius: "20px 20px 0 0", minHeight: "350px" }} // Altura mínima de 350px
          />
          <CardContent
            style={{
              backgroundColor: "#f7f7f7",
              padding: "0.5rem", // Reducir el relleno
              borderRadius: "0 0 20px 20px",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              color="textSecondary"
              style={{
                marginBottom: "0.5rem",
                fontFamily: '"Roboto Condensed", sans-serif',
              }}
            >
              <strong>Art {product.name}</strong>
            </Typography>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              color="red"
              style={{
                fontWeight: "900",
                fontFamily: '"Roboto Condensed", sans-serif',
              }}
            >
              $
              {" " +
                product.unit_price.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "60vw",
              }}
            ></div>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
