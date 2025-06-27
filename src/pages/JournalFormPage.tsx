import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { JournalForm } from '../components/journal/JournalForm';
import { useJournalStore } from '../store/journalStore';

type JournalFormPageProps = {
  isEditing?: boolean;
};

export const JournalFormPage: React.FC<JournalFormPageProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const { currentEntry, fetchJournalEntry, isLoading } = useJournalStore();
  
  useEffect(() => {
    if (isEditing && id) {
      fetchJournalEntry(id);
    }
  }, [isEditing, id]);
  
  if (isEditing && isLoading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <JournalForm 
        entry={isEditing ? currentEntry : undefined} 
        isEditing={isEditing} 
      />
    </div>
  );
};