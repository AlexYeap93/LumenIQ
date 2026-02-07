export interface UserSettings {
  profile: {
    name: string;
    email: string;
    avatar?: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
  };
}

export interface ConnectedAccount {
  id: string;
  platform: string;
  username: string;
  connected: boolean;
  avatar?: string;
}
