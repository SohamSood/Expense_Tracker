import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import UploadReceipt from "./Pages/upload_recipt";
import AddBill from "./Pages/AddBill";

function App() {
  return (
    <>
      <Routes>
        <Route path="/add_Bills" element={<UploadReceipt />} />
        <Route path="/view_Bills" element={<UploadReceipt />} />
        <Route path="/upload_Recipt" element={<UploadReceipt />} />
        <Route path="/add_Bills" element={<AddBill />} />
      </Routes>
    </>
  );
}

export default App;
