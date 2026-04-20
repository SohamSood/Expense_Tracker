import { Route, Routes } from "react-router-dom";
import "./App.css";
import UploadReceipt from "./Pages/UploadReceipt";
import AddBill from "./Pages/AddBill";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ViewBills from "./Pages/ViewBills";
import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./Components/layout/Layout";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={<Layout><Dashboard /></Layout>} 
        />
        <Route 
          path="/view-bills" 
          element={<Layout><ViewBills /></Layout>} 
        />
        <Route 
          path="/upload-receipt" 
          element={<Layout><UploadReceipt /></Layout>} 
        />
        <Route 
          path="/add-bill" 
          element={<Layout><AddBill /></Layout>} 
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
