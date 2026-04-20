import React, { useState } from 'react';
import { 
  PlusCircle, 
  CheckCircle2, 
  ArrowLeft,
  Calendar,
  Clock as ClockIcon,
  Tag,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Badge, cn } from '../Components/ui';
import BillForm from '../Components/BillForm';

export default function AddBill() {
  const navigate = useNavigate();
  const [submittedBill, setSubmittedBill] = useState(null);

  const handleAddBill = (billData) => {
    setSubmittedBill(billData);
    // Auto clear after 5 seconds
    setTimeout(() => setSubmittedBill(null), 10000);
  };

  return (
    <div className="add-bill-container">
      <div className="page-header-row">
        <div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="page-title">Add New Expense</h1>
          <p className="page-subtitle">Record your spending manually for accurate tracking</p>
        </div>
      </div>

      <div className="add-bill-grid">
        <Card className="form-card">
          <BillForm onSubmit={handleAddBill} />
        </Card>

        <div className="add-bill-sidebar">
          {submittedBill ? (
            <Card className="success-card glass">
              <div className="success-header">
                <CheckCircle2 className="success-icon" />
                <h3>Recent Submission</h3>
              </div>
              <div className="submission-details">
                <div className="detail-item">
                  <Tag size={16} />
                  <span>{submittedBill.type}</span>
                </div>
                <div className="detail-item">
                  <CreditCard size={16} />
                  <span className="font-bold">₹{submittedBill.amount}</span>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{submittedBill.date}</span>
                </div>
                <div className="detail-item">
                  <ClockIcon size={16} />
                  <span>{submittedBill.time}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => setSubmittedBill(null)}
              >
                Clear
              </Button>
            </Card>
          ) : (
            <Card className="info-card">
              <h3>Quick Tips</h3>
              <ul className="tips-list">
                <li>Double check the amount before submitting.</li>
                <li>Choose a relevant category for better insights.</li>
                <li>You can also upload a receipt to auto-fill details.</li>
              </ul>
              <Button 
                variant="secondary" 
                className="w-full mt-4"
                onClick={() => navigate('/upload_Recipt')}
              >
                Upload Receipt instead
              </Button>
            </Card>
          )}

          <Card className="category-helper">
            <h3>Common Categories</h3>
            <div className="category-tags">
              <Badge variant="primary">Food</Badge>
              <Badge variant="primary">Transport</Badge>
              <Badge variant="primary">Groceries</Badge>
              <Badge variant="primary">Health</Badge>
              <Badge variant="primary">Leisure</Badge>
              <Badge variant="primary">Other</Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
