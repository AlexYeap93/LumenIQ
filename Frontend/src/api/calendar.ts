import { api } from './client';
import type { CalendarPostAPI } from '../types/calendar';

interface CreatePostPayload {
  caption?: string;
  media?: string[];
  scheduled_at?: string;
  status?: string;
  post_type?: string;
  platform?: string;
}

interface UpdatePostPayload {
  caption?: string;
  media?: string[];
  scheduled_at?: string | null;
  status?: string;
  post_type?: string;
  platform?: string;
}

export const calendarApi = {
  listPosts: (businessId: string, calendarId?: string, status?: string) => {
    const params = new URLSearchParams();
    if (calendarId) params.set('calendar_id', calendarId);
    if (status) params.set('status', status);
    const qs = params.toString();
    return api.get<CalendarPostAPI[]>(
      `/businesses/${businessId}/calendar/posts${qs ? `?${qs}` : ''}`,
    );
  },

  createPost: (businessId: string, data: CreatePostPayload) =>
    api.post<CalendarPostAPI>(`/businesses/${businessId}/calendar/posts`, data),

  updatePost: (businessId: string, postId: string, data: UpdatePostPayload) =>
    api.patch<CalendarPostAPI>(`/businesses/${businessId}/calendar/posts/${postId}`, data),

  deletePost: (businessId: string, postId: string) =>
    api.delete(`/businesses/${businessId}/calendar/posts/${postId}`),
};
