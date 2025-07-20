import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";

const PaymentCancel = () => {
  const navigate = useNavigate();
  
  // Get user role from Redux store to determine navigation path
  const userRole = useSelector(
    (state: RootState) => state?.user?.userData?.role?.name
  );

  const handleReturnToDashboard = () => {
    // Navigate based on user role
    if (userRole === "ROLE_STUDENT") {
      navigate('/dashboard/offer-student');
    } else if (userRole === "ROLE_SUPER_TEACHER" || userRole === "ROLE_ADMIN") {
      navigate('/dashboard/offer-teacher');
    } else {
      // Fallback to student offers for other roles
      navigate('/dashboard/offer-student');
    }
  };

  const handleRetryPayment = () => {
    // Navigate based on user role
    if (userRole === "ROLE_STUDENT") {
      navigate('/dashboard/offer-student');
    } else if (userRole === "ROLE_SUPER_TEACHER" || userRole === "ROLE_ADMIN") {
      navigate('/dashboard/offer-teacher');
    } else {
      // Fallback to student offers for other roles
      navigate('/dashboard/offer-student');
    }
  };

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 mx-4 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center">
          <CancelIcon 
            className="mb-4 text-orange-500" 
            style={{ fontSize: 80 }}
          />
          <Typography 
            variant="h4" 
            className="mb-4 text-orange-600 font-montserrat_semi_bold"
          >
            Paiement Annulé
          </Typography>
          <Typography 
            variant="body1" 
            className="mb-6 text-gray-600 font-montserrat_medium"
          >
            Vous avez annulé le processus de paiement. Aucun montant n'a été débité de votre compte.
          </Typography>
          
          <div className="w-full space-y-3">
            <Button
              variant="contained"
              onClick={handleRetryPayment}
              startIcon={<RefreshIcon />}
              className="w-full py-3 text-white bg-primary hover:bg-primary-dark font-montserrat_semi_bold"
            >
              Réessayer le Paiement
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleReturnToDashboard}
              startIcon={<ArrowBackIcon />}
              className="w-full py-3 text-gray-700 border-gray-300 hover:bg-gray-50 font-montserrat_medium"
            >
              Retour aux Offres
            </Button>
          </div>
          
          <div className="p-4 mt-6 rounded-lg bg-blue-50">
            <Typography 
              variant="body2" 
              className="text-blue-700 font-montserrat_medium"
            >
              💡 Astuce: Vous pouvez également choisir de téléverser un reçu de paiement si vous préférez payer manuellement.
            </Typography>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default PaymentCancel;
