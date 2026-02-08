import { useState } from 'react';
import { Upload, Search, Calendar, Image as ImageIcon, Trash2, Grid, List, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';

interface Photo {
  id: string;
  title: string;
  url: string;
  createdDate: Date;
  scheduledDate?: Date;
  isAIGenerated: boolean;
  tags: string[];
  usedInPosts: number;
}

export function PhotoStoragePage() {
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      title: 'Business Team',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
      createdDate: new Date(2026, 0, 15),
      scheduledDate: new Date(2026, 0, 25),
      isAIGenerated: true,
      tags: ['business', 'team', 'office'],
      usedInPosts: 2
    },
    {
      id: '2',
      title: 'Collaboration Meeting',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
      createdDate: new Date(2026, 0, 18),
      isAIGenerated: false,
      tags: ['collaboration', 'meeting'],
      usedInPosts: 1
    },
    {
      id: '3',
      title: 'Workspace Laptop',
      url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
      createdDate: new Date(2026, 0, 20),
      isAIGenerated: true,
      tags: ['workspace', 'laptop'],
      usedInPosts: 0
    },
    {
      id: '4',
      title: 'Innovation Technology',
      url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
      createdDate: new Date(2026, 0, 22),
      scheduledDate: new Date(2026, 0, 30),
      isAIGenerated: false,
      tags: ['innovation', 'technology'],
      usedInPosts: 1
    },
    {
      id: '5',
      title: 'Professional Portrait',
      url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop',
      createdDate: new Date(2026, 0, 24),
      isAIGenerated: true,
      tags: ['professional', 'portrait'],
      usedInPosts: 0
    },
    {
      id: '6',
      title: 'Discussion Planning',
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop',
      createdDate: new Date(2026, 0, 26),
      isAIGenerated: false,
      tags: ['discussion', 'planning'],
      usedInPosts: 3
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'ai' | 'uploaded'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('12:00');

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.tags.some(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'ai' && photo.isAIGenerated) ||
      (filterType === 'uploaded' && !photo.isAIGenerated);

    return (searchQuery === '' || matchesSearch) && matchesFilter;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(photos.filter(p => p.id !== photoId));
    setSelectedPhoto(null);
  };

  const handleUseInPost = () => {
    setShowDatePicker(true);
  };

  const handleSchedulePost = () => {
    // In production, this would navigate to dashboard with selected photo and date
    alert(`Photo scheduled for ${selectedDate} at ${selectedTime}`);
    setShowDatePicker(false);
    setSelectedPhoto(null);
  };

  return (
    <div className="relative min-h-screen text-slate-900 font-switzer">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-slate-200/50 blur-3xl" />
      </div>
      <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-outfit text-slate-900">Photo Storage</h2>
            <p className="text-slate-600">Manage your media library</p>
          </div>
          <Button className="gradient-blue-primary text-white hover:opacity-90">
            <Upload className="w-4 h-4 mr-2" />
            Upload Photos
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm">
            <div className="text-sm text-slate-600">Total Images</div>
            <div className="mt-1 text-2xl font-outfit text-slate-900">{photos.length}</div>
          </Card>
          <Card className="rounded-2xl border border-blue-100/80 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-4 shadow-sm">
            <div className="text-sm text-slate-600">AI Generated</div>
            <div className="mt-1 text-2xl font-outfit text-blue-700">
              {photos.filter(p => p.isAIGenerated).length}
            </div>
          </Card>
          <Card className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm">
            <div className="text-sm text-slate-600">Uploaded</div>
            <div className="mt-1 text-2xl font-outfit text-slate-900">
              {photos.filter(p => !p.isAIGenerated).length}
            </div>
          </Card>
          <Card className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm">
            <div className="text-sm text-slate-600">Used in Posts</div>
            <div className="mt-1 text-2xl font-outfit text-slate-900">
              {photos.reduce((sum, p) => sum + p.usedInPosts, 0)}
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                className={filterType === 'all' ? 'gradient-blue-primary text-white' : 'border-slate-200 text-slate-600'}
              >
                All
              </Button>
              <Button
                variant={filterType === 'ai' ? 'default' : 'outline'}
                onClick={() => setFilterType('ai')}
                className={filterType === 'ai' ? 'gradient-blue-primary text-white' : 'border-slate-200 text-slate-600'}
              >
                AI Generated
              </Button>
              <Button
                variant={filterType === 'uploaded' ? 'default' : 'outline'}
                onClick={() => setFilterType('uploaded')}
                className={filterType === 'uploaded' ? 'gradient-blue-primary text-white' : 'border-slate-200 text-slate-600'}
              >
                Uploaded
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'gradient-blue-primary text-white' : 'border-slate-200 text-slate-600'}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'gradient-blue-primary text-white' : 'border-slate-200 text-slate-600'}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

      {/* Photo Grid */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-slate-200/70 bg-white shadow-sm hover:border-blue-500/60 hover:shadow-md transition-all"
              >
                <img
                  src={photo.url}
                  alt={`Photo ${photo.id}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-between items-start">
                    {photo.isAIGenerated && (
                      <span className="bg-white/15 text-white text-xs px-2 py-1 rounded-full">
                        AI
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photo.id);
                      }}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-white text-xs space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(photo.createdDate)}
                    </div>
                    {photo.usedInPosts > 0 && (
                      <div className="flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        Used in {photo.usedInPosts} post{photo.usedInPosts !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Photo List */}
        {viewMode === 'list' && (
          <div className="space-y-3">
          {filteredPhotos.map((photo) => (
            <div
                key={photo.id}
              >
                <Card
                  onClick={() => setSelectedPhoto(photo)}
                  className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm cursor-pointer hover:border-blue-500/60 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-6">
                    {/* Photo Thumbnail */}
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                    />
                    
                    {/* Photo Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-outfit text-slate-900">{photo.title}</h3>
                            {photo.isAIGenerated && (
                              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                AI
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Created: {formatDate(photo.createdDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ImageIcon className="w-4 h-4" />
                              <span>Used in {photo.usedInPosts} post{photo.usedInPosts !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {photo.tags.map(tag => (
                              <span
                                key={tag}
                                className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhoto(photo.id);
                          }}
                          className="text-slate-500 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
            </div>
            ))}
          </div>
        )}

      {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <Card className="rounded-2xl border border-slate-200/70 bg-white/90 p-10 text-center shadow-sm">
            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No photos found</p>
          </Card>
        )}

      {/* Photo Detail Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden border border-slate-200/70 shadow-xl"
          >
              <button
                type="button"
                aria-label="Close photo details"
                onClick={() => setSelectedPhoto(null)}
                className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-sm transition hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="grid md:grid-cols-2">
                <div className="p-4 md:p-6">
                  <div className="h-full w-full rounded-2xl border border-slate-200 bg-white">
                    <img
                      src={selectedPhoto.url}
                      alt="Selected"
                      className="h-full w-full rounded-xl object-cover"
                    />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-outfit text-slate-900">Photo Details</h3>
                  
                  <div className="space-y-3 text-sm text-slate-600">
                    <div>
                      <span className="text-slate-500">Created:</span>
                      <span className="ml-2 text-slate-900">{formatDate(selectedPhoto.createdDate)}</span>
                    </div>
                    
                    {selectedPhoto.scheduledDate && (
                      <div>
                        <span className="text-slate-500">Scheduled:</span>
                        <span className="ml-2 text-slate-900">{formatDate(selectedPhoto.scheduledDate)}</span>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-slate-500">Type:</span>
                      <span className="ml-2 text-slate-900">
                        {selectedPhoto.isAIGenerated ? 'AI Generated' : 'Uploaded'}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-slate-500">Used in:</span>
                      <span className="ml-2 text-slate-900">
                        {selectedPhoto.usedInPosts} post{selectedPhoto.usedInPosts !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-slate-500">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedPhoto.tags.map(tag => (
                          <span
                            key={tag}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 gradient-blue-primary text-white hover:opacity-90" onClick={handleUseInPost}>
                      Use in Post
                    </Button>
                    <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-slate-900">
                      Download
                    </Button>
                  </div>
                </div>
              </div>
          </div>
          </div>
        )}

      {/* Date Picker Modal */}
        {showDatePicker && (
          <div
            className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDatePicker(false)}
          >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-slate-200/70 shadow-xl"
          >
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-outfit text-slate-900">Schedule Post</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <Label className="text-slate-600">Date:</Label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-slate-600">Time:</Label>
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 gradient-blue-primary text-white hover:opacity-90" onClick={handleSchedulePost}>
                    Schedule
                  </Button>
                  <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-slate-900" onClick={() => setShowDatePicker(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}