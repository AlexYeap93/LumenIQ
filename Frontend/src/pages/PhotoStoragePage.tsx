import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, Filter, Calendar, Image as ImageIcon, Trash2, Grid, List } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Photo Storage</h2>
          <p className="text-muted-foreground mt-1">Manage your media library</p>
        </div>
        <Button className="gradient-blue-primary text-white hover:opacity-90">
          <Upload className="w-4 h-4 mr-2" />
          Upload Photos
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Images</div>
          <div className="text-2xl font-semibold text-foreground mt-1">{photos.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">AI Generated</div>
          <div className="text-2xl font-semibold text-primary mt-1">
            {photos.filter(p => p.isAIGenerated).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Uploaded</div>
          <div className="text-2xl font-semibold text-foreground mt-1">
            {photos.filter(p => !p.isAIGenerated).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Used in Posts</div>
          <div className="text-2xl font-semibold text-foreground mt-1">
            {photos.reduce((sum, p) => sum + p.usedInPosts, 0)}
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input-background"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterType('all')}
            className={filterType === 'all' ? 'gradient-blue-primary text-white' : ''}
          >
            All
          </Button>
          <Button
            variant={filterType === 'ai' ? 'default' : 'outline'}
            onClick={() => setFilterType('ai')}
            className={filterType === 'ai' ? 'gradient-blue-primary text-white' : ''}
          >
            AI Generated
          </Button>
          <Button
            variant={filterType === 'uploaded' ? 'default' : 'outline'}
            onClick={() => setFilterType('uploaded')}
            className={filterType === 'uploaded' ? 'gradient-blue-primary text-white' : ''}
          >
            Uploaded
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'gradient-blue-primary text-white' : ''}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'gradient-blue-primary text-white' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Photo Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all"
            >
              <img
                src={photo.url}
                alt={`Photo ${photo.id}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-between items-start">
                  {photo.isAIGenerated && (
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                      AI
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePhoto(photo.id);
                    }}
                    className="text-white hover:text-destructive transition-colors"
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
            </motion.div>
          ))}
        </div>
      )}

      {/* Photo List */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                onClick={() => setSelectedPhoto(photo)}
                className="p-4 cursor-pointer hover:border-primary transition-all"
              >
                <div className="flex items-center gap-6">
                  {/* Photo Thumbnail */}
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                  
                  {/* Photo Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{photo.title}</h3>
                          {photo.isAIGenerated && (
                            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                              AI
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                              className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs"
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
                        className="text-muted-foreground hover:text-destructive transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No photos found</p>
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl max-w-4xl w-full overflow-hidden"
          >
            <div className="grid md:grid-cols-2">
              <img
                src={selectedPhoto.url}
                alt="Selected"
                className="w-full h-full object-cover"
              />
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Photo Details</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <span className="ml-2 text-foreground">{formatDate(selectedPhoto.createdDate)}</span>
                  </div>
                  
                  {selectedPhoto.scheduledDate && (
                    <div>
                      <span className="text-muted-foreground">Scheduled:</span>
                      <span className="ml-2 text-foreground">{formatDate(selectedPhoto.scheduledDate)}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 text-foreground">
                      {selectedPhoto.isAIGenerated ? 'AI Generated' : 'Uploaded'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Used in:</span>
                    <span className="ml-2 text-foreground">
                      {selectedPhoto.usedInPosts} post{selectedPhoto.usedInPosts !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedPhoto.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1" onClick={handleUseInPost}>
                    Use in Post
                  </Button>
                  <Button variant="outline">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDatePicker(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl max-w-4xl w-full overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Schedule Post</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <Label>Date:</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label>Time:</Label>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={handleSchedulePost}>
                  Schedule
                </Button>
                <Button variant="outline" onClick={() => setShowDatePicker(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}