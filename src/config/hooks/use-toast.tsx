import React, { createContext, useState, ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackbarContextProps {
  showMessage: (
    title: string,
    message: string,
    severity: "success" | "error" | "warning" | "info",
  ) => void;
}

export const SnackbarContext = createContext<SnackbarContextProps | undefined>(
  undefined,
);

let snackbarContextValue: SnackbarContextProps;

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbar, setSnackbar] = useState<{
    title: string;
    message: string[];
    severity: "success" | "error" | "warning" | "info";
    open: boolean;
  }>({
    title: "",
    message: [],
    severity: "info",
    open: false,
  });

  const showMessage = (
    title: string,
    message: string,
    severity: "success" | "error" | "warning" | "info",
  ) => {
    // Split the message into phrases based on periods and filter out empty strings
    const phrases = message.split(".").filter((phrase) => phrase.trim() !== "");
    setSnackbar({ title, message: phrases, severity, open: true });
  };

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  snackbarContextValue = { showMessage };

  return (
    <SnackbarContext.Provider value={snackbarContextValue}>
      {children}
      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          <strong>{snackbar.title}</strong>
          <br />
          {snackbar.message.map((phrase, index) => (
            <div key={index}>{phrase.trim()}.</div>
          ))}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const getSnackbarContext = () => snackbarContextValue;
