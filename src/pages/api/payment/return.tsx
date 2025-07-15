import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { verifyPaymentService } from "../../../services/payment-service";
import { SnackbarContext } from "../../../config/hooks/use-toast";

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const snackbarContext = useContext(SnackbarContext);
  
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending');
  const [paymentMessage, setPaymentMessage] = useState('');



  useEffect(() => {
    const paymentToken = searchParams.get('payment_token');
    const transaction = searchParams.get('transaction');

    const verifyPaymentStatus = async (paymentToken: string, transaction: string) => {
      try {
        const response = await verifyPaymentService({
          payment_token: paymentToken,
          transaction: transaction
        });

        console.log('Payment verification response:', response);

        // Handle different response structures
        const isSuccessful = response.success === true || 
                            response.status === 'success' || 
                            response.status === 'ACCEPTED' ||
                            response.status === 'accepted' ||
                            response.payment_status === 'completed' ||
                            response.state === 'success' ||
                            response.payment_status === true;

        if (isSuccessful) {
          setPaymentStatus('success');
          setPaymentMessage('Paiement effectué avec succès! Votre inscription a été confirmée.');
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Succès",
              "Paiement effectué avec succès!",
              "success",
            );
          }
        } else {
          setPaymentStatus('failed');
          setPaymentMessage(response.message || response.error || 'Le paiement a échoué');
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Erreur",
              "Le paiement a échoué",
              "error",
            );
          }
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentStatus('failed');
        setPaymentMessage('Erreur lors de la vérification du paiement');
        if (snackbarContext) {
          snackbarContext.showMessage(
            "Erreur",
            "Erreur lors de la vérification du paiement",
            "error",
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (paymentToken && transaction) {
      verifyPaymentStatus(paymentToken, transaction);
    } else {
      setIsLoading(false);
      setPaymentStatus('failed');
      setPaymentMessage('Paramètres de paiement manquants');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleReturnToDashboard = () => {
    navigate('/dashboard/offer-student');
  };

  const handleRetryPayment = () => {
    navigate('/dashboard/offer-student');
  };

  if (isLoading) {
    return (
      <Box 
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
      >
        <CircularProgress size={60} className="mb-4 text-primary" />
        <Typography variant="h6" className="text-gray-600 font-montserrat_medium">
          Vérification du paiement en cours...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 mx-4 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center">
          {paymentStatus === 'success' ? (
            <>
              <CheckCircleIcon 
                className="mb-4 text-green-500" 
                style={{ fontSize: 80 }}
              />
              <Typography 
                variant="h4" 
                className="mb-4 text-green-600 font-montserrat_semi_bold"
              >
                Paiement Réussi!
              </Typography>
              <Typography 
                variant="body1" 
                className="mb-6 text-gray-600 font-montserrat_medium"
              >
                {paymentMessage}
              </Typography>
              <Button
                variant="contained"
                onClick={handleReturnToDashboard}
                className="w-full py-3 text-white bg-primary hover:bg-primary-dark font-montserrat_semi_bold"
              >
                Retour aux Offres
              </Button>
            </>
          ) : (
            <>
              <ErrorIcon 
                className="mb-4 text-red-500" 
                style={{ fontSize: 80 }}
              />
              <Typography 
                variant="h4" 
                className="mb-4 text-red-600 font-montserrat_semi_bold"
              >
                Paiement Échoué
              </Typography>
              <Typography 
                variant="body1" 
                className="mb-6 text-gray-600 font-montserrat_medium"
              >
                {paymentMessage}
              </Typography>
              <div className="flex w-full space-x-3">
                <Button
                  variant="outlined"
                  onClick={handleReturnToDashboard}
                  className="flex-1 py-3 text-gray-700 border-gray-300 font-montserrat_medium"
                >
                  Retour
                </Button>
                <Button
                  variant="contained"
                  onClick={handleRetryPayment}
                  className="flex-1 py-3 text-white bg-primary hover:bg-primary-dark font-montserrat_semi_bold"
                >
                  Réessayer
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Box>
  );
};

export default PaymentReturn;
