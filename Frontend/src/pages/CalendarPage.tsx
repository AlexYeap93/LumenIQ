import { useState } from 'react';
import { Button } from '../components/ui/button';
import { CalendarView } from '../components/CalendarView';
import { PostModal } from '../modals/PostModal';
import { PostDetailModal } from '../modals/PostDetailModal';
import { PostListModal } from '../modals/PostListModal';
import { Plus, Calendar, FileText } from 'lucide-react';

interface Post {
  id: string;
  images?: string[];
  caption: string;
  createdDate: Date;
  scheduledDate?: Date;
  status: 'draft' | 'scheduled';
}

export function CalendarPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop'],
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
      images: ['https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop'],
      caption: 'Customer success story: How we helped increase engagement by 200%. Read more on our blog! #CaseStudy',
      createdDate: new Date(2026, 0, 28),
      scheduledDate: new Date(2026, 0, 30, 10, 0),
      status: 'scheduled'
    },
    {
      id: '4',
      images: [
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop'
      ],
      caption: 'Team collaboration in action! 💼 Our dedicated team brings innovative solutions to life. #Teamwork #Innovation',
      createdDate: new Date(2026, 0, 25),
      scheduledDate: new Date(2026, 1, 5, 9, 0),
      status: 'scheduled'
    },
    {
      id: '5',
      images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'],
      caption: 'Q1 Planning Session 📊 Setting ambitious goals for the quarter ahead!',
      createdDate: new Date(2026, 0, 25),
      scheduledDate: new Date(2026, 1, 5, 15, 0),
      status: 'scheduled'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDetailModalOpen, setIsPostDetailModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listFilter, setListFilter] = useState<'draft' | 'scheduled'>('scheduled');

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
      images: postData.images
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

  const handleShowList = (filter: 'draft' | 'scheduled') => {
    setListFilter(filter);
    setIsListModalOpen(true);
  };

  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const draftPosts = posts.filter(p => p.status === 'draft');

  return (
    <div className="relative min-h-screen text-slate-900 font-switzer">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-slate-200/50 blur-3xl" />
      </div>
      <div className="mx-auto max-w-[96rem] space-y-8 px-4 pb-16 pt-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-outfit text-slate-900">Content Calendar</h2>
            <p className="text-slate-600">Plan and schedule your social media content</p>
          </div>
          <Button
            onClick={() => handleCreatePost(new Date())}
            className="gradient-blue-primary text-white shadow-sm hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleShowList('scheduled')}
            className="flex items-center gap-2 border-slate-200/70 bg-white/90 text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50/40 hover:text-blue-600"
          >
            <Calendar className="w-4 h-4" />
            Scheduled ({scheduledPosts.length})
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShowList('draft')}
            className="flex items-center gap-2 border-slate-200/70 bg-white/90 text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900"
          >
            <FileText className="w-4 h-4" />
            Drafts ({draftPosts.length})
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm">
            <div className="text-sm text-slate-500">Total Posts</div>
            <div className="mt-2 text-3xl font-outfit text-slate-900">{posts.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm">
            <div className="text-sm text-slate-500">Scheduled</div>
            <div className="mt-2 text-3xl font-outfit text-blue-600">
              {scheduledPosts.length}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm">
            <div className="text-sm text-slate-500">Drafts</div>
            <div className="mt-2 text-3xl font-outfit text-slate-600">
              {draftPosts.length}
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

        {/* Post List Modal */}
        <PostListModal
          isOpen={isListModalOpen}
          onClose={() => setIsListModalOpen(false)}
          posts={listFilter === 'scheduled' ? scheduledPosts : draftPosts}
          filter={listFilter}
          onPostClick={handlePostClick}
        />
      </div>
    </div>
  );
}
