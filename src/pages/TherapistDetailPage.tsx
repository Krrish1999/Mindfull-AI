import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Calendar,
  MapPin,
  Globe,
  BookOpen,
  Clock,
  DollarSign,
  Award,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useTherapistStore } from '../store/therapistStore';

export const TherapistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTherapist, fetchTherapistById, isLoading, error } = useTherapistStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTherapistById(id);
    }
  }, [id]);

  // Mock data for available dates and times
  const availableDates = [
    new Date(Date.now() + 86400000), // tomorrow
    new Date(Date.now() + 2 * 86400000),
    new Date(Date.now() + 3 * 86400000),
    new Date(Date.now() + 4 * 86400000),
    new Date(Date.now() + 5 * 86400000),
  ];

  const availableTimes = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
  ];

  if (isLoading) {
    return (
      <div className="animate-pulse max-w-4xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gray-200 h-64 md:h-auto"></div>
            <div className="p-6 md:p-8 md:w-2/3">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentTherapist) {
    return (
      <div className="max-w-4xl mx-auto text-center py-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {error || "Therapist not found"}
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the therapist you're looking for.
        </p>
        <Button onClick={() => navigate('/therapists')}>
          Browse All Therapists
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/therapists')}
        >
          Back to therapists
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={`https://randomuser.me/api/portraits/men/${parseInt(currentTherapist.id) % 100}.jpg`}
              alt={`Dr. ${currentTherapist.user_id}`}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="p-6 md:p-8 md:w-2/3">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dr. {currentTherapist.user_id}
                </h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5"
                        fill={i < currentTherapist.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {currentTherapist.rating.toFixed(1)} ({Math.floor(Math.random() * 100) + 50} reviews)
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                ${currentTherapist.rate_per_hour}/hr
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {currentTherapist.specialization.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              <p className="text-gray-700 mb-6">
                {currentTherapist.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  <span>{currentTherapist.experience_years} years experience</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  <span>Online Sessions</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Globe className="w-5 h-5 mr-2 text-blue-600" />
                  <span>Languages: English, Spanish</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  <span>Response time: &lt;24 hours</span>
                </div>
              </div>

              <Button fullWidth icon={<Calendar className="w-5 h-5" />}>
                Book a Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">About Dr. {currentTherapist.user_id}</h2>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <p className="text-gray-700 mb-4">
              With over {currentTherapist.experience_years} years of experience, Dr. {currentTherapist.user_id} specializes in 
              {currentTherapist.specialization.join(', ')}. 
              They are committed to creating a safe, supportive environment where clients can explore their challenges and develop effective coping strategies.
            </p>
            <p className="text-gray-700">
              Their therapeutic approach is collaborative and tailored to each individual's unique needs and goals. 
              Dr. {currentTherapist.user_id} believes in empowering clients with the tools and insights needed for lasting positive change.
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">Education & Credentials</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Education</h3>
                <ul className="space-y-2">
                  {currentTherapist.education.map((edu, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Certifications & Licenses</h3>
                <ul className="space-y-2">
                  {currentTherapist.certifications.map((cert, index) => (
                    <li key={index} className="flex items-start">
                      <Award className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Book a Session</h2>
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Select a date</h3>
                <div className="grid grid-cols-5 gap-2">
                  {availableDates.map((date, index) => (
                    <button
                      key={index}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        selectedDate === date.toISOString().split('T')[0]
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                      onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                    >
                      <div className="text-xs uppercase font-medium">
                        {new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)}
                      </div>
                      <div className="font-bold text-lg">
                        {date.getDate()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {selectedDate && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Select a time</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map((time, index) => (
                      <button
                        key={index}
                        className={`p-2 rounded-lg border text-center transition-colors ${
                          selectedTime === time
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Session details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Session type</span>
                    <span className="font-medium">Video consultation</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-200">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">50 minutes</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-200">
                    <span className="text-gray-600">Fee</span>
                    <span className="font-medium">${currentTherapist.rate_per_hour}</span>
                  </div>
                </div>
              </div>
              
              <Button
                fullWidth
                disabled={!selectedDate || !selectedTime}
                icon={<Calendar className="w-5 h-5" />}
              >
                Confirm Booking
              </Button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                You won't be charged until after the session
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};