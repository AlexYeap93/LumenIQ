export interface NotificationPreferences {
  emailNotifications: boolean;
  postReminders: boolean;
  weeklyReports: boolean;
  aiSuggestions: boolean;
}

export interface UserProfile {
  userId: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  plan: string;
  stripeCustomerId?: string;
  notificationPreferences: NotificationPreferences;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfileUpdate {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  plan?: string;
  notificationPreferences?: Partial<NotificationPreferences>;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
