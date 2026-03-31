import { api } from './client';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

interface UserProfileResponse {
  user_id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  plan: string;
  stripe_customer_id: string | null;
  notification_preferences: {
    email_notifications: boolean;
    push_notifications: boolean;
    marketing_emails: boolean;
    post_reminders: boolean;
    weekly_reports: boolean;
    ai_suggestions: boolean;
  };
  created_at: string | null;
  updated_at: string | null;
}

export const authApi = {
  signIn: (payload: SignInPayload) =>
    api.post<TokenResponse>('/auth/signin', payload, { skipAuth: true }),

  signUp: (payload: SignUpPayload) =>
    api.post<TokenResponse>('/auth/signup', payload, { skipAuth: true }),

  signOut: () =>
    api.post('/auth/signout'),

  refreshToken: (refreshToken: string) =>
    api.post<TokenResponse>('/auth/refresh', { refresh_token: refreshToken }, { skipAuth: true }),

  googleOAuth: (idToken: string) =>
    api.post<TokenResponse>('/auth/oauth/google', { id_token: idToken }, { skipAuth: true }),

  getProfile: () =>
    api.get<UserProfileResponse>('/users/me'),

  updateProfile: (updates: Record<string, unknown>) =>
    api.patch<UserProfileResponse>('/users/me', updates),
};

export function mapProfileToFrontend(profile: UserProfileResponse) {
  return {
    id: profile.user_id,
    email: '',
    firstName: profile.first_name ?? undefined,
    lastName: profile.last_name ?? undefined,
    avatarUrl: profile.avatar_url ?? undefined,
    accountPlan: profile.plan,
    phone: profile.phone ?? undefined,
  };
}

export type { TokenResponse, UserProfileResponse };
