import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Upload, Send, Save, ChevronLeft, ChevronRight, Plus, Clock, X, FileText, CheckCircle, XCircle, Sparkles, Image } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Post } from '../App';
import { Checkbox } from './ui/checkbox';
import { StoredImage } from './PhotoStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CalendarPageProps {
  posts: Post[];
  onAddPost: (post: Omit<Post, 'id'>) => void;
  onUpdatePost: (postId: string, updates: Partial<Post>) => void;
  storedImages: StoredImage[];
}

export function CalendarPage({ posts, onAddPost, onUpdatePost, storedImages }: CalendarPageProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [imageSourceTab, setImageSourceTab] = useState<'upload' | 'storage'>('upload');

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date);
    setShowModal(true);
    setCaption('');
    setImagePreview('');
    setImageFile(null);
    setSelectedTime('12:00');
    setSelectedPlatform('instagram');
    setIsAiGenerated(false);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  const handleApprovePost = (postId: string) => {
    onUpdatePost(postId, { approvalStatus: 'approved' });
    toast.success('Post approved!');
  };

  const handleDenyPost = (postId: string) => {
    onUpdatePost(postId, { approvalStatus: 'denied' });
    toast.error('Post denied');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectFromStorage = (imageUrl: string) => {
    setImagePreview(imageUrl);
    setImageFile(null);
    toast.success('Image selected from storage!');
  };

  const handleSave = (status: 'scheduled' | 'draft' | 'posted') => {
    if (!selectedDate || !imagePreview || !caption) {
      toast.error('Please fill all fields and upload an image');
      return;
    }

    onAddPost({
      date: selectedDate,
      time: selectedTime,
      caption,
      imageUrl: imagePreview,
      status,
      platform: selectedPlatform,
      isAiGenerated,
    });

    const statusMessages = {
      scheduled: 'Post scheduled successfully!',
      draft: 'Post saved as draft!',
      posted: 'Post published!',
    };

    toast.success(statusMessages[status]);
    setShowModal(false);
    setCaption('');
    setImagePreview('');
    setImageFile(null);
  };

  const getPostsForDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return posts.filter(
      (post) => post.date.toDateString() === date.toDateString()
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;
      const isValidDay = day > 0 && day <= daysInMonth;
      const date = isValidDay
        ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        : null;
      const isToday =
        date?.toDateString() === new Date().toDateString();
      const dayPosts = isValidDay ? getPostsForDate(day) : [];

      days.push(
        <div
          key={i}
          className={`min-h-32 border border-border p-2 ${
            isValidDay
              ? 'bg-card hover:bg-secondary cursor-pointer'
              : 'bg-muted'
          } ${isToday ? 'ring-2 ring-primary' : ''}`}
          onClick={() => isValidDay && handleDateClick(day)}
        >
          {isValidDay && (
            <>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm ${
                    isToday
                      ? 'bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full'
                      : 'text-foreground'
                  }`}
                >
                  {day}
                </span>
                {dayPosts.length === 0 && (
                  <Plus className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-1.5">
                {dayPosts.map((post) => (
                  <div
                    key={post.id}
                    className="relative group"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePostClick(post);
                    }}
                  >
                    <div className="flex gap-1.5 items-start p-1.5 bg-card rounded border border-border hover:border-primary transition-colors cursor-pointer">
                      <img
                        src={post.imageUrl}
                        alt="Post"
                        className="w-12 h-12 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          {post.isAiGenerated && (
                            <Sparkles className="w-3 h-3 text-purple-500" />
                          )}
                          {post.approvalStatus === 'approved' && (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          )}
                          {post.approvalStatus === 'denied' && (
                            <XCircle className="w-3 h-3 text-red-500" />
                          )}
                          {post.approvalStatus === 'pending' && (
                            <Clock className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-xs text-foreground line-clamp-2 mb-1">
                          {post.caption}
                        </p>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{post.time}</span>
                        </div>
                        <Badge
                          variant={
                            post.status === 'scheduled'
                              ? 'default'
                              : post.status === 'posted'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="mt-1 text-xs"
                        >
                          {post.platform}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }

    return days;
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const platformOptions = [
    { value: 'instagram', label: 'Instagram', color: 'bg-pink-500' },
    { value: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
    { value: 'twitter', label: 'Twitter', color: 'bg-blue-400' },
    { value: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700' },
    { value: 'tiktok', label: 'TikTok', color: 'bg-black' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen">
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-foreground mb-1">Content Calendar</h2>
            <p className="text-muted-foreground">Plan, schedule, and manage your social media posts</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-foreground min-w-48 text-center">{monthYear}</h3>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span className="text-muted-foreground">Scheduled</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-muted rounded"></div>
                <span className="text-muted-foreground">Draft</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span className="text-muted-foreground">Posted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-secondary">
        <Card className="h-full">
          <div className="grid grid-cols-7 border-b border-border">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="p-3 text-center bg-secondary border-r border-border last:border-r-0"
              >
                <span className="text-sm text-muted-foreground">{day}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">{renderCalendarDays()}</div>
        </Card>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-[1400px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Create Post
              {selectedDate && (
                <span className="text-muted-foreground ml-2">
                  · {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-[400px,1fr] gap-8 py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Platform</label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${platform.color}`}></div>
                          {platform.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Schedule Time</label>
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ai-generated"
                  checked={isAiGenerated}
                  onCheckedChange={(checked) => setIsAiGenerated(checked as boolean)}
                />
                <label
                  htmlFor="ai-generated"
                  className="text-sm text-gray-700 cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  AI Generated Content
                </label>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Select Image</label>
                <Tabs value={imageSourceTab} onValueChange={(value) => setImageSourceTab(value as 'upload' | 'storage')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="storage" className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Photo Storage
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="mt-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors min-h-[320px] flex items-center justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload-modal"
                      />
                      <label htmlFor="image-upload-modal" className="cursor-pointer w-full">
                        {imagePreview ? (
                          <div className="relative">
                            <ImageWithFallback src={imagePreview} alt="Preview" className="max-h-[280px] mx-auto rounded" />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={(e) => {
                                e.preventDefault();
                                setImagePreview('');
                                setImageFile(null);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-14 w-14 text-muted-foreground mb-3" />
                            <p className="text-foreground mb-1">Click to upload image</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="storage" className="mt-4">
                    <div className="border-2 border-gray-300 rounded-lg p-4 min-h-[320px] max-h-[320px] overflow-y-auto">
                      {storedImages.length === 0 ? (
                        <div className="text-center py-20">
                          <Image className="h-14 w-14 text-muted-foreground mx-auto mb-3" />
                          <p className="text-foreground mb-1">No images in storage</p>
                          <p className="text-xs text-muted-foreground">Generate or upload images first</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-5 gap-3">
                          {storedImages.map((image) => (
                            <div
                              key={image.id}
                              className="relative cursor-pointer group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-colors"
                              onClick={() => handleSelectFromStorage(image.url)}
                            >
                              <ImageWithFallback
                                src={image.url}
                                alt={image.prompt}
                                className="w-full aspect-square object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs line-clamp-2">{image.prompt}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-gray-700">Caption</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!imagePreview}
                    onClick={() => {
                      if (imagePreview) {
                        // Simulate AI caption generation
                        const aiCaptions = [
                          "Transform your day with our amazing products! ✨ #lifestyle #inspiration",
                          "Discover the difference quality makes. Shop now! 🛍️ #shopping #quality",
                          "Elevate your experience with us today! 🚀 #business #growth",
                          "Join thousands of satisfied customers! ⭐ #community #success",
                          "Your journey to excellence starts here! 💪 #motivation #goals"
                        ];
                        const randomCaption = aiCaptions[Math.floor(Math.random() * aiCaptions.length)];
                        setCaption(randomCaption);
                        setIsAiGenerated(true);
                        toast.success('Caption generated!');
                      }
                    }}
                  >
                    <Sparkles className="mr-2 h-3 w-3" />
                    Generate Caption
                  </Button>
                </div>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write your post caption or generate one with AI..."
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">{caption.length} characters</p>
              </div>

              <div className="border border-border rounded-lg p-4 bg-secondary">
                <h4 className="text-sm text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Post Preview
                </h4>
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Preview" className="w-full rounded" />
                    {caption && (
                      <p className="text-sm text-muted-foreground line-clamp-3">{caption}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Upload an image to see preview</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => handleSave('draft')}>
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button variant="outline" onClick={() => handleSave('posted')}>
              <Send className="mr-2 h-4 w-4" />
              Post Now
            </Button>
            <Button onClick={() => handleSave('scheduled')}>
              <Clock className="mr-2 h-4 w-4" />
              Schedule Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post Detail Dialog */}
      <Dialog open={showPostDetail} onOpenChange={setShowPostDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {selectedPost.isAiGenerated && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Generated
                  </Badge>
                )}
                <Badge
                  variant={
                    selectedPost.approvalStatus === 'approved'
                      ? 'default'
                      : selectedPost.approvalStatus === 'denied'
                      ? 'destructive'
                      : 'outline'
                  }
                >
                  {selectedPost.approvalStatus === 'approved' && 'Approved'}
                  {selectedPost.approvalStatus === 'denied' && 'Denied'}
                  {selectedPost.approvalStatus === 'pending' && 'Pending Approval'}
                </Badge>
              </div>

              <div>
                <img
                  src={selectedPost.imageUrl}
                  alt="Post"
                  className="w-full rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-foreground">Caption</label>
                <p className="text-sm text-muted-foreground">{selectedPost.caption}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground">Platform</label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedPost.platform}</p>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Time</label>
                  <p className="text-sm text-muted-foreground">{selectedPost.time}</p>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Date</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedPost.date.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Status</label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedPost.status}</p>
                </div>
              </div>

              {selectedPost.approvalStatus === 'pending' && (
                <div className="flex gap-4 pt-4 border-t border-border">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleApprovePost(selectedPost.id);
                      setShowPostDetail(false);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Post
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleDenyPost(selectedPost.id);
                      setShowPostDetail(false);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Deny Post
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
