import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import UploadReceipt from "./Pages/UploadReceipt";
import AddBill from "./Pages/AddBill";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import ViewBills from "./Pages/ViewBills";
import Gold from "./Pages/Gold";
import FD from "./Pages/FD";
import SettingsPage from "./Pages/Settings";
import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./Components/layout/Layout";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} 
          />
          <Route 
            path="/view-bills" 
            element={<ProtectedRoute><Layout><ViewBills /></Layout></ProtectedRoute>} 
          />
          <Route 
            path="/upload-receipt" 
            element={<ProtectedRoute><Layout><UploadReceipt /></Layout></ProtectedRoute>} 
          />
          <Route 
            path="/add-bill" 
            element={<ProtectedRoute><Layout><AddBill /></Layout></ProtectedRoute>} 
          />
          <Route 
            path="/gold" 
            element={<ProtectedRoute><Layout><Gold /></Layout></ProtectedRoute>} 
          />
          <Route 
            path="/fd" 
            element={<ProtectedRoute><Layout><FD /></Layout></ProtectedRoute>} 
          />
          <Route 
            path="/settings" 
            element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} 
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
