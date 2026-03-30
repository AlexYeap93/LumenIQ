export interface CurrentPlan {
  name: string;
  price: number;
  type: string;
  billingPeriod: string;
  maxBrands: number;
  features: string[];
}

export interface PaymentMethod {
  last4: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface CreateCheckoutSessionRequest {
  price_id: string;
  success_url: string;
  cancel_url: string;
}

export interface CreateCheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface CustomerPortalResponse {
  portal_url: string;
}
