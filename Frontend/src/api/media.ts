import { api } from './client';

export const mediaApi = {
  list: (businessId: string) =>
    api.get(`/businesses/${businessId}/media`),

  upload: async (businessId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = (await import('../auth/store')).store.getState().auth.token;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

    const response = await fetch(`${baseUrl}/businesses/${businessId}/media`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },
};
