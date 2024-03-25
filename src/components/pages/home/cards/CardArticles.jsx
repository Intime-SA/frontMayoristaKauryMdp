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
        maxWidth: 300,
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
            height="300"
            image={product.image}
            alt={product.name}
            style={{ borderRadius: "20px 20px 0 0" }}
          />
          <CardContent
            style={{
              backgroundColor: "#f7f7f7",
              padding: "1rem",
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
            >
              <Button
                style={{ borderRadius: "40px" }}
                variant="contained"
                color="error"
              >
                Comprar
              </Button>
              <div>
                <Button
                  style={{
                    border: "0px",
                    textDecoration: "none",
                    borderRadius: "100px",
                    color: "inherit",
                    padding: "0px",
                    width: "1rem",
                    height: "5vh",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  variant="outlined"
                >
                  <div
                    style={{
                      border: "1px solid black",
                      padding: "0.5rem",
                      borderRadius: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{ fontSize: "150%" }}
                      className="material-symbols-outlined"
                    >
                      visibility
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
