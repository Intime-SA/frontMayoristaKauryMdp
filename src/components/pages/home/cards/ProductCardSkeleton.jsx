import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Box, Skeleton, useMediaQuery } from "@mui/material";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";

const ProductCardSkeleton = ({ product, handleClick }) => {
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Card
      sx={{
        maxWidth: isNarrowScreen ? 350 : 650,
        borderRadius: "20px",
        margin: "1rem",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        marginLeft: isNarrowScreen ? "0rem" : "0",
      }}
    >
      <Link to={`/viewProduct/${product.name}`}>
        <CardActionArea onClick={() => handleClick(product.name)}>
          {imageLoaded ? (
            <CardMedia
              component="img"
              height={product.image ? "auto" : "350px"}
              image={
                product.image ||
                "https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/Mayorista%20Mar%20del%20Plata%20(2).png?alt=media&token=87bdf689-8eb7-49b1-9317-f6a52a9a0781"
              }
              alt={product.name}
              style={{ borderRadius: "20px 20px 0 0", minHeight: "400px" }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="400px"
              style={{ borderRadius: "20px 20px 0 0" }}
            />
          )}
          <CardContent
            style={{
              backgroundColor: "#f7f7f7",
              padding: "0.5rem",
              borderRadius: "0 0 20px 20px",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: 300 }}>
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
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
      <img
        src={product.image || ""}
        alt={product.name}
        style={{ display: "none" }}
        onLoad={handleImageLoad}
      />
    </Card>
  );
};

export default ProductCardSkeleton;
