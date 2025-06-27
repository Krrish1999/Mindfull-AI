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
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      set({ resources: data as Resource[] });
    } catch (error) {
      console.error('Error fetching resources:', error);
      set({ error: 'Failed to load resources' });
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