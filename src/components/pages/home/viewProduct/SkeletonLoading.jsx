import React from "react";
import Skeleton from "@mui/material/Skeleton";

const SkeletonLoading = () => {
  return (
    <>
      <Skeleton variant="text" width="80%" height={50} />
      <Skeleton variant="text" width="50%" height={30} />
      <Skeleton variant="text" width="90%" height={30} />
      <Skeleton variant="rectangular" width="100%" height={200} />
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="text" width="70%" height={20} />
      <Skeleton variant="text" width="60%" height={20} />
    </>
  );
};

export default SkeletonLoading;
