export interface Photo {
  id: string;
  title: string;
  url: string;
  createdDate: Date;
  scheduledDate?: Date;
  isAIGenerated: boolean;
  tags: string[];
  usedInPosts: number;
}

export type ViewMode = 'grid' | 'list';
export type FilterType = 'all' | 'ai' | 'uploaded';
