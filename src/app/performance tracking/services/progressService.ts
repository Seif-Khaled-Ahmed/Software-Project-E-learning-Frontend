import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Backend base URL from your .env.local file
});

// Attach Authorization token (if applicable)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Adjust based on your auth flow
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchProgressData = async () => {
  try {
    const response = await api.get('/progress'); // Backend endpoint for progress
    return response.data.progress; // Assuming the backend returns `progress`
  } catch (error) {
    console.error('Error fetching progress data:', error);
    throw error;
  }
};
