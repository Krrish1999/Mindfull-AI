import React from 'react';
import { MessageCircle, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-white text-2xl font-bold tracking-tight mb-6">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <Link to="/ai-chat">
          <Button
            variant="primary"
            className="font-semibold text-sm tracking-wide px-6 py-3 flex items-center bg-blue-600 text-white rounded-xl"
            icon={<MessageCircle className="w-4 h-4" />}
          >
            Chat with AI Companion
          </Button>
        </Link>
        <Link to="/journal/new">
          <Button
            variant="secondary"
            className="font-semibold text-sm tracking-wide flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl"
            icon={<BookOpen className="w-4 h-4" />}
          >
            New Journal Entry
          </Button>
        </Link>
        <Link to="/resources">
          <Button
            variant="accent"
            className="font-semibold text-sm tracking-wide flex items-center bg-blue-600 text-white  px-6 py-3 rounded-xl"
          >
            Access Resources
          </Button>
        </Link>
      </div>
    </div>
  );
};