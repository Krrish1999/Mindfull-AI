import React from 'react';
import { AlertTriangle, Clock, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

type CrisisEvent = {
  id: string;
  detected_at: string;
  severity_level: 'high' | 'medium' | 'low';
  trigger_keywords: string[];
  user_response?: string;
};

type CrisisAlertsPanelProps = {
  events: CrisisEvent[];
};

export const CrisisAlertsPanel: React.FC<CrisisAlertsPanelProps> = ({ events }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-600/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-600/30';
      case 'low': return 'text-blue-400 bg-blue-900/20 border-blue-600/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-600/30';
    }
  };

  const getResponseStatus = (response?: string) => {
    if (!response) return { text: 'No Response', color: 'text-gray-400' };
    
    switch (response) {
      case 'contacted_help': return { text: 'Contacted Help', color: 'text-green-400' };
      case 'dismissed': return { text: 'Dismissed', color: 'text-yellow-400' };
      case 'saved_resources': return { text: 'Saved Resources', color: 'text-blue-400' };
      default: return { text: response, color: 'text-gray-400' };
    }
  };

  return (
    <Card className="border-red-600/30">
      <CardHeader>
        <CardTitle className="flex items-center text-red-400">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Crisis Alerts ({events.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => {
              const severityStyles = getSeverityColor(event.severity_level);
              const responseStatus = getResponseStatus(event.user_response);
              
              return (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border ${severityStyles}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="font-medium capitalize">
                          {event.severity_level} Severity Crisis
                        </span>
                        <span className="mx-2">•</span>
                        <div className="flex items-center text-sm">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(event.detected_at), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm mb-2">Triggered Keywords:</p>
                        <div className="flex flex-wrap gap-1">
                          {event.trigger_keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <span className="text-gray-400 mr-2">Patient Response:</span>
                          <span className={responseStatus.color}>{responseStatus.text}</span>
                        </div>
                        
                        <Button size="sm" variant="outline" icon={<Eye className="w-3 h-3" />}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No crisis alerts</p>
            <p className="text-gray-500 text-sm">This patient has no recent crisis events</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};