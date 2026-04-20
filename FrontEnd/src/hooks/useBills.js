import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export const useBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBills = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/bills');
      setBills(Array.isArray(data) ? data : data.bills ?? []);
      setError(null);
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError('Failed to load bills');
    } finally {
      setLoading(false);
    }
  }, []);

  const addBill = async (billData) => {
    try {
      const data = await api.post('/bills', billData);
      setBills((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding bill:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  return { bills, loading, error, refreshBills: fetchBills, addBill };
};
