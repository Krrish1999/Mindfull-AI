import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useResourceStore } from '../store/resourceStore';
import { format } from 'date-fns';

export const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentResource, fetchResourceById, isLoading, error } = useResourceStore();

  useEffect(() => {
    if (id) {
      fetchResourceById(id);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="animate-pulse max-w-4xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-40 bg-gray-200 rounded-lg mb-6"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      </div>
    );
  }

  if (error || !currentResource) {
    return (
      <div className="max-w-4xl mx-auto text-center py-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {error || "Resource not found"}
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the resource you're looking for.
        </p>
        <Button onClick={() => navigate('/resources')}>
          Browse All Resources
        </Button>
      </div>
    );
  }

  // Default image if none is provided
  const defaultImage = 'https://images.pexels.com/photos/3758105/pexels-photo-3758105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/resources')}
        >
          Back to resources
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="aspect-video">
          <img
            src={currentResource.thumbnail_url || defaultImage}
            alt={currentResource.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {currentResource.category.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700"
              >
                {cat}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {currentResource.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6">
            <div className="flex items-center mr-6 mb-2">
              <User className="w-4 h-4 mr-1" />
              <span>{currentResource.author}</span>
            </div>
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{format(new Date(currentResource.created_at), 'MMMM d, yyyy')}</span>
            </div>
          </div>
          
          <div className="prose max-w-none">
            {currentResource.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Related Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(null).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={`https://images.pexels.com/photos/${3758105 + index * 100}/pexels-photo-${3758105 + index * 100}.jpeg?auto=compress&cs=tinysrgb&w=600`}
                  alt="Related resource"
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-2">
                  Related Wellness Article {index + 1}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  A brief description of this related wellness article that provides additional information on similar topics.
                </p>
                <div className="text-blue-600 text-sm font-medium hover:underline">
                  Read more
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};