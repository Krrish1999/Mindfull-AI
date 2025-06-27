import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bot, AlertTriangle, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AIChatMessageList } from '../components/ai-chat/AIChatMessageList';
import { AIChatInput } from '../components/ai-chat/AIChatInput';
import { ConsentModal } from '../components/ai-chat/ConsentModal';
import { CrisisInterventionModal } from '../components/ai-chat/CrisisInterventionModal';
import { CallMeButton } from '../components/call/CallMeButton';
import { useAIChatStore } from '../store/aiChatStore';
import { useCrisisStore } from '../store/crisisStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const AIChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'call'>('chat');
  const {
    messages,
    isLoading,
    error,
    consentGiven,
    init,
    setConsent,
    sendMessage,
    fetchChatHistory,
    clearError,
  } = useAIChatStore();

  const {
    isModalOpen: isCrisisModalOpen,
    currentDetection,
    closeModal: closeCrisisModal,
    logUserResponse,
  } = useCrisisStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (user && consentGiven === true) {
      fetchChatHistory(user.id);
    }
  }, [user, consentGiven, fetchChatHistory]);

  const handleConsentGiven = (consent: boolean) => {
    setConsent(consent);
    if (consent && user) {
      fetchChatHistory(user.id);
    }
  };

  const handleSendMessage = (messageContent: string) => {
    if (user) {
      sendMessage(user.id, messageContent);
    }
  };

  const handleCrisisResponse = async (response: 'contacted_help' | 'dismissed' | 'saved_resources') => {
    if (user) {
      await logUserResponse(user.id, response);
    }
    
    if (response === 'contacted_help') {
      closeCrisisModal();
    } else if (response === 'dismissed') {
      closeCrisisModal();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

      {/* Main Chat Interface */}
      <div className="bg-gray-900 rounded-lg h-full flex flex-col border border-gray-800">
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

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border-b border-red-700 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="text-red-400 w-5 h-5 mr-2" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="text-red-300 hover:text-red-200"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'chat' ? (
          <>
            <AIChatMessageList messages={messages} isLoading={isLoading} />
            <AIChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="p-4 rounded-full bg-green-600/20 text-green-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Voice Call with AI Coach</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Connect with your AI mindfulness coach through a phone call for a more personal experience.
              </p>
              <CallMeButton />
            </div>
          </div>
        )}
      </div>

      {/* Consent Modal */}
      {consentGiven === null && (
        <ConsentModal onConsentGiven={handleConsentGiven} />
      )}

      {/* Crisis Intervention Modal */}
      <CrisisInterventionModal
        isOpen={isCrisisModalOpen}
        onClose={closeCrisisModal}
        onResponse={handleCrisisResponse}
        severityLevel={currentDetection?.level || 'low'}
      />
    </div>
  );
};