import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Resource } from '../types';

type ResourceState = {
  resources: Resource[];
  featuredResources: Resource[];
  currentResource: Resource | null;
  categories: string[];
  isLoading: boolean;
  error: string | null;
  fetchResources: () => Promise<void>;
  fetchFeaturedResources: () => Promise<void>;
  fetchResourceById: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchResources: (query: string, category?: string) => Promise<void>;
};

export const useResourceStore = create<ResourceState>((set) => ({
  resources: [],
  featuredResources: [],
  currentResource: null,
  categories: [],
  isLoading: false,
  error: null,
  
  fetchResources: async () => {
    set({ isLoading: true });
    try {
      // Check if we have valid Supabase configuration
      if (!supabase || supabase.supabaseUrl === 'https://demo.supabase.co') {
        throw new Error('Demo mode - using mock data');
      }
      
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      set({ resources: data as Resource[] });
    } catch (error) {
      console.log('Using mock data instead of Supabase:', error);
      // Mock data fallback
      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'Understanding Anxiety',
          content: 'Learn about the causes and symptoms of anxiety and how to manage them effectively.',
          category: ['mental-health', 'anxiety'],
          thumbnail_url: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfXxtZW50YWwlMjBoZWFsdGh8ZW58MHx8fHwxNzUxMDQzMTEwfDA&ixlib=rb-4.1.0&q=85',
          author: 'Dr. Sarah Johnson',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Coping with Stress',
          content: 'Effective strategies for managing stress in daily life and building resilience.',
          category: ['mental-health', 'stress'],
          thumbnail_url: 'https://images.unsplash.com/photo-1471520201477-47a62a269a87?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxtaW5kZnVsbmVzc3xlbnwwfHx8fDE3NTEwNDMxMjV8MA&ixlib=rb-4.1.0&q=85',
          author: 'Dr. Michael Chen',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Building Resilience',
          content: 'Develop your ability to bounce back from challenges and adversity.',
          category: ['mental-health', 'resilience'],
          thumbnail_url: 'https://images.unsplash.com/photo-1562751362-404243c2eea3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzc3xlbnwwfHx8fDE3NTEwNDMxMTh8MA&ixlib=rb-4.1.0&q=85',
          author: 'Dr. Emily Rodriguez',
          created_at: new Date().toISOString()
        }
      ];
      set({ resources: mockResources });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchFeaturedResources: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .limit(4)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      set({ featuredResources: data as Resource[] });
    } catch (error) {
      console.error('Error fetching featured resources:', error);
      set({ error: 'Failed to load featured resources' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchResourceById: async (id: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      set({ currentResource: data as Resource });
    } catch (error) {
      console.error('Error fetching resource:', error);
      set({ error: 'Failed to load resource' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('category')
        .not('category', 'is', null);
        
      if (error) throw error;
      
      // Extract all categories and flatten the array
      const allCategories = data.flatMap(item => item.category);
      // Remove duplicates
      const uniqueCategories = [...new Set(allCategories)];
      
      set({ categories: uniqueCategories });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ error: 'Failed to load categories' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  searchResources: async (query: string, category?: string) => {
    set({ isLoading: true });
    try {
      let supabaseQuery = supabase
        .from('resources')
        .select('*');
        
      // Apply filters
      if (query) {
        supabaseQuery = supabaseQuery.textSearch('title', query, { 
          config: 'english',
          type: 'plain'
        });
      }
      
      if (category) {
        supabaseQuery = supabaseQuery.contains('category', [category]);
      }
      
      const { data, error } = await supabaseQuery;
        
      if (error) throw error;
      
      set({ resources: data as Resource[] });
    } catch (error) {
      console.error('Error searching resources:', error);
      set({ error: 'Failed to search resources' });
    } finally {
      set({ isLoading: false });
    }
  },
}));