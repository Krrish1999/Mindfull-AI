import React from 'react';
import { Star, Calendar } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { TherapistProfile } from '../../types';
import { Link } from 'react-router-dom';
import { formatPriceFromDollars } from '../../lib/stripe';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

type TherapistCardProps = {
  therapist: TherapistProfile;
};

type TherapistService = {
  id: string;
  name: string;
  price_amount: number;
  type: string;
};

export const TherapistCard: React.FC<TherapistCardProps> = ({ therapist }) => {
  const [services, setServices] = useState<TherapistService[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('therapist_services')
          .select('id, name, price_amount, type')
          .eq('therapist_profile_id', therapist.id)
          .eq('is_active', true)
          .order('price_amount', { ascending: true })
          .limit(1);

        if (!error && data) {
          setServices(data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [therapist.id]);

  const lowestPriceService = services[0];

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <img
              className="h-16 w-16 rounded-full object-cover"
              src={therapist.user_id ? `https://randomuser.me/api/portraits/men/${parseInt(therapist.id) % 100}.jpg` : 'https://via.placeholder.com/150'}
              alt={`Dr. ${therapist.user_id}`}
            />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-100">Dr. {therapist.user_id}</h3>
            <div className="flex items-center mt-1">
              <div className="flex items-center text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill={i < therapist.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-100">{therapist.rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-100 mt-1">{therapist.experience_years} years of experience</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex flex-wrap gap-1 mb-3">
            {therapist.specialization.map((spec) => (
              <span key={spec} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {spec}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-100 line-clamp-3 mb-4">
            {therapist.description || "A compassionate therapist dedicated to helping clients achieve better mental health through evidence-based techniques and personalized care."}
          </p>
          {isLoading ? (
            <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
          ) : lowestPriceService ? (
            <p className="text-sm text-gray-100 font-medium">
              From {formatPriceFromDollars(lowestPriceService.price_amount)}/session
            </p>
          ) : (
            <p className="text-sm text-gray-100 font-medium">
              ${therapist.rate_per_hour}/hour
            </p>
          )}
        </div>
        
        <div className="mt-auto pt-4 flex space-x-3">
          <Link to={`/therapists/${therapist.id}`} className="flex-1">
            <Button fullWidth variant="outline">
              View Profile
            </Button>
          </Link>
          <Link 
            to={lowestPriceService ? `/book/${therapist.id}/${lowestPriceService.id}` : `/therapists/${therapist.id}`} 
            className="flex-1"
          >
            <Button fullWidth icon={<Calendar className="w-4 h-4" />}>
            Book Session
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};