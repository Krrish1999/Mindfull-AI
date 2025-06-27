import React, { useEffect, useState } from 'react';
import { Search, BookOpen, Video, Dumbbell, Users, Heart, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useResourceStore } from '../store/resourceStore';

// Mock data for demonstration
const featuredResources = [
  {
    id: '1',
    title: 'Understanding Anxiety',
    description: 'Learn about the causes and symptoms of anxiety.',
    category: 'Articles',
    image: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxtZW50YWwlMjBoZWFsdGh8ZW58MHx8fHwxNzUxMDQzMTEwfDA&ixlib=rb-4.1.0&q=85'
  },
  {
    id: '2',
    title: 'Coping with Stress',
    description: 'Effective strategies for managing stress in daily life.',
    category: 'Articles',
    image: 'https://images.unsplash.com/photo-1471520201477-47a62a269a87?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxtaW5kZnVsbmVzc3xlbnwwfHx8fDE3NTEwNDMxMjV8MA&ixlib=rb-4.1.0&q=85'
  },
  {
    id: '3',
    title: 'Building Resilience',
    description: 'Develop your ability to bounce back from challenges.',
    category: 'Articles',
    image: 'https://images.unsplash.com/photo-1562751362-404243c2eea3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzc3xlbnwwfHx8fDE3NTEwNDMxMTh8MA&ixlib=rb-4.1.0&q=85'
  }
];

const latestResources = [
  {
    id: '4',
    title: 'The Power of Mindfulness',
    description: 'Explore how mindfulness can improve your mental well-being.',
    type: 'Article',
    image: 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxtaW5kZnVsbmVzc3xlbnwwfHx8fDE3NTEwNDMxMjV8MA&ixlib=rb-4.1.0&q=85',
    buttonText: 'Read More'
  },
  {
    id: '5',
    title: 'Guided Meditation for Relaxation',
    description: 'A 10-minute guided meditation to help you relax and de-stress.',
    type: 'Video',
    image: 'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHxtaW5kZnVsbmVzc3xlbnwwfHx8fDE3NTEwNDMxMjV8MA&ixlib=rb-4.1.0&q=85',
    buttonText: 'Watch Now'
  },
  {
    id: '6',
    title: 'Breathing Exercise for Anxiety',
    description: 'A simple breathing exercise to help manage anxiety symptoms.',
    type: 'Exercise',
    image: 'https://images.pexels.com/photos/289586/pexels-photo-289586.jpeg',
    buttonText: 'Try It Out'
  }
];

const categories = [
  { name: 'Articles', icon: BookOpen, color: 'bg-blue-600/10 text-blue-400 border-blue-600/30' },
  { name: 'Videos', icon: Video, color: 'bg-purple-600/10 text-purple-400 border-purple-600/30' },
  { name: 'Exercises', icon: Dumbbell, color: 'bg-green-600/10 text-green-400 border-green-600/30' },
  { name: 'Community', icon: Users, color: 'bg-orange-600/10 text-orange-400 border-orange-600/30' },
  { name: 'Self-Care', icon: Heart, color: 'bg-pink-600/10 text-pink-400 border-pink-600/30' },
  { name: 'Nature', icon: Leaf, color: 'bg-teal-600/10 text-teal-400 border-teal-600/30' }
];

export const ResourcesPage: React.FC = () => {
  const { resources, fetchResources, searchResources, isLoading } = useResourceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredResources, setFilteredResources] = useState(latestResources);

  const tabs = ['All', 'Articles', 'Videos', 'Exercises'];

  useEffect(() => {
    // Try to fetch from Supabase but fall back to mock data
    fetchResources().catch(() => {
      console.log('Using mock data instead of Supabase');
      setFilteredResources(latestResources);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Try Supabase search first, fall back to mock data filtering
      searchResources(searchTerm).catch(() => {
        const filtered = latestResources.filter(resource => 
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredResources(filtered);
      });
    } else {
      fetchResources().catch(() => {
        setFilteredResources(latestResources);
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    if (tab === 'All') {
      fetchResources().catch(() => {
        setFilteredResources(latestResources);
      });
    } else {
      // Filter mock data by type
      const filtered = latestResources.filter(resource => 
        resource.type.toLowerCase() === tab.toLowerCase().slice(0, -1) // Remove 's' from 'Articles', 'Videos'
      );
      setFilteredResources(filtered);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveTab(categoryName);
    setCurrentPage(1);
    // Filter mock data by category
    const filtered = latestResources.filter(resource => 
      resource.type.toLowerCase() === categoryName.toLowerCase().slice(0, -1) ||
      categoryName === 'All'
    );
    setFilteredResources(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Resources</h1>
        <p className="text-gray-400 text-lg">Explore articles, videos, and exercises to support your mental well-being.</p>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            />
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Featured</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredResources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 bg-gray-800 border-gray-700">
              <div className="aspect-video overflow-hidden">
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
                <p className="text-gray-400 mb-4">{resource.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`p-6 rounded-xl border transition-all duration-200 hover:scale-105 ${category.color}`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <IconComponent className="w-8 h-8" />
                  <span className="font-medium">{category.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Latest Resources Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Latest Resources</h2>
        <div className="space-y-6">
          {latestResources.map((resource) => (
            <div key={resource.id} className="flex flex-col md:flex-row bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div className="md:w-64 h-48 md:h-auto">
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-2">{resource.type}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
                  <p className="text-gray-400 mb-4">{resource.description}</p>
                </div>
                <div>
                  <Button variant="outline" className="w-fit">
                    {resource.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-12">
        <button className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
        <button className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};