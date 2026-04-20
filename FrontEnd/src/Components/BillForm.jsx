import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button, Input } from './ui';
import { addBill } from '../JS/BillForm';

export default function BillForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    type: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    amount: '',
    status: 'paid'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.amount) return;

    try {
      setIsSubmitting(true);
      const billData = {
        ...formData,
        amount: Number(formData.amount),
        items: []
      };
      
      const createdBill = await addBill(billData);
      onSubmit(createdBill);
      
      // Reset form
      setFormData({
        type: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        amount: '',
        status: 'paid'
      });
    } catch (error) {
      console.error('Error submitting bill:', error);
      alert('Failed to add bill. Please check your backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="bill-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <Input
          label="Title / Category"
          name="type"
          placeholder="e.g. Starbucks Coffee, Office Lunch"
          value={formData.type}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-grid">
        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <Input
          label="Time"
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-grid">
        <Input
          label="Amount (₹)"
          name="amount"
          type="number"
          placeholder="0.00"
          min="0"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <div className="ui-input-group">
          <label className="ui-label">Payment Status</label>
          <select 
            className="ui-input"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full mt-4" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={18} /> Submitting...
          </>
        ) : (
          <>
            <Send size={18} /> Add Bill
          </>
        )}
      </Button>
    </form>
  );
}
