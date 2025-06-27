import React from 'react';
import { Shield, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';

type ConsentModalProps = {
  onConsentGiven: (consent: boolean) => void;
};

export const ConsentModal: React.FC<ConsentModalProps> = ({ onConsentGiven }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-dark-lg max-w-md w-full p-6 border border-gray-700">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-full bg-blue-600 text-white mr-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Chat History Settings</h2>
        </div>
        
        <p className="text-gray-300 mb-6">
          Do you want to save chat history for future reference? This helps us provide better support and allows you to review past conversations.
        </p>
        
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-white mb-2">Privacy Notice</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Your conversations are encrypted and secure</li>
            <li>• Only you can access your chat history</li>
            <li>• You can change this setting later in your profile</li>
            <li>• Data is never shared with third parties</li>
          </ul>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={() => onConsentGiven(true)}
            className="flex-1"
            icon={<Check className="w-4 h-4" />}
          >
            Yes, Save History
          </Button>
          <Button
            onClick={() => onConsentGiven(false)}
            variant="outline"
            className="flex-1"
            icon={<X className="w-4 h-4" />}
          >
            No, Don't Save
          </Button>
        </div>
        
        <p className="text-xs text-gray-400 text-center mt-4">
          You can change this preference anytime in your account settings.
        </p>
      </div>
    </div>
  );
};