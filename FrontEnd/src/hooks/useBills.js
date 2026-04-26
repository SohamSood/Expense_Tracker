import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export const useBills = ({ page = 1, limit = 8, search = '', type = '' } = {}) => {
  const [bills, setBills] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBills = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit, search, type }).toString();
      const data = await api.get(`/bills?${params}`);
      setBills(data.bills ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setTotalAmount(data.totalAmount ?? 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError('Failed to load bills');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, type]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const deleteBill = async (id) => {
    await api.delete(`/bills/${id}`);
    setBills(prev => prev.filter(b => b._id !== id));
    setTotal(prev => prev - 1);
  };

  return { bills, loading, error, total, totalPages, totalAmount, refreshBills: fetchBills, deleteBill };
};
