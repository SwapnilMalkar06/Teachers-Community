'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Users, GraduationCap, Building, BookOpen, Plus, Trash2, Edit, RefreshCw, LogOut, CheckCircle, AlertCircle, FileText, Presentation, FileQuestion, UserPlus, Check, X, Clock, Key, Phone, Copy } from 'lucide-react';

interface TeacherItem {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  university: string;
  expertise: string;
  contactEmail: string;
  user?: { email: string; createdAt: string };
  _count: { subjects: number; resources: number; publications: number };
}

interface TeacherRequestItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  university: string;
  department: string;
  designation: string;
  expertise: string;
  note?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface StatsData {
  totalTeachers: number;
  totalStudents: number;
  totalSubjects: number;
  totalResources: number;
  notesCount: number;
  pptCount: number;
  questionBankCount: number;
  totalUniversities: number;
  universities: string[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [requests, setRequests] = useState<TeacherRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Teacher Modal Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    password: 'teacher123',
    university: 'Mumbai University',
    department: 'Computer Engineering',
    designation: 'Assistant Professor',
    expertise: 'Web Development, Artificial Intelligence',
  });
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Approved Teacher Callout state
  const [approvedTeacherInfo, setApprovedTeacherInfo] = useState<{ name: string; email: string; phone: string; defaultPassword?: string } | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, teachersRes, requestsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/teachers'),
        fetch('/api/teacher-requests'),
      ]);

      const statsJson = await statsRes.json();
      const teachersJson = await teachersRes.json();
      const requestsJson = await requestsRes.json();

      if (statsJson.success) setStats(statsJson.stats);
      if (teachersJson.success) setTeachers(teachersJson.teachers);
      if (requestsJson.success) setRequests(requestsJson.requests);
    } catch (err) {
      console.error('Fetch admin data error:', err);
      setError('Failed to connect to admin endpoints.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionSuccess(null);
    try {
      const res = await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeacher),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Teacher ${newTeacher.name} account created successfully!`);
        setShowAddModal(false);
        setNewTeacher({
          name: '',
          email: '',
          password: 'teacher123',
          university: 'Mumbai University',
          department: 'Computer Engineering',
          designation: 'Assistant Professor',
          expertise: 'Web Development, Artificial Intelligence',
        });
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to create teacher');
      }
    } catch (err) {
      alert('Error creating teacher account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveRequest = async (requestId: string, name: string) => {
    setActionSuccess(null);
    setApprovedTeacherInfo(null);
    try {
      const res = await fetch('/api/admin/teacher-requests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'APPROVE' }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Teacher request approved for ${name}!`);
        if (data.user) {
          setApprovedTeacherInfo({
            name,
            email: data.user.email,
            phone: data.phone || '+91 98765 43210',
            defaultPassword: data.defaultPassword || 'teacher123',
          });
        }
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to approve request');
      }
    } catch (err) {
      alert('Error approving teacher request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!confirm('Decline this teacher request?')) return;
    try {
      const res = await fetch('/api/admin/teacher-requests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'REJECT' }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess('Teacher request declined.');
        fetchDashboardData();
      }
    } catch (err) {
      alert('Error declining request');
    }
  };

  const handleDeleteTeacher = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from Teachers-Community?`)) return;
    try {
      const res = await fetch(`/api/admin/teachers?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Teacher ${name} removed.`);
        fetchDashboardData();
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (err) {
      alert('Delete request error');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center space-x-3">
        <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
        <span className="font-semibold text-sm">Loading Admin Management System...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[11px] font-bold tracking-wide uppercase mb-1">
                Level 1: System Admin Control
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Teachers-Community Admin Portal
              </h1>
              <p className="text-xs text-slate-400">
                Monitor platform growth, review incoming teacher join requests, and manage accounts.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-900/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Teacher</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Approved Teacher Callout Alert Box */}
        {approvedTeacherInfo && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-2 border-emerald-500/40 text-emerald-100 space-y-3 shadow-2xl animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <h3 className="text-base font-black text-white">Teacher Request Approved!</h3>
              </div>
              <button onClick={() => setApprovedTeacherInfo(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-500 text-[10px]">Approved Teacher</div>
                <div className="font-bold text-white">{approvedTeacherInfo.name}</div>
                <div className="text-[11px] text-sky-400 font-mono">{approvedTeacherInfo.email}</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-500 text-[10px]">Recipient Phone Number</div>
                <div className="font-bold text-white flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{approvedTeacherInfo.phone}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/40 text-center">
                <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Default Assigned Password</div>
                <div className="text-xl font-black text-emerald-300 font-mono">{approvedTeacherInfo.defaultPassword || 'teacher123'}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
              <span>Teacher can now go to <strong className="text-sky-400 font-mono">/login?role=teacher</strong> and log in with email and password <strong className="text-emerald-300 font-mono">{approvedTeacherInfo.defaultPassword || 'teacher123'}</strong>.</span>
              <a
                href={`/login?role=teacher`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shrink-0 flex items-center space-x-1"
              >
                <span>Open Teacher Login Page</span>
              </a>
            </div>
          </div>
        )}

        {/* Action Alert */}
        {actionSuccess && !approvedTeacherInfo && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-white">Dismiss</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-sky-400">
              <Users className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="text-3xl font-black text-white">{stats?.totalTeachers || 0}</div>
            <div className="text-xs text-slate-400 font-medium">Registered Teachers</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <UserPlus className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded">Pending</span>
            </div>
            <div className="text-3xl font-black text-white">{pendingRequests.length}</div>
            <div className="text-xs text-slate-400 font-medium">Teacher Join Requests</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-purple-400">
              <Building className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded">Verified</span>
            </div>
            <div className="text-3xl font-black text-white">{stats?.totalUniversities || 0}</div>
            <div className="text-xs text-slate-400 font-medium">Universities Covered</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">Uploaded</span>
            </div>
            <div className="text-3xl font-black text-white">{stats?.totalResources || 0}</div>
            <div className="text-xs text-slate-400 font-medium">Notes, PPTs & Q-Banks</div>
          </div>
        </div>

        {/* Section: Pending Teacher Join Requests */}
        {pendingRequests.length > 0 && (
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Pending Teacher Profile Requests ({pendingRequests.length})</h2>
              </div>
              <span className="text-xs text-amber-300 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Review & Approve Accounts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((req) => (
                <div key={req.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{req.name}</h3>
                      <div className="text-xs text-sky-400 font-medium">{req.designation} • {req.department}</div>
                      <div className="text-[11px] text-amber-400 font-semibold">{req.university}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{req.email} • {req.phone || '+91 98765 43210'}</div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-[11px] bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                    <strong>Expertise:</strong> {req.expertise}
                    {req.note && <div className="mt-1 text-slate-400 italic">&quot;{req.note}&quot;</div>}
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => handleApproveRequest(req.id, req.name)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Request</span>
                    </button>

                    <button
                      onClick={() => handleRejectRequest(req.id)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 font-bold text-xs transition-all border border-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teachers Management Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-sky-400" />
                <span>Teachers Directory Management</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Overview of all registered university teachers across the platform.
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center space-x-1 text-xs text-sky-400 hover:text-sky-300 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh List</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 rounded-l-xl">Teacher Name</th>
                  <th className="py-3.5 px-4">University & Dept</th>
                  <th className="py-3.5 px-4">Expertise Areas</th>
                  <th className="py-3.5 px-4 text-center">Resources Uploaded</th>
                  <th className="py-3.5 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-white">
                      <div>{teacher.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{teacher.designation}</div>
                      <div className="text-[10px] text-sky-400 font-mono">{teacher.contactEmail}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-200">{teacher.university}</div>
                      <div className="text-[11px] text-slate-400">{teacher.department}</div>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {teacher.expertise.split(',').map((exp, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px] font-medium">
                            {exp.trim()}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center font-mono">
                      <div className="inline-flex space-x-2">
                        <span className="bg-slate-800 px-2 py-1 rounded text-slate-200">
                          {teacher._count?.resources || 0} Files
                        </span>
                        <span className="bg-slate-800 px-2 py-1 rounded text-slate-400">
                          {teacher._count?.subjects || 0} Subjects
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id, teacher.fullName)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                        title="Delete Teacher"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-sky-400" />
                <span>Register New University Teacher</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Teacher Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Sharma"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="rajesh@teacherscommunity.com"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  value={newTeacher.password}
                  onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">University *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SPPU Pune"
                    value={newTeacher.university}
                    onChange={(e) => setNewTeacher({ ...newTeacher, university: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="Associate Professor"
                    value={newTeacher.designation}
                    onChange={(e) => setNewTeacher({ ...newTeacher, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="Data Science & AI"
                  value={newTeacher.department}
                  onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Expertise Tags (Comma-separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="Machine Learning, Python, Data Science"
                  value={newTeacher.expertise}
                  onChange={(e) => setNewTeacher({ ...newTeacher, expertise: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 shadow-md shadow-sky-900/30 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Teacher Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
