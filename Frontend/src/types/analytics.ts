export type TimeRange = '7D' | '30D' | '90D';
export type PostType = 'image' | 'video' | 'text' | 'article';
export type PostStatus = 'ready' | 'draft' | 'review';
export type ActivityType = 'milestone' | 'ai' | 'scheduled' | 'growth' | 'follower';

export interface KpiItem {
  key: string;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
}

export interface AudienceDataPoint {
  date: string;
  followers: number;
  impressions: number;
}

export interface EngagementDataPoint {
  day: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}

export interface PlatformItem {
  name: string;
  value: number;
  color: string;
  followers: string;
  growth: string;
}

export interface UpcomingPost {
  id: string;
  title: string;
  platform: string;
  scheduledTime: string;
  type: PostType;
  status: PostStatus;
}

export interface TopPost {
  id: string;
  title: string;
  platform: string;
  impressions: string;
  engagement: string;
  likes: number;
  comments: number;
  image: string;
}

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: ActivityType;
}
