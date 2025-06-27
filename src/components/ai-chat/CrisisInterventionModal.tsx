import React, { useState } from 'react';
import { AlertTriangle, Phone, MessageCircle, X, Shield, Heart } from 'lucide-react';
import { Button } from '../ui/Button';

type CrisisInterventionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onResponse: (response: 'contacted_help' | 'dismissed' | 'saved_resources') => void;
  severityLevel: 'high' | 'medium' | 'low';
};

export const CrisisInterventionModal: React.FC<CrisisInterventionModalProps> = ({
  isOpen,
  onClose,
  onResponse,
  severityLevel
}) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsClosing(true);
    onResponse('dismissed');
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleContactHelp = () => {
    onResponse('contacted_help');
    onClose();
  };

  const handleSaveResources = () => {
    onResponse('saved_resources');
    // Keep modal open so user can still access resources
  };

  const getModalConfig = () => {
    switch (severityLevel) {
      case 'high':
        return {
          title: 'Immediate Support Available',
          message: 'It sounds like you\'re going through an incredibly difficult time. You don\'t have to face this alone.',
          urgency: 'high',
          bgColor: 'bg-red-900/10',
          borderColor: 'border-red-600/30',
          iconColor: 'text-red-400'
        };
      case 'medium':
        return {
          title: 'Support Resources',
          message: 'I notice you might be struggling. There are people who want to help and support you.',
          urgency: 'medium',
          bgColor: 'bg-yellow-900/10',
          borderColor: 'border-yellow-600/30',
          iconColor: 'text-yellow-400'
        };
      default:
        return {
          title: 'Mental Health Resources',
          message: 'If you\'re experiencing emotional distress, these resources can provide support.',
          urgency: 'low',
          bgColor: 'bg-blue-900/10',
          borderColor: 'border-blue-600/30',
          iconColor: 'text-blue-400'
        };
    }
  };

  const config = getModalConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div
        className={`bg-gray-800 rounded-lg shadow-dark-lg max-w-lg w-full border ${config.borderColor} ${config.bgColor} ${
          isClosing ? 'animate-pulse' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center">
            <div className={`p-2 rounded-full bg-gray-700 ${config.iconColor} mr-3`}>
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">{config.title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start mb-6">
            <Heart className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300 leading-relaxed">{config.message}</p>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Crisis Support Numbers
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-600/30 rounded">
                <div>
                  <p className="text-white font-medium">National Suicide Prevention Lifeline</p>
                  <p className="text-gray-400 text-sm">24/7 emotional support</p>
                </div>
                <a 
                  href="tel:988" 
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-medium transition-colors"
                  onClick={() => onResponse('contacted_help')}
                >
                  Call 988
                </a>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-600/30 rounded">
                <div>
                  <p className="text-white font-medium">Crisis Text Line</p>
                  <p className="text-gray-400 text-sm">Text support available</p>
                </div>
                <a 
                  href="sms:741741" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium transition-colors"
                  onClick={() => onResponse('contacted_help')}
                >
                  Text HOME
                </a>
              </div>

              {severityLevel === 'high' && (
                <div className="flex items-center justify-between p-2 bg-red-900/20 rounded border border-red-600/30">
                  <div>
                    <p className="text-white font-medium">Emergency Services</p>
                    <p className="text-red-300 text-sm">For immediate danger</p>
                  </div>
                  <a 
                    href="tel:911" 
                    className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded font-medium transition-colors"
                    onClick={() => onResponse('contacted_help')}
                  >
                    Call 911
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleContactHelp}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              icon={<MessageCircle className="w-4 h-4" />}
            >
              Connect with Professional
            </Button>
            
            <Button
              onClick={handleSaveResources}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Save Resources
            </Button>
          </div>

          {/* Additional Support Info */}
          <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-600/30">
            <p className="text-sm text-blue-300 flex items-start">
              <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              Your safety and wellbeing matter. Professional counselors are available 24/7 and conversations are confidential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};