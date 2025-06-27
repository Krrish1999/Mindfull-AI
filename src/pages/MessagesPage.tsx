import React, { useEffect, useState } from 'react';
import { MessageList } from '../components/messaging/MessageList';
import { MessageInput } from '../components/messaging/MessageInput';
import { ConversationList } from '../components/messaging/ConversationList';
import { useMessageStore } from '../store/messageStore';
import { useAuthStore } from '../store/authStore';
import { Search, UserCircle, Info, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'chat' | 'call'>('chat');
  const { 
    messages, 
    conversations, 
    currentConversation, 
    fetchMessages,
    fetchConversations,
    sendMessage,
    markAsRead,
    setCurrentConversation,
    isLoading 
  } = useMessageStore();
  
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (user) {
      fetchConversations(user.id);
    }
  }, [user]);
  
  useEffect(() => {
    if (user && currentConversation) {
      fetchMessages(user.id, currentConversation);
      
      // Mark unread messages as read
      const unreadMessageIds = messages
        .filter(msg => msg.recipient_id === user.id && !msg.read)
        .map(msg => msg.id);
        
      if (unreadMessageIds.length > 0) {
        markAsRead(unreadMessageIds);
      }
    }
  }, [user, currentConversation, messages.length]);
  
  const handleSendMessage = (content: string) => {
    if (user && currentConversation) {
      sendMessage(user.id, currentConversation, content);
    }
  };
  
  const handleSelectConversation = (partnerId: string) => {
    setCurrentConversation(partnerId);
  };
  
  const filteredConversations = conversations.filter(conversation => 
    conversation.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const currentConversationInfo = conversations.find(
    conv => conv.id === currentConversation
  );

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] min-h-[700px] bg-gray-900">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
            className="mr-4 text-gray-400 hover:text-white"
          >
            Back
          </Button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg h-full flex border border-gray-800">
        {/* Left Sidebar - Conversations */}
        <div className="w-80 border-r border-gray-800 flex flex-col">
          {/* Header with title and tabs */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold text-white mb-6">Patient Communication</h1>
            <div className="flex">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'chat'
                    ? 'text-white border-white'
                    : 'text-gray-400 border-transparent hover:text-gray-300'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab('call')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ml-6 ${
                  activeTab === 'call'
                    ? 'text-white border-white'
                    : 'text-gray-400 border-transparent hover:text-gray-300'
                }`}
              >
                Call
              </button>
            </div>
          </div>

          {activeTab === 'chat' && (
            <>
              {/* Search */}
              <div className="p-4 border-b border-gray-800">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>
              </div>
              
              {/* Conversations List */}
              <div className="overflow-y-auto flex-1">
                {filteredConversations.length > 0 ? (
                  <div className="p-2">
                    {filteredConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => handleSelectConversation(conversation.id)}
                        className={`w-full p-3 mb-2 rounded-lg text-left transition-all duration-200 ${
                          currentConversation === conversation.id
                            ? 'bg-blue-600 shadow-lg'
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium mr-3 flex-shrink-0">
                            {conversation.avatar_url ? (
                              <img
                                src={conversation.avatar_url}
                                alt={conversation.full_name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              getUserInitials(conversation.full_name)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate">
                              {conversation.full_name}
                            </h4>
                            {conversation.lastMessage && (
                              <p className="text-xs text-gray-400 truncate mt-1">
                                {conversation.lastMessage}
                              </p>
                            )}
                          </div>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    No conversations yet
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'call' && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <Info className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-400">Call feature coming soon</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Side - Message Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation && activeTab === 'chat' ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium mr-3">
                  {currentConversationInfo?.avatar_url ? (
                    <img
                      src={currentConversationInfo.avatar_url}
                      alt={currentConversationInfo.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getUserInitials(currentConversationInfo?.full_name || '')
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-white">{currentConversationInfo?.full_name}</h3>
                  <p className="text-sm text-gray-400">Online</p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className="flex flex-col">
                    {message.sender_id === user?.id ? (
                      // User messages on the right
                      <div className="flex items-start justify-end space-x-3">
                        <div className="flex flex-col flex-1 items-end">
                          <div className="text-gray-300 text-sm font-medium mb-1">
                            You
                          </div>
                          <div className="bg-purple-600 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-md">
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                        </div>
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
                    ) : (
                      // Other person's messages on the left
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                          {currentConversationInfo?.avatar_url ? (
                            <img 
                              src={currentConversationInfo.avatar_url} 
                              alt={currentConversationInfo.full_name} 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            getUserInitials(currentConversationInfo?.full_name || 'User')
                          )}
                        </div>
                        <div className="flex flex-col flex-1">
                          <div className="text-gray-300 text-sm font-medium mb-1">
                            {currentConversationInfo?.full_name}
                          </div>
                          <div className="bg-gray-700 text-white rounded-2xl rounded-tl-md px-4 py-3 max-w-md">
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="border-t border-gray-800 p-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const content = formData.get('message') as string;
                  if (content.trim()) {
                    handleSendMessage(content.trim());
                    (e.target as HTMLFormElement).reset();
                  }
                }} className="flex items-end space-x-3">
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
                  
                  <div className="flex-1 flex items-center space-x-3 bg-gray-800 rounded-2xl px-4 py-3 border border-gray-700">
                    <input
                      name="message"
                      type="text"
                      placeholder="Type a message"
                      disabled={isLoading}
                      className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200"
                    isLoading={isLoading}
                  >
                    Send
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6 max-w-md">
                <UserCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Select a conversation</h3>
                <p className="text-gray-400 mb-6">
                  Choose a conversation from the sidebar to start messaging.
                </p>
                
                <div className="bg-blue-900/20 rounded-lg p-4 flex items-start text-left border border-blue-600/30">
                  <Info className="text-blue-400 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-300">
                      All messages are private and secure. Your conversations are encrypted and never shared with third parties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};