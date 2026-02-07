import { useState } from 'react';
import { Button } from '../components/ui/button';
import { CalendarView } from '../components/CalendarView';
import { PostModal } from '../components/PostModal';
import { PostDetailModal } from '../components/PostDetailModal';
import { Plus } from 'lucide-react';

interface Post {
  id: string;
  image?: string;
  caption: string;
  createdDate: Date;
  scheduledDate?: Date;
  status: 'draft' | 'scheduled';
}

export function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
      caption: 'Excited to share our new product line! Check out these amazing features. #ProductLaunch #Innovation',
      createdDate: new Date(2026, 0, 20),
      scheduledDate: new Date(2026, 0, 25, 14, 0),
      status: 'scheduled'
    },
    {
      id: '2',
      caption: 'Behind the scenes at our office. Our team is working hard to bring you the best experience! #TeamWork',
      createdDate: new Date(2026, 0, 22),
      status: 'draft'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
      caption: 'Customer success story: How we helped increase engagement by 200%. Read more on our blog! #CaseStudy',
      createdDate: new Date(2026, 0, 28),
      scheduledDate: new Date(2026, 0, 30, 10, 0),
      status: 'scheduled'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDetailModalOpen, setIsPostDetailModalOpen] = useState(false);

  const handleDateClick = (date: Date, postsForDate: Post[]) => {
    setSelectedDate(date);
    setSelectedPosts(postsForDate);
    setIsModalOpen(true);
  };

  const handleCreatePost = (date: Date) => {
    setSelectedDate(date);
    setSelectedPosts([]);
    setIsModalOpen(true);
  };

  const handleSavePost = (postData: Partial<Post>) => {
    const newPost: Post = {
      id: Date.now().toString(),
      caption: postData.caption || '',
      createdDate: postData.createdDate || new Date(),
      scheduledDate: postData.scheduledDate,
      status: postData.status || 'draft',
      image: postData.image
    };
    setPosts([...posts, newPost]);
  };

  const handleUpdatePost = (postId: string, updates: Partial<Post>) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsPostDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Content Calendar</h2>
          <p className="text-muted-foreground mt-1">Plan and schedule your social media content</p>
        </div>
        <Button
          onClick={() => handleCreatePost(new Date())}
          className="gradient-blue-primary text-white hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Posts</div>
          <div className="text-2xl font-semibold text-foreground mt-1">{posts.length}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Scheduled</div>
          <div className="text-2xl font-semibold text-destructive mt-1">
            {posts.filter(p => p.status === 'scheduled').length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Drafts</div>
          <div className="text-2xl font-semibold text-muted-foreground mt-1">
            {posts.filter(p => p.status === 'draft').length}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <CalendarView
        posts={posts}
        onPostClick={handlePostClick}
        onCreatePost={handleCreatePost}
      />

      {/* Post Modal */}
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        posts={selectedPosts}
        onSavePost={handleSavePost}
        onUpdatePost={handleUpdatePost}
        onDeletePost={handleDeletePost}
      />

      {/* Post Detail Modal */}
      <PostDetailModal
        isOpen={isPostDetailModalOpen}
        onClose={() => setIsPostDetailModalOpen(false)}
        post={selectedPost}
        onUpdatePost={handleUpdatePost}
        onDeletePost={handleDeletePost}
      />
    </div>
  );
}