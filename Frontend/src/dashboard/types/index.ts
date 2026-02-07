export interface Post {
  id: string;
  date: Date;
  content: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  status: 'draft' | 'scheduled' | 'published';
  imageUrl?: string;
}

export interface CalendarDay {
  date: Date;
  posts: Post[];
  isCurrentMonth: boolean;
}
