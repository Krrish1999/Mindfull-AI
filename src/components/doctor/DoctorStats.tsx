import React from 'react';
import { Users, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

type DoctorStatsProps = {
  stats: {
    total_patients: number;
    active_patients: number;
    upcoming_appointments: number;
    avg_patient_engagement: number;
  };
  crisisCount: number;
};

export const DoctorStats: React.FC<DoctorStatsProps> = ({ stats, crisisCount }) => {
  const statCards = [
    {
      title: 'Total Patients',
      value: stats.total_patients,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20'
    },
    {
      title: 'Active This Week',
      value: stats.active_patients,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20'
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcoming_appointments,
      icon: Calendar,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20'
    },
    {
      title: 'Crisis Alerts',
      value: crisisCount,
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-600/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card className="md:col-span-2 lg:col-span-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Average Patient Engagement</p>
              <p className="text-3xl font-bold text-white">{stats.avg_patient_engagement}%</p>
              <p className="text-sm text-green-400 mt-1">+5% from last week</p>
            </div>
            <div className="w-24 h-24">
              <div className="relative w-full h-full">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#374151"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#3B82F6"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.avg_patient_engagement / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{stats.avg_patient_engagement}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};