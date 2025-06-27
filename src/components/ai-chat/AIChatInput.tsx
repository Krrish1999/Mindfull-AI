import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

type AIChatInputProps = {
  onSend: (message: string) => void;
  isLoading?: boolean;
};

export const AIChatInput: React.FC<AIChatInputProps> = ({ onSend, isLoading = false }) => {
  const [message, setMessage] = useState('');
  const { user } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
    <div className="border-t border-gray-800 p-6">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
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
        
        {/* Input Container */}
        <div className="flex-1 flex items-center space-x-3 bg-gray-800 rounded-2xl px-4 py-3 border border-gray-700">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
          />
          
          <button
            type="button"
            className="text-gray-400 hover:text-gray-300 transition-colors p-1"
            disabled={isLoading}
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>
        
        {/* Send Button */}
        <Button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200"
          isLoading={isLoading}
        >
          Send
        </Button>
      </form>
    </div>
  );
};