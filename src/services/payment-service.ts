import NetworkService from "../config/interceptor/interceptor";

export interface PaymeePaymentInit {
  student_id: string;
  student_offer_id: number;
  subject_ids: number[];
  payment_type?: string;
}

export const initiatePaymeePaymentService = async (data: PaymeePaymentInit | (PaymeePaymentInit & { paymentImage?: File })) => {
  let requestData: any = data;
  let headers: any = {};
  // If paymentImage is present, use FormData
  if ((data as any).paymentImage) {
    const formData = new FormData();
    formData.append('student_id', (data as any).student_id);
    formData.append('student_offer_id', String((data as any).student_offer_id));
    (data as any).subject_ids.forEach((id: number) => formData.append('subject_ids', String(id)));
    formData.append('payment_type', (data as any).payment_type || 'upload');
    formData.append('paymentImage', (data as any).paymentImage);
    requestData = formData;
    headers['Content-Type'] = 'multipart/form-data';
  }
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: 'payments/initiate',
    method: 'POST',
    withLoader: true,
    withFailureLogs: false,
    data: requestData,
    headers,
  } as any);
  return response.data;
};

export interface PaymentWebhookData {
  token: string;
  payment_status: boolean;
  order_id: string;
  check_sum: string;
}

export interface PaymentVerificationParams {
  payment_token: string;
  transaction: string;
}

export const verifyPaymentWebhookService = async (data: PaymentWebhookData) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: 'payments/webhook/verify',
    method: 'POST',
    withLoader: true,
    withFailureLogs: false,
    data: data,
  } as any);
  return response.data;
};

export const verifyPaymentService = async (params: PaymentVerificationParams) => {
  const response = await NetworkService.getInstance().sendHttpRequest({
    url: `payments/return?payment_token=${params.payment_token}&transaction=${params.transaction}`,
    method: 'GET',
    withLoader: true,
    withFailureLogs: false,
  } as any);
  return response.data;
};


