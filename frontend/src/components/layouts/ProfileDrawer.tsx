'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Shield, 
  Building2, 
  Lock, 
  Edit2, 
  Save, 
  LogOut, 
  Eye, 
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/api';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdateUser: (updatedUser: any) => void;
}

export default function ProfileDrawer({ isOpen, onClose, user, onUpdateUser }: ProfileDrawerProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState('');
  const [businesses, setBusinesses] = useState('');
  const [userName, setUserName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || user.name || '');
      setEmail(user.email || '');
      setUserName(user.username || '');
      setRoles(Array.isArray(user.roles) ? user.roles.join(', ') : (user.role || ''));
      setBusinesses(
        user.assigned_business || 
        user.business || 
        (Array.isArray(user.businesses) && user.businesses.length > 0 ? user.businesses.join(', ') : '') ||
        (user.role === 'super_admin' ? 'All Entities' : 'None Assigned')
      );
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSave = () => {
    if (isChangingPassword) {
      if (newPassword && newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }

      if (!currentPassword || !newPassword) {
        showToast('Check current password', 'error');
        return;
      }
    }

    const token = localStorage.getItem('token');

    // If changing password
    if (isChangingPassword && newPassword) {
      fetch(`${API_ENDPOINTS.USERS}change-password/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.user_id || user.id,
          current_password: currentPassword,
          new_password: newPassword
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'error') {
          showToast(data.message, 'error');
          return;
        }
        // Proceed with profile update
        completeProfileUpdate();
      })
      .catch(err => {
        showToast('Failed to update password', 'error');
      });
    } else {
      completeProfileUpdate();
    }
  };

  const completeProfileUpdate = () => {
    const token = localStorage.getItem('token');
    
    fetch(`${API_ENDPOINTS.USERS}staff/${user.id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: fullName,
        email: email,
        username: userName
      })
    })
    .then(res => res.json())
    .then(data => {
      const updatedUser = {
        ...user,
        fullName,
        name: fullName,
        email,
        username: userName,
        roles: roles.split(',').map(s => s.trim()).filter(Boolean),
        businesses: businesses.split(',').map(s => s.trim()).filter(Boolean),
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUpdateUser(updatedUser);
      setIsEditMode(false);
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Profile updated successfully', 'success');
    })
    .catch(err => {
      showToast('Failed to sync profile with server', 'error');
    });
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getInitials = (name: string) => {
    return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase()).slice(0, 2).join('') || 'U';
  };

  if (!user) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-[360px] max-w-[90vw] bg-white z-[2001] shadow-[-10px_0_50px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="relative bg-[#1e293b] pt-8 pb-6 px-6 flex flex-col items-center flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white/10 shadow-xl overflow-hidden">
              {user.photo ? (
                <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(fullName)
              )}
            </div>
          </div>

          <h3 className="text-white font-bold text-xl mt-4">{fullName}</h3>
          
          <div className={cn(
            "mt-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
            user.role === 'super_admin' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          )}>
            {user.role}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
          {!isEditMode ? (
            <div className="space-y-4">
              <SectionTitle title="Account Details" />
              
              <InfoRow icon={<User size={14} />} label="Full Name" value={fullName} color="blue" />
              <InfoRow icon={<User size={14} />} label="User Name" value={userName || 'user'} color="indigo" />
              <InfoRow icon={<Mail size={14} />} label="Email Address" value={email || 'Not Provided'} color="emerald" />
              <InfoRow icon={<Shield size={14} />} label="Assigned Roles" value={roles} color="purple" />
              <InfoRow icon={<Building2 size={14} />} label="Assigned Businesses" value={businesses} color="amber" />
            </div>
          ) : (
            <div className="space-y-4">
              <SectionTitle title="Edit Profile" />
              
              <div className="space-y-4">
                <InputField label="Full Name" value={fullName} onChange={setFullName} />
                <InputField label="User Name" value={userName} onChange={setUserName} />
                <InputField label="Email Address" value={email} onChange={setEmail} type="email" />
                
                <div className="pt-2">
                  {!isChangingPassword ? (
                    <button 
                      onClick={() => setIsChangingPassword(true)}
                      className="w-full py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors border border-slate-200"
                    >
                      <Lock size={14} />
                      Change Password
                    </button>
                  ) : (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center justify-between">
                        <SectionTitle title="Change Password" />
                        <button 
                          onClick={() => {
                            setIsChangingPassword(false);
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                          }}
                          className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                      </div>
                      
                      <InputField 
                        label="Current Password" 
                        value={currentPassword} 
                        onChange={setCurrentPassword} 
                        type={showCurrentPassword ? "text" : "password"} 
                        suffix={
                          <button 
                            type="button"
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        }
                      />

                      <InputField 
                        label="New Password" 
                        value={newPassword} 
                        onChange={setNewPassword} 
                        type={showPassword ? "text" : "password"} 
                        suffix={
                          <button 
                            type="button"
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        }
                      />

                      <InputField 
                        label="Confirm Password" 
                        value={confirmPassword} 
                        onChange={setConfirmPassword} 
                        type={showConfirmPassword ? "text" : "password"} 
                        suffix={
                          <button 
                            type="button"
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3">
          {!isEditMode ? (
            <>
              <button 
                onClick={() => setIsEditMode(true)}
                className="w-full py-3 bg-[#1e293b] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
              <button 
                onClick={handleLogout}
                className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleSave}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                <Save size={16} />
                Save Changes
              </button>
              <button 
                onClick={() => setIsEditMode(false)}
                className="w-full py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Toast Notification Overlay */}
        {toast && (
          <div className="absolute inset-0 z-[3000] flex items-center justify-center p-4 pointer-events-none">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] pointer-events-none" />
            <div className={cn(
              "relative pointer-events-auto px-6 py-6 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.3)] flex flex-col items-center gap-3 text-center w-full max-w-[280px] animate-in zoom-in-95 duration-300",
              toast.type === 'success' ? "bg-white text-slate-900 border-2 border-emerald-500" : "bg-white text-red-600 border-2 border-red-500"
            )}>
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center mb-1",
                toast.type === 'success' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
              )}>
                {toast.type === 'success' ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
              </div>
              <div className="space-y-1">
                <p className="font-bold text-xl">{toast.type === 'success' ? 'Success!' : 'Error'}</p>
                <p className="text-sm font-semibold text-slate-600 leading-relaxed">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToast(null)}
                className="mt-3 w-full py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors border border-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{title}</h4>
  );
}

function InfoRow({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  const colors: any = {
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    purple: "bg-purple-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500"
  };

  return (
    <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-200 transition-colors">
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm", colors[color])}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-[13px] font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", placeholder = "", disabled = false, suffix }: { label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string, disabled?: boolean, suffix?: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative flex items-center">
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner",
            suffix && "pr-10",
            disabled && "opacity-60 cursor-not-allowed bg-slate-100"
          )}
        />
        {suffix && (
          <div className="absolute right-3">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}
