import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Skeleton, Button, CardActionArea, CardActions } from "@mui/material";
import { Link } from "react-router-dom";

export default function CardHome({
  categoryNombre,
  categoryImage,
  categoryId,
  setOpenProducts,
  setSelectCategory,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    setOpenProducts(true);
    setSelectCategory(categoryId);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Card sx={{ maxWidth: 400, borderRadius: "20px", margin: "1rem" }}>
      <CardActionArea onClick={() => handleClick()}>
        <Link to={`/listArticles/${categoryId}`}>
          {imageLoaded ? (
            <CardMedia
              component="img"
              height="600"
              image={categoryImage}
              alt="green iguana"
              onLoad={handleImageLoad}
            />
          ) : (
            <Skeleton variant="rectangular" width="400px" height={600} />
          )}
          <CardContent
            style={{
              backgroundColor: "#c4072c",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
              gutterBottom
              variant="h5"
              component="div"
              color="white"
            >
              {categoryNombre}
            </Typography>
            {/*           <Typography variant="body2" color="white">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography> */}
          </CardContent>
        </Link>
      </CardActionArea>
      <img
        src={categoryImage || ""}
        alt={categoryNombre}
        style={{ display: "none" }}
        onLoad={handleImageLoad}
      />
    </Card>
  );
}
