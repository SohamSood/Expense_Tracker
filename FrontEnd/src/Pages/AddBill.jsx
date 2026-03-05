import BillForm from "../Components/BillForm";
import { addBill } from "../JS/BillForm";
export default function AddBill() {
  const handleAddBill = async (billData) => {
    try {
      await addBill(billData);
      alert("Bill added successfully");
    } catch (error) {
      console.error(error);
      alert("Error adding bill");
    }
  };
  return (
    <div>
      <h1>Add Bill Page</h1>
      <BillForm onSubmit={handleAddBill} />
    </div>
  );
}
