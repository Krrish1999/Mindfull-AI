import React from 'react';
import { Calendar, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { PatientSummary } from '../../types';

type PatientListProps = {
  patients: PatientSummary[];
  selectedPatientId?: string;
  onSelectPatient: (patientId: string) => void;
  isLoading: boolean;
};

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  isLoading
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-green-500';
      case 'monitoring': return 'bg-yellow-500';
      case 'crisis': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'stable': return 'Stable';
      case 'monitoring': return 'Monitor';
      case 'crisis': return 'Crisis';
      default: return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-700 h-20 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-400">No patients found</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      {patients.map((patient) => (
        <button
          key={patient.id}
          onClick={() => onSelectPatient(patient.id)}
          className={`w-full p-3 mb-2 rounded-lg text-left transition-all duration-200 ${
            selectedPatientId === patient.id
              ? 'bg-blue-600 shadow-lg'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(patient.status)} mr-2`} />
                <h3 className="text-white font-medium truncate">{patient.full_name}</h3>
                {patient.has_crisis_alert && (
                  <AlertTriangle className="w-4 h-4 text-red-400 ml-2 flex-shrink-0" />
                )}
              </div>
              
              <div className="text-xs text-gray-300 space-y-1">
                <div className="flex items-center">
                  <span className="font-medium">{getStatusText(patient.status)}</span>
                  <span className="mx-1">•</span>
                  <span>Age {patient.age}</span>
                </div>
                
                {patient.next_appointment && (
                  <div className="flex items-center text-blue-300">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{format(new Date(patient.next_appointment), 'MMM d')}</span>
                  </div>
                )}
                
                {patient.last_mood_entry && (
                  <div className="flex items-center text-purple-300">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>Mood: {patient.avg_mood}/5</span>
                  </div>
                )}
                
                {patient.last_activity && (
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatDistanceToNow(new Date(patient.last_activity), { addSuffix: true })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};