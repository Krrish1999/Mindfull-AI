import React, { useEffect, useState } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ResourceCard } from '../components/resources/ResourceCard';
import { useResourceStore } from '../store/resourceStore';

export const ResourcesPage: React.FC = () => {
  const { resources, categories, fetchResources, fetchCategories, searchResources, isLoading } = useResourceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchResources();
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchResources(searchTerm, selectedCategory || undefined);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    fetchResources();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Wellness Resources</h1>
        <p className="text-gray-600">Explore articles, guides, and tools to support your mental health</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
              <div className="flex-1">
                <Input
                  placeholder="Search resources..."
                  icon={<Search className="w-5 h-5" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
              </div>
              <Button
                type="button"
                variant="outline"
                icon={<Filter className="w-4 h-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters {selectedCategory && '(1)'}
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Search
              </Button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {(searchTerm || selectedCategory) && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-40 rounded-t-lg"></div>
              <div className="bg-white rounded-b-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="flex justify-between mt-4">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : resources.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No resources found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We couldn't find any resources matching your search criteria. Try adjusting your filters or search term.
          </p>
        </div>
      )}
    </div>
  );
};