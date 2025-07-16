import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, CircularProgress, TextField } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import SecurityIcon from "@mui/icons-material/Security";
import { verifyPaymentWebhookService, PaymentWebhookData } from "../../../services/payment-service";
import { SnackbarContext } from "../../../config/hooks/use-toast";

const PaymentWebhook = () => {
  const navigate = useNavigate();
  const snackbarContext = useContext(SnackbarContext);
  
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [webhookMessage, setWebhookMessage] = useState('');
  
  // Form state for manual testing
  const [webhookData, setWebhookData] = useState<PaymentWebhookData>({
    token: '',
    payment_status: true,
    order_id: '',
    check_sum: ''
  });

  const handleInputChange = (field: keyof PaymentWebhookData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'payment_status' 
      ? event.target.checked 
      : event.target.value;
    
    setWebhookData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const verifyWebhook = useCallback(async (data: PaymentWebhookData) => {
    setIsLoading(true);
    try {
      const response = await verifyPaymentWebhookService(data);
      
      console.log('Webhook verification response:', response);

      if (response.success || response.verified) {
        setVerificationStatus('success');
        setWebhookMessage('Webhook vérifié avec succès! Le paiement a été confirmé.');
        
        if (snackbarContext) {
          snackbarContext.showMessage(
            "Succès",
            "Webhook de paiement vérifié avec succès!",
            "success",
          );
        }
      } else {
        setVerificationStatus('failed');
        setWebhookMessage(response.message || response.error || 'Échec de la vérification du webhook');
        
        if (snackbarContext) {
          snackbarContext.showMessage(
            "Erreur",
            "Échec de la vérification du webhook",
            "error",
          );
        }
      }
    } catch (error) {
      console.error('Webhook verification error:', error);
      setVerificationStatus('failed');
      setWebhookMessage('Erreur lors de la vérification du webhook');
      
      if (snackbarContext) {
        snackbarContext.showMessage(
          "Erreur",
          "Erreur lors de la vérification du webhook",
          "error",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [snackbarContext]);

  const handleVerifyWebhook = () => {
    if (!webhookData.token || !webhookData.order_id || !webhookData.check_sum) {
      if (snackbarContext) {
        snackbarContext.showMessage(
          "Erreur",
          "Veuillez remplir tous les champs requis",
          "error",
        );
      }
      return;
    }

    verifyWebhook(webhookData);
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard/offer-student');
  };

  // Auto-verify if webhook data is passed via URL parameters or POST data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const orderId = urlParams.get('order_id');
    const checkSum = urlParams.get('check_sum');
    const paymentStatus = urlParams.get('payment_status');

    if (token && orderId && checkSum) {
      const autoWebhookData: PaymentWebhookData = {
        token,
        order_id: orderId,
        check_sum: checkSum,
        payment_status: paymentStatus === 'true' || paymentStatus === '1'
      };
      
      verifyWebhook(autoWebhookData);
    }
  }, [verifyWebhook]);

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center mb-6 text-center">
          <SecurityIcon 
            className="mb-4 text-blue-500" 
            style={{ fontSize: 60 }}
          />
          <Typography 
            variant="h4" 
            className="mb-2 text-blue-600 font-montserrat_semi_bold"
          >
            Vérification Webhook
          </Typography>
          <Typography 
            variant="body1" 
            className="text-gray-600 font-montserrat_medium"
          >
            Vérifiez les données de paiement reçues via webhook
          </Typography>
        </div>

        {verificationStatus === 'idle' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                label="Token"
                value={webhookData.token}
                onChange={handleInputChange('token')}
                fullWidth
                variant="outlined"
                placeholder="your-paymee-token"
              />
              <TextField
                label="Order ID"
                value={webhookData.order_id}
                onChange={handleInputChange('order_id')}
                fullWidth
                variant="outlined"
                placeholder="your-order-id"
              />
            </div>
            
            <TextField
              label="Checksum (MD5)"
              value={webhookData.check_sum}
              onChange={handleInputChange('check_sum')}
              fullWidth
              variant="outlined"
              placeholder="md5checksum"
            />
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="payment_status"
                checked={webhookData.payment_status}
                onChange={handleInputChange('payment_status')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="payment_status" className="text-gray-700 font-montserrat_medium">
                Paiement réussi
              </label>
            </div>

            <div className="pt-4">
              <Button
                variant="contained"
                onClick={handleVerifyWebhook}
                disabled={isLoading}
                className="w-full py-3 text-white bg-primary hover:bg-primary-dark font-montserrat_semi_bold"
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} className="mr-2 text-white" />
                    Vérification en cours...
                  </>
                ) : (
                  'Vérifier Webhook'
                )}
              </Button>
            </div>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="text-center">
            <CheckCircleIcon 
              className="mb-4 text-green-500" 
              style={{ fontSize: 80 }}
            />
            <Typography 
              variant="h5" 
              className="mb-4 text-green-600 font-montserrat_semi_bold"
            >
              Webhook Vérifié!
            </Typography>
            <Typography 
              variant="body1" 
              className="mb-6 text-gray-600 font-montserrat_medium"
            >
              {webhookMessage}
            </Typography>
            <Button
              variant="contained"
              onClick={handleReturnToDashboard}
              className="px-8 py-3 text-white bg-primary hover:bg-primary-dark font-montserrat_semi_bold"
            >
              Retour au Dashboard
            </Button>
          </div>
        )}

        {verificationStatus === 'failed' && (
          <div className="text-center">
            <ErrorIcon 
              className="mb-4 text-red-500" 
              style={{ fontSize: 80 }}
            />
            <Typography 
              variant="h5" 
              className="mb-4 text-red-600 font-montserrat_semi_bold"
            >
              Échec de la Vérification
            </Typography>
            <Typography 
              variant="body1" 
              className="mb-6 text-gray-600 font-montserrat_medium"
            >
              {webhookMessage}
            </Typography>
            <div className="flex space-x-3">
              <Button
                variant="outlined"
                onClick={() => {
                  setVerificationStatus('idle');
                  setWebhookMessage('');
                }}
                className="flex-1 py-3 text-gray-700 border-gray-300 font-montserrat_medium"
              >
                Réessayer
              </Button>
              <Button
                variant="contained"
                onClick={handleReturnToDashboard}
                className="flex-1 py-3 text-white bg-primary hover:bg-primary-dark font-montserrat_semi_bold"
              >
                Retour
              </Button>
            </div>
          </div>
        )}

        {/* Information Box */}
        <div className="p-4 mt-8 rounded-lg bg-blue-50">
          <Typography 
            variant="body2" 
            className="text-blue-700 font-montserrat_medium"
          >
            <strong>Format des données webhook attendu:</strong><br/>
            • Token: Votre token Paymee<br/>
            • Payment Status: true/false<br/>
            • Order ID: Identifiant de la commande<br/>
            • Check Sum: Somme de contrôle MD5
          </Typography>
        </div>
      </div>
    </Box>
  );
};

export default PaymentWebhook;
