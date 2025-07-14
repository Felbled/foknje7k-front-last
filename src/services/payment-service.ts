import NetworkService from "../config/interceptor/interceptor";

// Initiate a payment (online or manual)
export const initiatePaymentService = async (payload: {
  student_id: number;
  student_offer_id: number;
}) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: "payments/initiate",
    method: "POST",
    data: payload,
    withLoader: true,
    withFailureLogs: true,
  });
  return response.data;
};

// Verify payment status (after redirect or webhook)
export const verifyPaymentService = async (payment_token: string) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `payments/return`,
    method: "GET",
    params: { payment_token },
  });
  return response.data;
};

