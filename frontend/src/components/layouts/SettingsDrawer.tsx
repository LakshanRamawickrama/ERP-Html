'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Volume2,
  VolumeX,
  Bell,
  Monitor,
  Shield,
  HelpCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/api';
import { cn } from '@/lib/utils';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const [isVoiceDisabled, setIsVoiceDisabled] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'main' | 'security' | 'help'>('main');

  useEffect(() => {
    if (!isOpen) {
      setSelectedSection('main');
      return;
    }

    const fetchLatestSettings = async () => {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) return;

      try {
        const userData = JSON.parse(savedUser);
        const token = localStorage.getItem('token');

        // Fetch latest from DB to ensure sync
        const response = await fetch(`${API_ENDPOINTS.USERS}staff/${userData.id || userData.user_id}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const freshData = await response.json();
          let settings = freshData.settings || {};
          if (typeof settings === 'string') settings = JSON.parse(settings);

          setIsVoiceDisabled(settings.disableVoiceAnnouncement === true);

          // Update local storage to stay in sync
          const updatedUser = { ...userData, settings: freshData.settings };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
          // Fallback to local if fetch fails
          let settings = userData.settings || {};
          if (typeof settings === 'string') settings = JSON.parse(settings);
          setIsVoiceDisabled(settings.disableVoiceAnnouncement === true);
        }
      } catch (e) {
        console.error("Error syncing settings:", e);
      }
    };

    fetchLatestSettings();
  }, [isOpen]);

  const toggleVoice = async () => {
    const newValue = !isVoiceDisabled;
    setIsVoiceDisabled(newValue);

    // 1. Update localStorage flag (fallback/immediate logic)
    localStorage.setItem('disableVoiceAnnouncement', newValue ? 'true' : 'false');

    // 2. Update Database & Local User Object
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        let currentSettings = userData.settings || {};
        if (typeof currentSettings === 'string') currentSettings = JSON.parse(currentSettings);

        const newSettings = { ...currentSettings, disableVoiceAnnouncement: newValue };

        const response = await fetch(`${API_ENDPOINTS.USERS}staff/${userData.user_id || userData.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ settings: newSettings })
        });

        if (response.ok) {
          const updatedProfile = await response.json();
          // 3. Sync local user object
          const newUser = { ...userData, settings: updatedProfile.settings };
          localStorage.setItem('user', JSON.stringify(newUser));

          setShowSavedToast(true);
          setTimeout(() => setShowSavedToast(false), 2000);
          window.dispatchEvent(new Event('settingsChanged'));
        }
      } catch (err) {
        console.error("Failed to save settings:", err);
      }
    }
  };

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
          "fixed top-0 right-0 h-full w-[360px] max-w-[90vw] bg-[#f8fafc] z-[2001] shadow-[-10px_0_50px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {selectedSection === 'main' ? (
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Settings size={20} />
              </div>
            ) : (
              <button
                onClick={() => setSelectedSection('main')}
                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h3 className="text-slate-800 font-bold text-lg m-0">
                {selectedSection === 'main' && "System Settings"}
                {selectedSection === 'security' && "Security & Privacy"}
                {selectedSection === 'help' && "Help Center"}
              </h3>
              <p className="text-slate-500 text-[11px] font-medium m-0 uppercase tracking-wider">
                {selectedSection === 'main' && "Configure your experience"}
                {selectedSection === 'security' && "Data Protection & Privacy"}
                {selectedSection === 'help' && "Support & Resources"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">

          {selectedSection === 'main' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Notifications Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Bell size={14} className="shrink-0" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Audio & Notifications</h4>
                </div>

                <div className="space-y-3">
                  {/* Voice Setting Card */}
                  <div
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer group",
                      !isVoiceDisabled
                        ? "bg-white border-indigo-100 shadow-sm hover:border-indigo-200"
                        : "bg-slate-50 border-slate-200 grayscale opacity-80"
                    )}
                    onClick={toggleVoice}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        !isVoiceDisabled ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                      )}>
                        {!isVoiceDisabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                      </div>
                      <div className={cn(
                        "w-12 h-6 rounded-full relative transition-colors",
                        !isVoiceDisabled ? "bg-indigo-600" : "bg-slate-300"
                      )}>
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                          !isVoiceDisabled ? "left-7" : "left-1"
                        )} />
                      </div>
                    </div>
                    <h5 className="text-[14px] font-bold text-slate-800 m-0">AI System Voice</h5>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Hear a high-tech AI briefing about your high-priority items upon login.
                    </p>
                  </div>
                </div>
              </section>

              {/* Interface Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Monitor size={14} className="shrink-0" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Interface</h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border-2 border-indigo-600 bg-white flex flex-col items-center gap-2 cursor-pointer">
                    <div className="w-full h-12 bg-slate-100 rounded-lg border border-slate-200" />
                    <span className="text-[11px] font-bold text-slate-800">Light Mode</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                    <div className="w-full h-12 bg-slate-800 rounded-lg" />
                    <span className="text-[11px] font-bold text-slate-500">Dark Mode</span>
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section className="pt-4 border-t border-slate-200 space-y-4">
                <div
                  onClick={() => setSelectedSection('security')}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors cursor-pointer group"
                >
                  <Shield size={16} className="text-slate-400 group-hover:text-indigo-600" />
                  <span className="text-[12px] font-semibold text-slate-700">Security & Privacy</span>
                </div>
                <div
                  onClick={() => setSelectedSection('help')}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors cursor-pointer group"
                >
                  <HelpCircle size={16} className="text-slate-400 group-hover:text-indigo-600" />
                  <span className="text-[12px] font-semibold text-slate-700">Help Center</span>
                </div>
              </section>
            </div>
          )}

          {selectedSection === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-800 text-sm">Enterprise Data Protection</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Zerozzz ERP uses military-grade AES-256 encryption to protect your business data at rest. Your information is isolated and secured within your dedicated entity space.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-50 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-semibold text-slate-700">End-to-End Encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-semibold text-slate-700">Automatic Session Timeout</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-semibold text-slate-700">Granular Role Permissions</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-600 text-white space-y-3 shadow-lg shadow-indigo-100">
                <h5 className="font-bold text-sm">Privacy Commitment</h5>
                <p className="text-[11px] text-indigo-100 leading-relaxed">
                  We believe your business data belongs to you. Zerozzz ERP does not share, sell, or analyze your business operations for third-party purposes.
                </p>
              </div>

              <div className="px-2">
                <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Audit Logs</h6>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Every login and administrative action is recorded in your entity's audit log. You can review these logs in the Advanced Analytics module to ensure complete oversight.
                </p>
              </div>
            </div>
          )}

          {selectedSection === 'help' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300 text-center py-10">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <HelpCircle size={40} />
              </div>
              <h3 className="text-slate-800 font-bold">Need assistance?</h3>
              <p className="text-[11px] text-slate-500 max-w-[240px] mx-auto leading-relaxed">
                Our support team is available 24/7 to help you with your ERP transition and technical questions.
              </p>
              <button 
                onClick={() => window.open('https://wa.me/94777516263', '_blank')}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
              >
                Contact Support
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-white">
          <p className="text-center text-[10px] font-medium text-slate-400">
            ERP System Version 1.0.0<br />
            © 2025 – 2026 Whiterock Global Solutions. All Rights Reserved.
          </p>
        </div>

        {/* Success Toast */}
        {showSavedToast && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-[11px] font-bold flex items-center gap-2 shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
            <CheckCircle2 size={14} className="text-emerald-400" />
            Settings Updated
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
