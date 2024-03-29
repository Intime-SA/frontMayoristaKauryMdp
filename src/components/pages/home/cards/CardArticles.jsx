import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useTransition, animated } from "react-spring"; // Importar useTransition y animated desde react-spring
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

  // Define la animación de entrada utilizando react-spring
  const transitions = useTransition(imageLoaded, {
    from: { opacity: 0, transform: "scale(0.9)" },
    enter: { opacity: 1, transform: "scale(1)" },
    config: { tension: 220, friction: 180 }, // Ajustar el valor de friction para hacer la aparición más lenta
  });

  return (
    <>
      {transitions((styles, item) =>
        item ? (
          <animated.div style={styles}>
            <ProductCard product={product} handleClick={handleClick} />
          </animated.div>
        ) : (
          <ProductCardSkeleton product={product} handleClick={handleClick} />
        )
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
