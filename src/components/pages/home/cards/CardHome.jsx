import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";

export default function CardHome() {
  return (
    <Card sx={{ maxWidth: 400, borderRadius: "20px", margin: "1rem" }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="auto"
          image="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/unnamed.png?alt=media&token=84e520a5-7423-412f-922a-8485329e9d6b"
          alt="green iguana"
        />
        <CardContent style={{ backgroundColor: "#c4072c" }}>
          <Typography gutterBottom variant="h5" component="div" color="white">
            Lizard
          </Typography>
          <Typography variant="body2" color="white">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
