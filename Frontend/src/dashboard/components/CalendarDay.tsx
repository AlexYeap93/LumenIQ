import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface Post {
  id: string;
  image?: string;
  caption: string;
  createdDate: Date;
  scheduledDate?: Date;
  status: 'draft' | 'scheduled';
}

interface CalendarDayProps {
  day: number;
  date: Date;
  isToday: boolean;
  posts: Post[];
  onPostClick: (post: Post) => void;
  onCreatePost: (date: Date) => void;
}

export function CalendarDay({ 
  day, 
  date, 
  isToday, 
  posts,
  onPostClick,
  onCreatePost 
}: CalendarDayProps) {
  
  return (
    <motion.div
      className={`aspect-square border rounded-lg p-2 relative cursor-pointer transition-all hover:shadow-md ${
        isToday
          ? 'border-primary bg-accent'
          : 'border-border bg-background'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Day number */}
      <div className={`text-sm font-medium ${
        isToday ? 'text-primary' : 'text-foreground'
      }`}>
        {day}
      </div>

      {/* Post indicators */}
      <div className="mt-1 space-y-1">
        {posts.slice(0, 2).map(post => (
          <button
            key={post.id}
            className="relative cursor-pointer rounded overflow-hidden w-full block"
            onClick={(e) => {
              e.stopPropagation();
              onPostClick(post);
            }}
          >
            {/* Photo thumbnail or placeholder */}
            {post.image ? (
              <div className="relative w-full aspect-video">
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
                {/* Status badge overlay */}
                <div className={`absolute top-0.5 right-0.5 text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                  post.status === 'draft'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-green-500 text-white'
                }`}>
                  {post.status === 'draft' ? 'DRAFT' : 'SCHEDULED'}
                </div>
              </div>
            ) : (
              <div className="relative w-full aspect-video">
                {/* Placeholder image for drafts */}
                <div className={`w-full h-full flex items-center justify-center ${
                  post.status === 'draft'
                    ? 'bg-gradient-to-br from-yellow-50 to-yellow-100'
                    : 'bg-gradient-to-br from-green-50 to-green-100'
                }`}>
                  <div className="text-center">
                    <div className="text-2xl mb-1">
                      {post.status === 'draft' ? '📝' : '📅'}
                    </div>
                  </div>
                </div>
                {/* Status badge overlay */}
                <div className={`absolute top-0.5 right-0.5 text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                  post.status === 'draft'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-green-500 text-white'
                }`}>
                  {post.status === 'draft' ? 'DRAFT' : 'SCHEDULED'}
                </div>
              </div>
            )}
          </button>
        ))}
        {posts.length > 2 && (
          <div className="text-[10px] text-muted-foreground text-center">
            +{posts.length - 2} more
          </div>
        )}
      </div>

      {/* Add post button (shows on hover) */}
      {posts.length === 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreatePost(date);
          }}
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          <Plus className="w-5 h-5 text-primary" />
        </button>
      )}
    </motion.div>
  );
}
