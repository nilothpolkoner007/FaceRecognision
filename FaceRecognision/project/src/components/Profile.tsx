import React, { useState, useEffect } from 'react';
import { User, UserCircle, Music } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import type { MoodHistory } from '../types';

interface ProfileProps {
  userId: string;
}

export function Profile({ userId }: ProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [moodHistory, setMoodHistory] = useState<MoodHistory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchMoodHistory();
  }, [userId]);

  async function fetchProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data);
      setName(data.name);
    }
  }

  async function fetchMoodHistory() {
    const { data, error } = await supabase
      .from('mood_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setMoodHistory(data);
    }
  }

  async function updateProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', userId);

    if (!error) {
      setIsEditing(false);
      fetchProfile();
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <UserCircle className="w-12 h-12 text-gray-400" />
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <button
                onClick={updateProfile}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold">{profile?.name || 'Anonymous'}</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-500"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recent Mood History</h3>
        <div className="space-y-3">
          {moodHistory.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${entry.mood_color}`} />
                <span className="capitalize">{entry.mood}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Music className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{entry.song_suggestion}</span>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(entry.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}