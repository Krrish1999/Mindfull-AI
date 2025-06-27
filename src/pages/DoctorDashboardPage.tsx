import React, { useEffect, useState } from 'react';
import { Search, Filter, AlertTriangle, TrendingUp, Calendar, MessageCircle } from 'lucide-react';
import { useDoctorStore } from '../store/doctorStore';
import { useAuthStore } from '../store/authStore';
import { PatientList } from '../components/doctor/PatientList';
import { PatientProfile } from '../components/doctor/PatientProfile';
import { DoctorStats } from '../components/doctor/DoctorStats';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const DoctorDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    patients,
    selectedPatient,
    crisisAlerts,
    stats,
    isLoading,
    fetchPatients,
    fetchCrisisAlerts,
    fetchDoctorStats,
    selectPatient
  } = useDoctorStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'stable' | 'monitoring' | 'crisis'>('all');

  useEffect(() => {
    if (user) {
      fetchPatients(user.id);
      fetchCrisisAlerts(user.id);
      fetchDoctorStats(user.id);
    }
  }, [user]);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* Left Sidebar - Patient List */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Patients</h1>
            <div className="flex items-center space-x-2">
              {crisisAlerts.length > 0 && (
                <div className="flex items-center text-red-400">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{crisisAlerts.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="mb-3">
            <Input
              placeholder="Search patients..."
              icon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>

          {/* Status Filter */}
          <div className="flex space-x-1">
            {(['all', 'stable', 'monitoring', 'crisis'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Patient List */}
        <div className="flex-1 overflow-y-auto">
          <PatientList
            patients={filteredPatients}
            selectedPatientId={selectedPatient?.id}
            onSelectPatient={selectPatient}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedPatient ? (
          <PatientProfile patient={selectedPatient} />
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Welcome Header */}
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome, Dr. {user.full_name}
              </h2>
              <p className="text-gray-400">
                Your patient dashboard - select a patient from the sidebar to view their profile
              </p>
            </div>

            {/* Dashboard Stats */}
            <div className="p-6">
              <DoctorStats stats={stats} crisisCount={crisisAlerts.length} />
            </div>

            {/* Recent Activity */}
            <div className="flex-1 p-6 pt-0">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Recent Activity
                </h3>
                
                {crisisAlerts.length > 0 ? (
                  <div className="space-y-3">
                    {crisisAlerts.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-3 bg-red-900/20 border border-red-700 rounded-lg"
                      >
                        <div className="flex items-center">
                          <AlertTriangle className="w-4 h-4 text-red-400 mr-3" />
                          <div>
                            <p className="text-white font-medium">{alert.patient_name}</p>
                            <p className="text-red-300 text-sm">
                              Crisis detected - {alert.severity_level} severity
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">
                            {new Date(alert.detected_at).toLocaleDateString()}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => selectPatient(alert.user_id)}
                            className="mt-1"
                          >
                            View Patient
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No recent crisis alerts</p>
                    <p className="text-gray-500 text-sm">Your patients are doing well</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};