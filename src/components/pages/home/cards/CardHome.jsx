import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";

export default function CardHome({ categoryNombre, categoryImage }) {
  return (
    <Card sx={{ maxWidth: 400, borderRadius: "20px", margin: "1rem" }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="600"
          image={categoryImage}
          alt="green iguana"
        />
        <CardContent
          style={{
            backgroundColor: "#c4072c",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography gutterBottom variant="h5" component="div" color="white">
            {categoryNombre}
          </Typography>
          {/*           <Typography variant="body2" color="white">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography> */}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
