export type User = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  avatar_url?: string;
  bio?: string;
  consent_given?: boolean;
  phone_number?: string;
  role: 'patient' | 'therapist';
};

export type TherapistProfile = {
  id: string;
  user_id: string;
  specialization: string[];
  experience_years: number;
  description: string;
  rate_per_hour: number;
  availability: string[];
  education: string[];
  certifications: string[];
  rating: number;
};

export type JournalEntry = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: number;
  created_at: string;
  tags?: string[];
};

export type MoodEntry = {
  id: string;
  user_id: string;
  mood: number;
  note?: string;
  created_at: string;
};

export type Appointment = {
  id: string;
  therapist_id: string;
  client_id: string;
  date_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  therapist_service_id?: string;
  therapist_service?: {
    id: string;
    name: string;
    price_amount: number;
    currency: string;
    type: string;
  };
  stripe_payment_intent_id?: string;
  stripe_subscription_id?: string;
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'free';
  rescheduled_from?: string;
  cancellation_reason?: string;
  refund_status?: 'none' | 'full' | 'partial';
  client?: {
    full_name: string;
  };
};

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
};

export type Resource = {
  id: string;
  title: string;
  content: string;
  category: string[];
  thumbnail_url?: string;
  created_at: string;
  author: string;
};

export type AIChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  created_at: string;
};

export type ChatHistoryEntry = {
  id: string;
  user_id: string;
  message_text: string;
  ai_reply_text: string;
  created_at: string;
};

export type PatientSummary = {
  id: string;
  full_name: string;
  age: number;
  status: 'stable' | 'monitoring' | 'crisis';
  avg_mood: number;
  journal_count: number;
  engagement_score: number;
  has_crisis_alert: boolean;
  next_appointment?: string;
  last_activity?: string;
  last_mood_entry?: string;
};

export type PatientDetails = {
  id: string;
  email: string;
  full_name: string;
  bio?: string;
  phone_number?: string;
  created_at: string;
};