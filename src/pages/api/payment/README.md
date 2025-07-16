# Payment System Documentation

## Overview
This payment system provides three main pages for handling Paymee payment flows:

1. **Payment Return Page** (`/payment/return`) - Handles successful payment returns
2. **Payment Cancel Page** (`/payment/cancel`) - Handles payment cancellations  
3. **Payment Webhook Page** (`/payment/webhook`) - Handles webhook verification

## Pages

### 1. Payment Return (`/payment/return`)
**URL**: `/payment/return?payment_token=xxx&transaction=xxx`

**Purpose**: Verifies payment status when users return from Paymee payment gateway.

**Features**:
- Automatic payment verification using URL parameters
- Success/failure status display
- Redirect options back to dashboard
- Real-time notifications

**URL Parameters**:
- `payment_token` - The payment token from Paymee
- `transaction` - The transaction ID

### 2. Payment Cancel (`/payment/cancel`)
**URL**: `/payment/cancel`

**Purpose**: Provides a user-friendly cancellation page when payment is cancelled.

**Features**:
- Clear cancellation message
- Options to retry payment or return to offers
- Helpful tips for alternative payment methods

### 3. Payment Webhook (`/payment/webhook`)
**URL**: `/payment/webhook`

**Purpose**: Verifies webhook data received from Paymee payment gateway.

**Features**:
- Manual webhook verification form
- Automatic verification from URL parameters
- Support for webhook data format:
  ```json
  {
    "token": "your-paymee-token",
    "payment_status": true,
    "order_id": "your-order-id", 
    "check_sum": "md5checksum"
  }
  ```

## Services

### Payment Service Functions

#### `verifyPaymentService(params)`
Verifies payment using token and transaction ID.
```typescript
const params = {
  payment_token: "token_here",
  transaction: "transaction_id_here"
};
```

#### `verifyPaymentWebhookService(data)`
Verifies webhook data from Paymee.
```typescript
const data = {
  token: "your-paymee-token",
  payment_status: true,
  order_id: "your-order-id",
  check_sum: "md5checksum"
};
```

## Usage Examples

### 1. Setting up payment return URL
Configure your Paymee payment gateway to redirect to:
```
https://yourdomain.com/payment/return
```

### 2. Setting up payment cancel URL  
Configure your Paymee payment gateway to redirect cancellations to:
```
https://yourdomain.com/payment/cancel
```

### 3. Setting up webhook endpoint
Configure your Paymee webhook to send data to:
```
https://yourdomain.com/payment/webhook
```

### 4. Testing webhook verification
You can test webhook verification by:
1. Visiting `/payment/webhook`
2. Filling in the form with test data
3. Clicking "Vérifier Webhook"

Or by sending URL parameters:
```
/payment/webhook?token=test_token&order_id=123&check_sum=abc123&payment_status=true
```

## Error Handling

All pages include comprehensive error handling:
- Network errors
- Invalid payment data
- Malformed responses
- User-friendly error messages
- Automatic retry options

## Security

- All webhook data is verified server-side
- Checksum validation for webhook integrity
- Secure token-based verification
- Protection against malformed requests

## Integration

These pages are automatically integrated into your React Router setup in `App.tsx`:

```typescript
// Payment Routes
<Route path="/payment/return" element={<PaymentReturn />} />
<Route path="/payment/cancel" element={<PaymentCancel />} />
<Route path="/payment/webhook" element={<PaymentWebhook />} />
```
