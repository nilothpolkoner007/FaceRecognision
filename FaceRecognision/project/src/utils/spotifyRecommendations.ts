interface MoodPlaylist {
  happy: string[];
  sad: string[];
  angry: string[];
  surprised: string[];
  neutral: string[];
  fearful: string[];
}

export const spotifyPlaylists: MoodPlaylist = {
  happy: [
    'spotify:playlist:37i9dQZF1DX3rxVfibe1L0', // Mood Booster
    'spotify:playlist:37i9dQZF1DX9XIFQuFvzM4', // Feelin' Good
  ],
  sad: [
    'spotify:playlist:37i9dQZF1DX7qK8ma5wgG1', // Sad Songs
    'spotify:playlist:37i9dQZF1DX3YSRoSdA634', // Life Sucks
  ],
  angry: [
    'spotify:playlist:37i9dQZF1DX1tyCD9QhIWF', // Adrenaline Workout
    'spotify:playlist:37i9dQZF1DWYMvTygsLWlG', // Rock Hard
  ],
  surprised: [
    'spotify:playlist:37i9dQZF1DX4fpCWaHOned', // Discover Weekly
    'spotify:playlist:37i9dQZF1DX0BcQWzuB7ZO', // Dance Pop
  ],
  neutral: [
    'spotify:playlist:37i9dQZF1DWWQRwui0ExPn', // Lofi Beats
    'spotify:playlist:37i9dQZF1DX4sWSpwq3LiO', // Peaceful Piano
  ],
  fearful: [
    'spotify:playlist:37i9dQZF1DWXe9gFZP0gtP', // Ambient Relaxation
    'spotify:playlist:37i9dQZF1DWZqd5JICZI0u', // Peaceful Meditation
  ],
};