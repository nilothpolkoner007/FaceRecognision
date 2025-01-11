export interface MoodData {
  emotion: string;
  confidence: number;
  color: string;
  description: string;
  suggestedActions: string[];
}

export const moodTypes: Record<string, MoodData> = {
  happy: {
    emotion: 'happy',
    confidence: 0.85,
    color: 'text-green-500',
    description: 'You seem to be in a great mood!',
    suggestedActions: [
      'Share your joy with friends',
      'Start a creative project',
      'Try something new',
      'Plan a social activity'
    ]
  },
  sad: {
    emotion: 'sad',
    confidence: 0.75,
    color: 'text-blue-500',
    description: 'You might be feeling down.',
    suggestedActions: [
      'Talk to a friend or family member',
      'Take a relaxing walk',
      'Listen to uplifting music',
      'Practice self-care activities'
    ]
  },
  angry: {
    emotion: 'angry',
    confidence: 0.8,
    color: 'text-red-500',
    description: 'You appear to be frustrated.',
    suggestedActions: [
      'Take deep breaths',
      'Go for a run or exercise',
      'Write down your thoughts',
      'Practice meditation'
    ]
  },
  surprised: {
    emotion: 'surprised',
    confidence: 0.7,
    color: 'text-purple-500',
    description: 'Something caught you off guard!',
    suggestedActions: [
      'Take a moment to process',
      'Share the surprise with others',
      'Document the moment',
      'Channel the energy positively'
    ]
  },
  neutral: {
    emotion: 'neutral',
    confidence: 0.65,
    color: 'text-gray-500',
    description: 'You seem calm and balanced.',
    suggestedActions: [
      'Set goals for the day',
      'Try something new',
      'Connect with friends',
      'Start a hobby project'
    ]
  },
  fearful: {
    emotion: 'fearful',
    confidence: 0.7,
    color: 'text-yellow-500',
    description: 'You might be feeling anxious.',
    suggestedActions: [
      'Practice grounding exercises',
      'Talk to someone you trust',
      'Try breathing exercises',
      'Focus on what you can control'
    ]
  }
};