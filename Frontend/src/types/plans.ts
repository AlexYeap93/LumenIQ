export interface PlanOption {
  id: string;
  name: string;
  priceLabel: string;
  description?: string;
  features?: string[];
  isEnterprise?: boolean;
}

export interface PlanStream {
  id: string;
  title: string;
  subtitle: string;
  plans: PlanOption[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
}
