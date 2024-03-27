import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Skeleton } from "@mui/material";
import {
  Button,
  CardActionArea,
  CardActions,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function CardArticles({
  product,
  setOpenProductView,
  setArticle,
}) {
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = (article) => {
    setArticle(article);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      {imageLoaded ? (
        <ProductCard product={product} handleClick={handleClick} />
      ) : (
        <ProductCardSkeleton product={product} handleClick={handleClick} />
      )}
      <img
        src={product.image || ""}
        alt={product.name}
        style={{ display: "none" }}
        onLoad={handleImageLoad}
      />
    </>
  );
}
