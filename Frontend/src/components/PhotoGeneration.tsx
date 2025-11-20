import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Send, Download, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

interface PhotoGenerationProps {
  onSaveImage: (imageUrl: string, prompt: string) => void;
}

export function PhotoGeneration({ onSaveImage }: PhotoGenerationProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI image generation assistant. Describe the image you'd like to create for your social media post, and I'll help you generate it!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateImage = async (prompt: string) => {
    // Simulate AI image generation with relevant Unsplash images
    const keywords = prompt.toLowerCase();
    let searchQuery = 'social media marketing';
    
    if (keywords.includes('beach') || keywords.includes('summer')) {
      searchQuery = 'beach summer';
    } else if (keywords.includes('food') || keywords.includes('restaurant')) {
      searchQuery = 'food photography';
    } else if (keywords.includes('fashion') || keywords.includes('clothes')) {
      searchQuery = 'fashion style';
    } else if (keywords.includes('fitness') || keywords.includes('gym')) {
      searchQuery = 'fitness workout';
    } else if (keywords.includes('travel') || keywords.includes('vacation')) {
      searchQuery = 'travel adventure';
    } else if (keywords.includes('product') || keywords.includes('ecommerce')) {
      searchQuery = 'product photography';
    } else if (keywords.includes('autumn') || keywords.includes('fall')) {
      searchQuery = 'autumn colors';
    }

    // In a real app, this would call an AI image generation API
    // For now, we'll use a placeholder
    return `https://source.unsplash.com/800x600/?${searchQuery.replace(' ', ',')}`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    // Simulate AI processing delay
    setTimeout(async () => {
      const imageUrl = await generateImage(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I've generated an image based on your prompt: "${input}". You can save it to your storage or download it!`,
        imageUrl,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveImage = (imageUrl: string, prompt: string) => {
    onSaveImage(imageUrl, prompt);
    toast.success('Image saved to storage!');
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen">
      <div className="p-8 border-b border-gray-200">
        <h2 className="text-gray-900 mb-2">AI Photo Generation</h2>
        <p className="text-gray-600">Create and optimize images for your social media posts</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-2xl ${message.type === 'user' ? 'w-auto' : 'w-full'}`}>
              <Card
                className={`p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50'
                }`}
              >
                <p className={message.type === 'user' ? 'text-white' : 'text-gray-900'}>
                  {message.content}
                </p>
                
                {message.imageUrl && (
                  <div className="mt-4 space-y-3">
                    <ImageWithFallback
                      src={message.imageUrl}
                      alt="Generated"
                      className="w-full rounded-lg"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSaveImage(message.imageUrl!, message.content)}
                        className="flex-1"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save to Storage
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(message.imageUrl!)}
                        className="flex-1"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
              <p className="text-xs text-gray-500 mt-1 px-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <Card className="p-4 bg-gray-50 max-w-2xl">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <p className="text-gray-600">Generating your image...</p>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the image you want to generate..."
            disabled={isGenerating}
          />
          <Button onClick={handleSend} disabled={isGenerating || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
