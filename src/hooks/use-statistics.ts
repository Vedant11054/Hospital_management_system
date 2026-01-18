import { useState, useEffect } from 'react';

export interface Statistics {
  totalUsers: number;
  totalHospitals: number;
}

export const useStatistics = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get from localStorage first
    const storedStats = localStorage.getItem('statistics');
    if (storedStats) {
      try {
        setStats(JSON.parse(storedStats));
      } catch (err) {
        console.error('Failed to parse stored statistics:', err);
      }
    }
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/auth/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch statistics');
      }

      setStats(data.statistics);
      localStorage.setItem('statistics', JSON.stringify(data.statistics));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Statistics error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, fetchStatistics };
};
