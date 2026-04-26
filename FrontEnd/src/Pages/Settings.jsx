import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import { Card, Button, Input } from "../Components/ui";
import { Loader2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function StatusMsg({ msg }) {
  if (!msg.text) return null;
  const cls = msg.type === "success"
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";
  return <p className={`mb-4 p-3 rounded-lg text-sm ${cls}`}>{msg.text}</p>;
}

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // --- Section 1: Profile ---
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ type: "", text: "" });
    try {
      const data = await api.put("/auth/profile", { name: profile.name, email: profile.email });
      updateUser({ name: data.name, email: data.email });
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
    } finally {
      setProfileLoading(false);
    }
  };

  // --- Section 2: Change Password ---
  const [pwData, setPwData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwData.newPassword !== pwData.confirmPassword) {
      return setPwMsg({ type: "error", text: "New passwords do not match" });
    }
    setPwLoading(true);
    setPwMsg({ type: "", text: "" });
    try {
      const data = await api.put("/auth/change-password", {
        oldPassword: pwData.oldPassword,
        newPassword: pwData.newPassword,
      });
      setPwMsg({ type: "success", text: data.message });
      setPwData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwMsg({ type: "error", text: err.response?.data?.message || "Failed to change password" });
    } finally {
      setPwLoading(false);
    }
  };

  // --- Section 3: Delete Account ---
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState({ type: "", text: "" });

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await api.delete("/auth/account");
      await logout();
      navigate("/");
    } catch (err) {
      setDeleteMsg({ type: "error", text: err.response?.data?.message || "Failed to delete account" });
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">Account Settings</h1>

      {/* --- Profile --- */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6 text-[var(--text-secondary)]">Update Profile</h2>
        <StatusMsg msg={profileMsg} />
        <form onSubmit={handleProfileSave} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            required
          />
          <Button type="submit" disabled={profileLoading} className="w-full mt-2">
            {profileLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : "Save Profile"}
          </Button>
        </form>
      </Card>

      {/* --- Change Password --- */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6 text-[var(--text-secondary)]">Change Password</h2>
        <StatusMsg msg={pwMsg} />
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={pwData.oldPassword}
            onChange={(e) => setPwData({ ...pwData, oldPassword: e.target.value })}
            required
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Min. 6 characters"
            value={pwData.newPassword}
            onChange={(e) => setPwData({ ...pwData, newPassword: e.target.value })}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={pwData.confirmPassword}
            onChange={(e) => setPwData({ ...pwData, confirmPassword: e.target.value })}
            required
          />
          <Button type="submit" disabled={pwLoading} className="w-full mt-2">
            {pwLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : "Update Password"}
          </Button>
        </form>
      </Card>

      {/* --- Delete Account --- */}
      <Card className="p-6 border border-red-300">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={20} className="text-red-500" />
          <h2 className="text-xl font-semibold text-red-600">Delete Account</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Your account will be hidden immediately and permanently deleted after 30 days.
          This action cannot be undone.
        </p>
        <StatusMsg msg={deleteMsg} />
        {!showDeleteConfirm ? (
          <Button
            variant="outline"
            className="w-full border-red-400 text-red-600"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete My Account
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-red-600">Are you absolutely sure?</p>
            <div className="flex gap-3">
              <Button
                className="flex-1"
                disabled={deleteLoading}
                onClick={handleDeleteAccount}
              >
                {deleteLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : "Yes, Delete"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
