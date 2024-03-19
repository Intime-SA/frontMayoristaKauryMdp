import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../../firebaseConfig";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SelectProduct from "./SelectProduct";
import { useParams } from "react-router-dom";

const ViewProduct = () => {
  const article = useParams();
  console.log(article);

  return (
    <div style={{ display: "flex", marginTop: "20vh" }}>
      <div>Carrusel vertical</div>
      <div>Imagen Principal</div>
      <div>
        <SelectProduct article={article} />
      </div>
    </div>
  );
};

export default ViewProduct;
