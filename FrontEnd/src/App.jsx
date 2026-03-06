import { Route, Routes } from "react-router-dom";
import "./App.css";
import UploadReceipt from "./Pages/upload_recipt";
import AddBill from "./Pages/AddBill";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ViewBills from "./Pages/ViewBills";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/view_Bills" element={<ViewBills />} />
      <Route path="/upload_Recipt" element={<UploadReceipt />} />
      <Route path="/add-bill" element={<AddBill />} />
      <Route path="/add_Bills" element={<AddBill />} />
    </Routes>
  );
}

export default App;
