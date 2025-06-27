import React, { useState, useEffect } from 'react';
import { 
  User, Calendar, TrendingUp, MessageCircle, AlertTriangle, 
  BookOpen, Activity, Target, Phone, Mail, ChevronRight 
} from 'lucide-react';
import { PatientSummary } from '../../types';
import { useDoctorStore } from '../../store/doctorStore';
import { MoodTrendChart } from './MoodTrendChart';
import { CrisisAlertsPanel } from './CrisisAlertsPanel';
import { PatientMessaging } from './PatientMessaging';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

type PatientProfileProps = {
  patient: PatientSummary;
};

export const PatientProfile: React.FC<PatientProfileProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'messages' | 'insights'>('overview');
  const {
    patientDetails,
    moodData,
    journalEntries,
    crisisEvents,
    fetchPatientDetails,
    fetchPatientMoodData,
    fetchPatientJournal,
    fetchPatientCrisisEvents
  } = useDoctorStore();

  useEffect(() => {
    if (patient.id) {
      fetchPatientDetails(patient.id);
      fetchPatientMoodData(patient.id);
      fetchPatientJournal(patient.id);
      fetchPatientCrisisEvents(patient.id);
    }
  }, [patient.id]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'history', label: 'History', icon: BookOpen },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'insights', label: 'Insights', icon: Activity },
  ] as const;

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Patient Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{patient.full_name}</h1>
              <div className="flex items-center mt-2 space-x-4 text-sm text-gray-400">
                <span>Age {patient.age}</span>
                <span>•</span>
                <span className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    patient.status === 'stable' ? 'bg-green-500' :
                    patient.status === 'monitoring' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                </span>
                {patient.has_crisis_alert && (
                  <>
                    <span>•</span>
                    <span className="flex items-center text-red-400">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Crisis Alert
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center mt-2 space-x-4 text-sm text-gray-400">
                {patientDetails?.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    <span>{patientDetails.email}</span>
                  </div>
                )}
                {patientDetails?.phone_number && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    <span>{patientDetails.phone_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button size="sm" icon={<MessageCircle className="w-4 h-4" />}>
              Send Message
            </Button>
            <Button size="sm" variant="outline" icon={<Calendar className="w-4 h-4" />}>
              Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === id
                  ? 'text-blue-400 border-blue-400 bg-gray-700/50'
                  : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-700/30'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Avg Mood</p>
                      <p className="text-2xl font-bold text-white">{patient.avg_mood}/5</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Journal Entries</p>
                      <p className="text-2xl font-bold text-white">{patient.journal_count}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Engagement</p>
                      <p className="text-2xl font-bold text-white">{patient.engagement_score}%</p>
                    </div>
                    <Activity className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Next Session</p>
                      <p className="text-lg font-bold text-white">
                        {patient.next_appointment ? 'Scheduled' : 'None'}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-teal-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mood Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Mood Trends (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodTrendChart data={moodData} />
              </CardContent>
            </Card>

            {/* Crisis Alerts */}
            {patient.has_crisis_alert && (
              <CrisisAlertsPanel events={crisisEvents} />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Mental Health History */}
            <Card>
              <CardHeader>
                <CardTitle>Mental Health History</CardTitle>
              </CardHeader>
              <CardContent>
                {patientDetails?.bio ? (
                  <p className="text-gray-300">{patientDetails.bio}</p>
                ) : (
                  <p className="text-gray-400 italic">No medical history recorded</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Journal Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Journal Entries</CardTitle>
              </CardHeader>
              <CardContent>
                {journalEntries.length > 0 ? (
                  <div className="space-y-4">
                    {journalEntries.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="border-l-4 border-blue-400 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{entry.title}</h4>
                          <span className="text-sm text-gray-400">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2">{entry.content}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-gray-400">Mood: {entry.mood}/5</span>
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="ml-4 flex flex-wrap gap-1">
                              {entry.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No journal entries found</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'messages' && (
          <PatientMessaging patientId={patient.id} patientName={patient.full_name} />
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Engagement Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">App Usage Frequency</span>
                    <span className="text-white font-medium">{patient.engagement_score}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${patient.engagement_score}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shared Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Treatment Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <Target className="w-5 h-5 text-green-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">Improve Sleep Quality</p>
                        <p className="text-gray-400 text-sm">7-8 hours per night</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-medium">75%</p>
                      <p className="text-gray-400 text-sm">Progress</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <Target className="w-5 h-5 text-yellow-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">Daily Mindfulness</p>
                        <p className="text-gray-400 text-sm">10 minutes daily</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-medium">45%</p>
                      <p className="text-gray-400 text-sm">Progress</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};