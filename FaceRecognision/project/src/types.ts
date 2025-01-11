export interface MoodHistory {
  id: string;
  user_id: string;
  mood: string;
  mood_color: string;
  song_suggestion: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  created_at: string;
}