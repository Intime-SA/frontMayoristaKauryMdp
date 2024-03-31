import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import CategoryBreadcrumb from "./CategoryBreadcrumb";
import ProductList from "./ProductList";

const ListArticlesDesktop = () => {
  return (
    <div>
      <CategoryBreadcrumb />
      <ProductList />
    </div>
  );
};

export default ListArticlesDesktop;
