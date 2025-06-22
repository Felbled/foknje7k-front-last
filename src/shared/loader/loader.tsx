import React from "react";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { RootState } from "../../redux/store/store";

const GlobalLoader: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);

  return (
    <>
      {isLoading && (
        <div
          className="w-screen h-screen fixed inset-0 flex items-center justify-center   backdrop-blur-sm"
          style={{ zIndex: 1000000 }}
        >
          <CircularProgress color={"success"} />
        </div>
      )}
    </>
  );
};

export default GlobalLoader;
