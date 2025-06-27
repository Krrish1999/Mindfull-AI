import React, { useState, useEffect } from 'react';
import { Send, Paperclip, Phone, Video } from 'lucide-react';
import { useDoctorStore } from '../../store/doctorStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

type PatientMessagingProps = {
  patientId: string;
  patientName: string;
};

export const PatientMessaging: React.FC<PatientMessagingProps> = ({
  patientId,
  patientName
}) => {
  const { user } = useAuthStore();
  const { patientMessages, fetchPatientMessages, sendPatientMessage, isLoading } = useDoctorStore();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && patientId) {
      fetchPatientMessages(user.id, patientId);
    }
  }, [user, patientId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    await sendPatientMessage(user.id, patientId, message.trim());
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg border border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Messages with {patientName}</h3>
          <p className="text-sm text-gray-400">Secure healthcare communication</p>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" icon={<Phone className="w-4 h-4" />}>
            Call
          </Button>
          <Button size="sm" variant="outline" icon={<Video className="w-4 h-4" />}>
            Video
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {patientMessages.length > 0 ? (
          patientMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-3 ${
                  msg.sender_id === user?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    msg.sender_id === user?.id ? 'text-blue-200' : 'text-gray-400'
                  }`}
                >
                  {format(new Date(msg.created_at), 'h:mm a')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 mb-2">No messages yet</p>
              <p className="text-gray-500 text-sm">Start a conversation with {patientName}</p>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={2}
              className="w-full resize-none rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>
          
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            icon={<Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </form>
        
        <p className="text-xs text-gray-500 mt-2">
          All communications are encrypted and HIPAA compliant
        </p>
      </div>
    </div>
  );
};