import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  TrendingUp, 
  Image as ImageIcon, 
  Type,
  Save,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image' | 'caption';
  imageUrl?: string;
}

type AIMode = 'trend' | 'image' | 'caption';

export function AIGenerationPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI content assistant. I can help you discover trends, generate images, and optimize captions. How can I help you today?",
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [aiMode, setAIMode] = useState<AIMode>('trend');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse: Message;

      if (aiMode === 'trend') {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Based on current trends, here are some insights:\n\n• Short-form video content is performing 3x better than static posts\n• User-generated content drives 2x more engagement\n• Behind-the-scenes content shows 150% higher reach\n\nWould you like me to generate content based on these trends?`,
          type: 'text'
        };
      } else if (aiMode === 'image') {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I\'ve generated an image based on your description. You can save this to your photo storage or use it in a post.',
          type: 'image',
          imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop'
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `📱 Optimized Caption:\n\n"Transform your business with cutting-edge solutions! ✨\n\nDiscover how our platform helps you:\n💡 Streamline your workflow\n🚀 Boost productivity by 200%\n🎯 Reach your target audience\n\nReady to level up? Link in bio! 👆\n\n#BusinessGrowth #Innovation #ProductivityHacks #DigitalTransformation"`,
          type: 'caption'
        };
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveContent = (message: Message) => {
    // In production, this would save to Photo Storage or create a draft post
    alert('Content saved to your library!');
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
          {/* Avatar */}
          <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isUser
                  ? 'bg-primary text-white'
                  : 'gradient-blue-accent text-white'
              }`}
            >
              {isUser ? 'U' : <Sparkles className="w-4 h-4" />}
            </div>

            {/* Message Content */}
            <div
              className={`rounded-2xl p-4 ${
                isUser
                  ? 'bg-primary text-white'
                  : 'bg-card border border-border'
              }`}
            >
              {message.type === 'image' && message.imageUrl && (
                <div className="mb-3">
                  <img
                    src={message.imageUrl}
                    alt="AI Generated"
                    className="rounded-lg w-full max-w-sm"
                  />
                </div>
              )}

              <p className="text-sm whitespace-pre-wrap">{message.content}</p>

              {/* Action Buttons for AI responses */}
              {!isUser && message.type !== 'text' && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSaveContent(message)}
                    className="text-xs"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col">
      {/* Header with Mode Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">AI Generation</h2>
            <p className="text-muted-foreground mt-1">Create content with AI-powered tools</p>
          </div>
        </div>

        <Tabs value={aiMode} onValueChange={(value) => setAIMode(value as AIMode)}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="trend" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="caption" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Captions
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.map(renderMessage)}
          
          {/* Typing Indicator */}
          {isGenerating && (
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full gradient-blue-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              className="flex-shrink-0"
            >
              <Upload className="w-4 h-4" />
            </Button>

            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                aiMode === 'trend'
                  ? 'Ask about trending topics...'
                  : aiMode === 'image'
                  ? 'Describe the image you want to generate...'
                  : 'Paste your caption or describe your content...'
              }
              className="min-h-[60px] max-h-32 resize-none bg-input-background"
            />

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isGenerating}
              className="gradient-blue-primary text-white hover:opacity-90 flex-shrink-0 self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            <span>
              {aiMode === 'trend' && 'Discover what\'s trending in your industry'}
              {aiMode === 'image' && 'Generate custom images for your posts'}
              {aiMode === 'caption' && 'Optimize your captions for maximum engagement'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
