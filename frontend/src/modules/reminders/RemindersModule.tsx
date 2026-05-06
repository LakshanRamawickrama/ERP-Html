'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { 
  Bell, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Filter,
  ArrowRight,
  ShieldAlert,
  FileText,
  Truck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

export default function RemindersModule({ selectedBusiness = 'All Entities' }: { selectedBusiness?: string }) {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', business: '', description: '', date: '', priority: 'Medium', type: 'Manual' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(API_ENDPOINTS.REMINDERS, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        // Map types to icons
        const withIcons = data.map((r: any) => ({
          ...r,
          icon: r.type === 'Fleet' ? Truck : 
                r.type === 'Legal' ? FileText :
                r.type === 'Accounting' ? ShieldAlert :
                r.type === 'Property' ? Bell : Bell
        }));
        
        setReminders(withIcons);
      } catch (error) {
        console.error('Failed to fetch reminders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReminders();
  }, []);

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.title) return;
    const reminder = {
      ...newReminder,
      id: Date.now().toString(),
      icon: Bell
    };
    setReminders([reminder, ...reminders]);
    setNewReminder({ title: '', business: '', description: '', date: '', priority: 'Medium', type: 'Manual' });
    setShowAddForm(false);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setReminders(reminders.filter(r => r.id !== deleteId));
    setShowDeleteModal(false);
  };

  const filtered = reminders.filter(r => {
    // Business Filter
    if (selectedBusiness !== 'All Entities' && r.business !== selectedBusiness) return false;

    if (filter === 'all') return true;
    if (filter === 'High' || filter === 'Medium' || filter === 'Low') return r.priority === filter;
    
    if (filter === 'next-week') {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      const rDate = new Date(r.date);
      return rDate >= today && rDate <= nextWeek;
    }

    if (filter.startsWith('date-')) {
      const targetDate = filter.replace('date-', '');
      return r.date === targetDate;
    }
    
    return r.type === filter;
  });

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Actions Row */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Quick Filters:</span>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {['all', 'High', 'Medium', 'Low'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Reminder
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Main List - Scrollable Area */}
          <div className="lg:col-span-8 overflow-y-auto pr-2 scrollbar-custom space-y-4 pb-10">
            {filtered.map((reminder) => (
              <div key={reminder.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    reminder.priority === 'High' ? 'bg-red-50 text-red-600' :
                    reminder.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {reminder.icon ? <reminder.icon className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-sm">{reminder.title}</h3>
                      <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                        {reminder.business}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-tighter ${
                        reminder.priority === 'High' ? 'bg-red-100 text-red-700' :
                        reminder.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {reminder.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-md line-clamp-1">{reminder.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <Calendar className="w-3 h-3" />
                        {reminder.date}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <Filter className="w-3 h-3" />
                        {reminder.type}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleDeleteClick(reminder.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl">
                <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm font-medium">No reminders found</p>
              </div>
            )}
          </div>

          {/* Sidebar Info / Add Form */}
          <div className="lg:col-span-4 overflow-y-auto no-scrollbar space-y-6 pb-10">
            {showAddForm ? (
              <Card title="New Reminder" icon={Plus} iconColor="bg-slate-800">
                <form onSubmit={handleAddReminder} className="space-y-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="What needs to be done?"
                      className="w-full mt-0.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-800 transition-all"
                      value={newReminder.title}
                      onChange={e => setNewReminder({...newReminder, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Business</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Logistics Pro Ltd"
                        className="w-full mt-0.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-800 transition-all"
                        value={newReminder.business}
                        onChange={e => setNewReminder({...newReminder, business: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Due Date</label>
                      <input 
                        type="date" 
                        required
                        className="w-full mt-0.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-800 transition-all"
                        value={newReminder.date}
                        onChange={e => setNewReminder({...newReminder, date: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Priority</label>
                    <select 
                      className="w-full mt-0.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-800 transition-all"
                      value={newReminder.priority}
                      onChange={e => setNewReminder({...newReminder, priority: e.target.value})}
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                    <textarea 
                      placeholder="Add more context..."
                      className="w-full mt-0.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-800 transition-all resize-none h-14"
                      value={newReminder.description}
                      onChange={e => setNewReminder({...newReminder, description: e.target.value})}
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button 
                      type="submit"
                      className="flex-1 py-2.5 bg-slate-800 text-white rounded-lg text-xs font-bold shadow-lg hover:bg-slate-700 transition-all"
                    >
                      Save Reminder
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Card>
            ) : (
              <>
                <Card title="Quick Overview" icon={ArrowRight}>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setFilter('High')}
                      className={`w-full text-left p-4 rounded-2xl transition-all border ${
                        filter === 'High' ? 'bg-red-100 border-red-200 shadow-md' : 'bg-red-50 border-red-100 hover:bg-red-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-red-700 font-bold text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        3 High Priority
                      </div>
                      <p className="text-[10px] text-red-600 mt-1 uppercase tracking-widest font-extrabold">Filter by Priority</p>
                    </button>

                    <button 
                      onClick={() => setFilter('next-week')}
                      className={`w-full text-left p-4 rounded-2xl transition-all border ${
                        filter === 'next-week' ? 'bg-indigo-100 border-indigo-200 shadow-md' : 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-indigo-700 font-bold text-sm">
                        <Calendar className="w-4 h-4" />
                        Next Week
                      </div>
                      <p className="text-[10px] text-indigo-600 mt-1 uppercase tracking-widest font-extrabold">View Schedule</p>
                    </button>

                    {filter !== 'all' && (
                      <button 
                        onClick={() => setFilter('all')}
                        className="w-full py-2 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-bold hover:bg-slate-200 transition-all"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </Card>

                {/* Mini Calendar */}
                <Card title="Date Reference" icon={Calendar}>
                  <div className="p-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-800">May 2026</span>
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><ChevronLeft className="w-3.5 h-3.5" /></button>
                        <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><ChevronRight className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['S','M','T','W','T','F','S'].map((d, i) => (
                        <span key={`${d}-${i}`} className="text-[9px] font-extrabold text-slate-400">{d}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {Array.from({length: 31}).map((_, i) => {
                        const day = i + 1;
                        const isToday = day === 6; // Mocking today as May 6th
                        const hasReminder = [10, 15, 30].includes(day);
                        return (
                          <div 
                            key={i} 
                            onClick={() => setFilter(`date-2026-05-${day.toString().padStart(2, '0')}`)}
                            className={`
                              h-6 flex items-center justify-center text-[10px] rounded-lg cursor-pointer transition-all relative
                              ${isToday ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-100' : 
                                filter === `date-2026-05-${day.toString().padStart(2, '0')}` ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-100'}
                              ${hasReminder && !isToday && filter !== `date-2026-05-${day.toString().padStart(2, '0')}` ? 'border border-indigo-200 text-indigo-600 font-bold' : ''}
                            `}
                          >
                            {day}
                            {hasReminder && <div className={`absolute w-1 h-1 rounded-full bottom-0.5 ${isToday ? 'bg-white' : 'bg-indigo-600'}`} />}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        Scheduled Activity
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
