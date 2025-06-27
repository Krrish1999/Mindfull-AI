import React, { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import { AIChatMessage } from '../../types';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';

type AIChatMessageListProps = {
  messages: AIChatMessage[];
  isLoading?: boolean;
};

export const AIChatMessageList: React.FC<AIChatMessageListProps> = ({ 
  messages, 
  isLoading = false 
}) => {
  const endRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessageTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="p-4 rounded-full bg-blue-600/20 text-blue-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Bot className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Welcome to your AI Companion</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            I'm here to listen and provide support. Feel free to share what's on your mind, 
            ask questions about mental health, or just have a conversation. How are you feeling today?
          </p>
        </div>
      )}

      {messages.map((message) => (
        <div key={message.id} className="flex flex-col">
          {message.sender === 'ai' ? (
            // AI messages on the left
            <div className="flex items-start space-x-3">
              {/* AI Avatar */}
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              
              {/* AI Message */}
              <div className="flex flex-col flex-1">
                <div className="text-gray-300 text-sm font-medium mb-1">
                  AI Assistant
                </div>
                
                {/* AI Message Bubble */}
                <div className="bg-gray-700 text-white rounded-2xl rounded-tl-md px-4 py-3 max-w-md">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ) : (
            // User messages on the right
            <div className="flex items-start justify-end space-x-3">
              {/* User Message */}
              <div className="flex flex-col flex-1 items-end">
                <div className="text-gray-300 text-sm font-medium mb-1">
                  {user?.full_name || 'You'}
                </div>
                
                <div className="bg-purple-600 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-md">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
              
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.full_name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getUserInitials(user?.full_name || 'User')
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        // AI typing indicator on the left
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          
          <div className="flex flex-col flex-1">
            <div className="text-gray-300 text-sm font-medium mb-1">
              AI Assistant
            </div>
            
            <div className="bg-gray-700 text-white rounded-2xl rounded-tl-md px-4 py-3 max-w-md">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-white/80">AI is typing...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
};