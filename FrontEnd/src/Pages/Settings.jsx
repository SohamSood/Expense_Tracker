import React, { useState } from "react";
import { useAuth, api } from "../context/AuthContext";
import { Card, Button, Input } from "../Components/ui";
import { Loader2 } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Create payload. Don't send empty password.
      const payload = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      await api.put("/api/auth/profile", payload);
      setMessage({ type: "success", text: "Profile updated successfully! Refresh to see changes." });
      setFormData({ ...formData, password: "" }); // clear password field
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">Account Settings</h1>

      <Card className="p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-6 text-[var(--text-secondary)]">Update Profile</h2>
        
        {message.text && (
          <p className={`mb-6 p-3 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <div className="pt-4 border-t border-[var(--border)] mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Change Password (leave blank to keep current)</h3>
            <Input
              label="New Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-6">
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
