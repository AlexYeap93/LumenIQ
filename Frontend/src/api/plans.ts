import { api } from './client';
import type { PlanStream, PlanOption } from '../types/plans';

interface RawPlanOption {
  id: string;
  name: string;
  price_label: string;
  description?: string;
  features?: string[];
  is_enterprise?: boolean;
}

interface RawPlanStream {
  id: string;
  title: string;
  subtitle: string;
  plans: RawPlanOption[];
}

function mapPlan(raw: RawPlanOption): PlanOption {
  return {
    id: raw.id,
    name: raw.name,
    priceLabel: raw.price_label,
    description: raw.description,
    features: raw.features,
    isEnterprise: raw.is_enterprise,
  };
}

function mapStream(raw: RawPlanStream): PlanStream {
  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle,
    plans: raw.plans.map(mapPlan),
  };
}

export const plansApi = {
  list: async (): Promise<PlanStream[]> => {
    const raw = await api.get<RawPlanStream[]>('/plans', { skipAuth: true });
    return raw.map(mapStream);
  },
};
