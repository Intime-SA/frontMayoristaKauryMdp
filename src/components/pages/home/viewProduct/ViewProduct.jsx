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
import VerticalCarrusel from "./VerticalCarrusel";

const ViewProduct = () => {
  const article = useParams();

  useEffect(() => {
    window.scrollTo(0, 0); // Desplazar al inicio de la página
  }, []);

  return (
    <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
      <div>
        <VerticalCarrusel article={article} />
      </div>
      <div>
        <SelectProduct article={article} />
      </div>
    </div>
  );
};

export default ViewProduct;
