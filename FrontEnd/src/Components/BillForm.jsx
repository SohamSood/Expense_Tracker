import { useState } from "react";
import { addBill } from "../JS/BillForm";

export default function BillForm({ onSubmit }) {
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("paid");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const billData = {
      type,
      date,
      time,
      amount: Number(amount),
      status,
      items: [],
    };

    try {
      setIsSubmitting(true);
      const createdBill = await addBill(billData);
      onSubmit(createdBill);

      setType("");
      setDate("");
      setTime("");
      setAmount("");
      setStatus("paid");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="add-bill-form" onSubmit={handleSubmit}>
      <h2 className="add-bill-form__title">Add New Bill</h2>

      <div className="add-bill-form__field">
        <label htmlFor="bill-type">Type</label>
        <input
          id="bill-type"
          type="text"
          placeholder="Food / Shopping"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
      </div>

      <div className="add-bill-form__grid">
        <div className="add-bill-form__field">
          <label htmlFor="bill-date">Date</label>
          <input
            id="bill-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="add-bill-form__field">
          <label htmlFor="bill-time">Time</label>
          <input
            id="bill-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="add-bill-form__grid">
        <div className="add-bill-form__field">
          <label htmlFor="bill-amount">Amount</label>
          <input
            id="bill-amount"
            type="number"
            min="0"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="add-bill-form__field">
          <label htmlFor="bill-status">Status</label>
          <select
            id="bill-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="paid">paid</option>
            <option value="pending">pending</option>
          </select>
        </div>
      </div>

      <button className="add-bill-form__submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Add Bill"}
      </button>
    </form>
  );
}
