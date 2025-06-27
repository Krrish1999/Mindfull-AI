import React from 'react';
import { Frown, Meh, Smile, Laugh as LaughSquint, HeartCrack } from 'lucide-react';

type MoodPickerProps = {
  selectedMood: number;
  onChange: (mood: number) => void;
};

export const MoodPicker: React.FC<MoodPickerProps> = ({ selectedMood, onChange }) => {
  const moods = [
    { value: 1, icon: <HeartCrack className="w-8 h-8" />, label: 'Terrible' },
    { value: 2, icon: <Frown className="w-8 h-8" />, label: 'Bad' },
    { value: 3, icon: <Meh className="w-8 h-8" />, label: 'Okay' },
    { value: 4, icon: <Smile className="w-8 h-8" />, label: 'Good' },
    { value: 5, icon: <LaughSquint className="w-8 h-8" />, label: 'Great' },
  ];

  return (
    <div className="flex flex-col space-y-4">
      <label className="block text-base font-semibold text-gray-200">
        How are you feeling today?
      </label>
      
      <div className="flex justify-between gap-2">
        {moods.map((mood) => (
          <button
            key={mood.value}
            type="button"
            className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 ${
              selectedMood === mood.value
                ? 'bg-blue-600 text-white scale-110 shadow-lg'
                : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200 hover:scale-105'
            }`}
            onClick={() => onChange(mood.value)}
          >
            {mood.icon}
            <span className="mt-2 text-xs font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};