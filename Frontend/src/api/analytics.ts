import { api } from './client';
import type {
  KpiItem,
  AudienceDataPoint,
  EngagementDataPoint,
  PlatformItem,
  TopPost,
  ActivityItem,
} from '../types/analytics';

export const analyticsApi = {
  getKpis: (businessId: string, range: string) =>
    api.get<KpiItem[]>(`/businesses/${businessId}/analytics/kpis?range=${range}`),

  getAudience: (businessId: string, range: string) =>
    api.get<AudienceDataPoint[]>(`/businesses/${businessId}/analytics/audience?range=${range}`),

  getEngagement: (businessId: string, range: string) =>
    api.get<EngagementDataPoint[]>(`/businesses/${businessId}/analytics/engagement?range=${range}`),

  getPlatforms: (businessId: string) =>
    api.get<PlatformItem[]>(`/businesses/${businessId}/analytics/platforms`),

  getTopPosts: (businessId: string, range: string) =>
    api.get<TopPost[]>(`/businesses/${businessId}/analytics/top-posts?range=${range}`),

  getActivity: (businessId: string, limit = 10) =>
    api.get<ActivityItem[]>(`/businesses/${businessId}/analytics/activity?limit=${limit}`),
};
