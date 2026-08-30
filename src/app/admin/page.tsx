'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  LogOut, 
  BarChart3, 
  User, 
  BookOpen, 
  Award, 
  FileText, 
  Camera, 
  Mail, 
  Plus, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  FileCheck,
  Video,
  Presentation,
  HelpCircle,
  Clock
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'teaching' | 'research' | 'credentials' | 'blog' | 'inbox'>('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Modal State
  const [modalType, setModalType] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Load Admin Data
  const loadDashboardData = async () => {
    try {
      // Check auth
      const authRes = await fetch('/api/admin/auth');
      const authJson = await authRes.json();
      if (!authJson.isAuthenticated) {
        router.push('/admin/login');
        return;
      }

      // Fetch all data
      const [homeRes, teachingRes, researchRes, credRes, actRes, blogRes] = await Promise.all([
        fetch('/api/home'),
        fetch('/api/teaching/resources'),
        fetch('/api/research'),
        fetch('/api/credentials'),
        fetch('/api/activities'),
        fetch('/api/blog'),
      ]);

      const homeData = await homeRes.json();
      const teachingData = await teachingRes.json();
      const researchData = await researchRes.json();
      const credData = await credRes.json();
      const actData = await actRes.json();
      const blogData = await blogRes.json();

      setData({
        profile: homeData.data?.profile,
        stats: homeData.data?.stats,
        subjects: teachingData.data?.subjects || [],
        resources: teachingData.data?.resources || [],
        videos: teachingData.data?.videos || [],
        publications: researchData.data?.publications || [],
        fdps: credData.data?.fdps || [],
        certificates: credData.data?.certificates || [],
        activities: actData.data?.activities || [],
        gallery: actData.data?.gallery || [],
        blogs: blogData.data || [],
      });
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const handleDelete = async (entity: string, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${entity}?`)) return;
    try {
      const res = await fetch(`/api/admin/crud?entity=${entity}&id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        loadDashboardData();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await fetch('/api/admin/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: modalType, data: formData }),
      });
      const json = await res.json();
      if (json.success) {
        setModalType(null);
        setFormData({});
        loadDashboardData();
      } else {
        alert(json.error || 'Failed to save');
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="flex items-center space-x-3 text-sky-400 font-bold">
          <Sparkles className="w-6 h-6 animate-spin" />
          <span>Loading Admin Control Center...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight block leading-none">
                Prof. Ashwini Sawant Admin Portal
              </span>
              <span className="text-xs text-sky-400 font-medium block mt-1">
                Content Management & Analytics System
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white font-bold text-xs transition-all border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 overflow-x-auto py-2">
            {[
              { id: 'overview', label: 'Overview & Analytics', icon: BarChart3 },
              { id: 'profile', label: 'Profile & Home', icon: User },
              { id: 'teaching', label: 'Teaching Resources', icon: BookOpen },
              { id: 'research', label: 'Research & Papers', icon: Award },
              { id: 'credentials', label: 'FDPs & Certificates', icon: FileCheck },
              { id: 'blog', label: 'Blog & Gallery', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-sky-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase">Total Blog Reads</div>
                <div className="text-3xl font-black text-slate-900">
                  {data.blogs.reduce((acc: number, b: any) => acc + (b.viewCount || 0), 0)}
                </div>
                <div className="text-xs text-sky-600 font-semibold">Across all articles</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase">Reader Engagement</div>
                <div className="text-3xl font-black text-indigo-700">
                  {Math.round(data.blogs.reduce((acc: number, b: any) => acc + (b.totalEngagementSeconds || 0), 0) / 60)} mins
                </div>
                <div className="text-xs text-indigo-600 font-semibold">Active reading time</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase">Teaching Resources</div>
                <div className="text-3xl font-black text-emerald-700">{data.resources.length}</div>
                <div className="text-xs text-emerald-600 font-semibold">Notes, PPTs & Q-Banks</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase">Publications</div>
                <div className="text-3xl font-black text-amber-700">{data.publications.length}</div>
                <div className="text-xs text-amber-600 font-semibold">Journals & Conferences</div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <span>Quick Teacher Actions</span>
              </h3>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { setModalType('resource'); setFormData({ resourceType: 'NOTES' }); }}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-700 text-white font-bold text-xs hover:bg-sky-800 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload PDF Notes</span>
                </button>

                <button
                  onClick={() => { setModalType('video'); setFormData({}); }}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-700 text-white font-bold text-xs hover:bg-indigo-800 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Video Lecture</span>
                </button>

                <button
                  onClick={() => { setModalType('publication'); setFormData({ category: 'JOURNAL_PUBLICATION' }); }}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Publication</span>
                </button>

                <button
                  onClick={() => { setModalType('blog'); setFormData({ isPublished: true }); }}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Blog Post</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & HOME EDITOR */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Edit Teacher Profile & Home Section
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setModalType('profile');
                handleModalSubmit(e);
              }}
              className="space-y-4 text-xs font-medium"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    defaultValue={data.profile?.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Designation</label>
                  <input
                    type="text"
                    defaultValue={data.profile?.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Department & Institution</label>
                <input
                  type="text"
                  defaultValue={data.profile?.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Hero Subtitle</label>
                <textarea
                  rows={2}
                  defaultValue={data.profile?.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Bio</label>
                <textarea
                  rows={4}
                  defaultValue={data.profile?.bioText}
                  onChange={(e) => setFormData({ ...formData, bioText: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="px-6 py-3 rounded-xl bg-sky-700 text-white font-bold text-xs hover:bg-sky-800 transition-all shadow-sm"
              >
                {submitLoading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: TEACHING CMS */}
        {activeTab === 'teaching' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Manage Subjects ({data.subjects.length})</h3>
                <button
                  onClick={() => { setModalType('subject'); setFormData({}); }}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sky-700 text-white font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subject</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.subjects.map((sub: any) => (
                  <div key={sub.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-extrabold">{sub.code}</span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{sub.name}</h4>
                      <p className="text-xs text-slate-500">{sub.semester}</p>
                    </div>
                    <button
                      onClick={() => handleDelete('subject', sub.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources Table */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Uploaded Teaching Files ({data.resources.length})</h3>
                <button
                  onClick={() => { setModalType('resource'); setFormData({ resourceType: 'NOTES' }); }}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sky-700 text-white font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add File / Notes</span>
                </button>
              </div>

              <div className="space-y-2">
                {data.resources.map((res: any) => (
                  <div key={res.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] uppercase">{res.resourceType}</span>
                      <span className="ml-2 font-bold text-slate-900">{res.title}</span>
                      <span className="ml-2 text-slate-400">({res.subject?.code})</span>
                    </div>
                    <button
                      onClick={() => handleDelete('resource', res.id)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RESEARCH CMS */}
        {activeTab === 'research' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Manage Publications ({data.publications.length})</h3>
              <button
                onClick={() => { setModalType('publication'); setFormData({ category: 'JOURNAL_PUBLICATION' }); }}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-700 text-white font-bold text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Publication</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.publications.map((pub: any) => (
                <div key={pub.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-extrabold text-[10px] uppercase">{pub.category}</span>
                      <span className="font-bold text-slate-500">{pub.year}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{pub.title}</h4>
                    <p className="text-slate-500">{pub.journalOrConference}</p>
                  </div>
                  <button
                    onClick={() => handleDelete('publication', pub.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CREDENTIALS CMS */}
        {activeTab === 'credentials' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Manage FDPs & Workshops ({data.fdps.length})</h3>
              <button
                onClick={() => { setModalType('fdp'); setFormData({ type: 'FDP', role: 'ATTENDED' }); }}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sky-700 text-white font-bold text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add FDP / Workshop</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.fdps.map((fdp: any) => (
                <div key={fdp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px] uppercase">{fdp.type}</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{fdp.title}</h4>
                    <p className="text-slate-500">Venue: {fdp.venue}</p>
                  </div>
                  <button
                    onClick={() => handleDelete('fdp', fdp.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: BLOG CMS */}
        {activeTab === 'blog' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Manage Blog Posts ({data.blogs.length})</h3>
              <button
                onClick={() => { setModalType('blog'); setFormData({ isPublished: true, estimatedReadingMinutes: 3 }); }}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>New Blog Post</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.blogs.map((b: any) => (
                <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{b.title}</h4>
                    <p className="text-slate-500">Views: {b.viewCount} | Reading Time: {b.estimatedReadingMinutes} mins</p>
                  </div>
                  <button
                    onClick={() => handleDelete('blog', b.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* UNIVERSAL CRUD FORM MODAL */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 uppercase">
              Add New {modalType}
            </h3>

            <form onSubmit={handleModalSubmit} className="space-y-3 text-xs font-medium">
              {modalType === 'subject' && (
                <>
                  <div>
                    <label className="block font-bold">Subject Code *</label>
                    <input type="text" required placeholder="CS301" onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                  <div>
                    <label className="block font-bold">Subject Name *</label>
                    <input type="text" required placeholder="Data Structures" onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                  <div>
                    <label className="block font-bold">Semester</label>
                    <input type="text" placeholder="Semester III" onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                </>
              )}

              {modalType === 'resource' && (
                <>
                  <div>
                    <label className="block font-bold">Subject *</label>
                    <select required onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <option value="">Select Subject</option>
                      {data.subjects.map((s: any) => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold">Title *</label>
                    <input type="text" required placeholder="Module 1 Notes PDF" onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                  <div>
                    <label className="block font-bold">Resource Type</label>
                    <select onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <option value="NOTES">Notes</option>
                      <option value="PPT">PPT</option>
                      <option value="QUESTION_BANK">Question Bank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold">File URL / Download Link</label>
                    <input type="text" placeholder="https://..." onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                </>
              )}

              {modalType === 'video' && (
                <>
                  <div>
                    <label className="block font-bold">Subject *</label>
                    <select required onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <option value="">Select Subject</option>
                      {data.subjects.map((s: any) => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold">Video Title *</label>
                    <input type="text" required placeholder="Lecture 1: Intro to Trees" onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                  <div>
                    <label className="block font-bold">YouTube URL *</label>
                    <input type="text" required placeholder="https://www.youtube.com/watch?v=..." onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                </>
              )}

              {modalType === 'publication' && (
                <>
                  <div>
                    <label className="block font-bold">Paper Title *</label>
                    <input type="text" required placeholder="Cloud Optimization Paper" onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                  <div>
                    <label className="block font-bold">Authors *</label>
                    <input type="text" required placeholder="Prof. Ashwini Sawant, et al." onChange={(e) => setFormData({ ...formData, authors: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                  <div>
                    <label className="block font-bold">Journal or Conference Name *</label>
                    <input type="text" required placeholder="IEEE Transactions..." onChange={(e) => setFormData({ ...formData, journalOrConference: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                  <div>
                    <label className="block font-bold">Year</label>
                    <input type="number" defaultValue={2024} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                  <div>
                    <label className="block font-bold">DOI Link</label>
                    <input type="text" placeholder="10.1109/..." onChange={(e) => setFormData({ ...formData, doi: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                </>
              )}

              {modalType === 'blog' && (
                <>
                  <div>
                    <label className="block font-bold">Article Title *</label>
                    <input type="text" required placeholder="Exam Tips for Computer Science" onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                  <div>
                    <label className="block font-bold">Summary *</label>
                    <textarea rows={2} required onChange={(e) => setFormData({ ...formData, summary: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                  <div>
                    <label className="block font-bold">Full Article Content *</label>
                    <textarea rows={5} required onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200" />
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2 pt-3">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 py-2.5 rounded-xl bg-sky-700 text-white font-bold text-xs hover:bg-sky-800"
                >
                  {submitLoading ? 'Saving...' : 'Save Record'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
