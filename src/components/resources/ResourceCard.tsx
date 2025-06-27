import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Resource } from '../../types';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { format } from 'date-fns';

type ResourceCardProps = {
  resource: Resource;
};

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const defaultImage = 'https://images.pexels.com/photos/3758105/pexels-photo-3758105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  return (
    <Link to={`/resources/${resource.id}`}>
      <Card className="h-full hover:shadow-dark-lg transition-shadow duration-200 overflow-hidden group">
        <div className="aspect-video overflow-hidden">
          <img
            src={resource.thumbnail_url || defaultImage}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {resource.category.slice(0, 2).map((cat) => (
              <span 
                key={cat} 
                className="px-2 py-1 text-xs rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30"
              >
                {cat}
              </span>
            ))}
            {resource.category.length > 2 && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                +{resource.category.length - 2} more
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2">
            {resource.title}
          </h3>
          
          <p className="text-sm text-gray-300 line-clamp-3 mb-4">
            {resource.content.substring(0, 120)}...
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{resource.author}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{format(new Date(resource.created_at), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};