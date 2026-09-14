'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, BookOpen, Plus, Trash2, Edit, Save, LogOut, FileText, RefreshCw, CheckCircle, AlertCircle, PenTool, Eye, Clock, Upload } from 'lucide-react';
import BlogRichEditor, { compressImageFile } from '@/components/blog/BlogRichEditor';

interface TeacherProfileData {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  university: string;
  expertise: string;
  bioText: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  subjects: Array<{ id: string; name: string; code: string }>;
  resources: Array<{
    id: string;
    title: string;
    description: string;
    resourceType: 'NOTES' | 'PPT' | 'QUESTION_BANK';
    fileUrl: string;
    uploadedAt: string;
    subject: { name: string; code: string };
  }>;
}

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string | null;
  isPublished: boolean;
  viewCount: number;
  estimatedReadingMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<TeacherProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'RESOURCES' | 'BLOGS' | 'PROFILE'>('BLOGS');

  // Teacher Blogs state
  const [blogs, setBlogs] = useState<BlogPostData[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPostData | null>(null);
  const [savingBlog, setSavingBlog] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [blogForm, setBlogForm] = useState({
    id: '',
    title: '',
    summary: '',
    content: '',
    coverImage: '',
    isPublished: true,
  });

  // Edit Profile Form state
  const [editForm, setEditForm] = useState({
    fullName: '',
    designation: '',
    department: '',
    university: '',
    expertise: '',
    bioText: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // New Resource Form state
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    resourceType: 'NOTES' as 'NOTES' | 'PPT' | 'QUESTION_BANK',
    subjectId: '',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'pdf',
  });
  const [uploadingResource, setUploadingResource] = useState(false);

  useEffect(() => {
    fetchTeacherProfile();
    fetchTeacherBlogs();
  }, []);

  const fetchTeacherProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/teacher/profile');
      const data = await res.json();
      if (data.success && data.teacher) {
        setProfile(data.teacher);
        setEditForm({
          fullName: data.teacher.fullName || '',
          designation: data.teacher.designation || '',
          department: data.teacher.department || '',
          university: data.teacher.university || '',
          expertise: data.teacher.expertise || '',
          bioText: data.teacher.bioText || '',
          contactEmail: data.teacher.contactEmail || '',
          contactPhone: data.teacher.contactPhone || '',
        });
        if (data.teacher.subjects && data.teacher.subjects.length > 0) {
          setNewResource((prev) => ({ ...prev, subjectId: data.teacher.subjects[0].id }));
        }
      } else {
        setError(data.error || 'Failed to load teacher profile. Please log in as a teacher.');
      }
    } catch (err) {
      console.error('Fetch teacher error:', err);
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const res = await fetch('/api/teacher/blogs');
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error('Fetch blogs error:', err);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const openCreateBlogModal = () => {
    setEditingBlog(null);
    setBlogForm({
      id: '',
      title: '',
      summary: '',
      content: '',
      coverImage: '',
      isPublished: true,
    });
    setShowBlogModal(true);
  };

  const openEditBlogModal = (post: BlogPostData) => {
    setEditingBlog(post);
    setBlogForm({
      id: post.id,
      title: post.title,
      summary: post.summary,
      content: post.content,
      coverImage: post.coverImage || '',
      isPublished: post.isPublished,
    });
    setShowBlogModal(true);
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1400, 0.85);
      setBlogForm((prev) => ({ ...prev, coverImage: compressedDataUrl }));
    } catch (err) {
      console.error('Cover upload error:', err);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title.trim() || !blogForm.content.trim()) {
      alert('Please enter both Title and Blog Content.');
      return;
    }
    setSavingBlog(true);
    try {
      const isEdit = Boolean(blogForm.id);
      const res = await fetch('/api/teacher/blogs', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowBlogModal(false);
        fetchTeacherBlogs();
      } else {
        alert(data.error || 'Failed to save blog post');
      }
    } catch (err) {
      alert('Error saving blog post');
    } finally {
      setSavingBlog(false);
    }
  };

  const handleDeleteBlog = async (blogId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the blog post "${title}"?`)) return;
    try {
      const res = await fetch(`/api/teacher/blogs?id=${blogId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchTeacherBlogs();
      } else {
        alert(data.error || 'Failed to delete blog post');
      }
    } catch (err) {
      alert('Error deleting blog post');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(null);
    try {
      const res = await fetch('/api/teacher/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setProfileSuccess('Teacher Profile updated successfully!');
        fetchTeacherProfile();
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (err) {
      alert('Error updating profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.subjectId) {
      alert('Please select or create a subject first');
      return;
    }
    setUploadingResource(true);
    try {
      const res = await fetch('/api/teacher/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddResource(false);
        setNewResource({
          title: '',
          description: '',
          resourceType: 'NOTES',
          subjectId: profile?.subjects[0]?.id || '',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          fileType: 'pdf',
        });
        fetchTeacherProfile();
      } else {
        alert(data.error || 'Failed to add resource');
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setUploadingResource(false);
    }
  };

  const handleDeleteResource = async (resourceId: string, title: string) => {
    if (!confirm(`Delete resource "${title}"?`)) return;
    try {
      const res = await fetch(`/api/teacher/resources?id=${resourceId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchTeacherProfile();
      } else {
        alert(data.error || 'Failed to delete resource');
      }
    } catch (err) {
      alert('Delete error');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center space-x-3">
        <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
        <span className="font-semibold text-sm">Loading Teacher Portal...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold">Teacher Access Required</h2>
          <p className="text-xs text-slate-400">{error || 'Please log in with a Teacher account.'}</p>
          <button
            onClick={() => router.push('/login?role=teacher')}
            className="px-6 py-2.5 rounded-xl bg-sky-600 font-bold text-xs hover:bg-sky-500 text-white"
          >
            Go to Teacher Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-[11px] font-bold tracking-wide uppercase mb-1">
                Level 2: Teacher Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {profile.fullName}
              </h1>
              <p className="text-xs text-slate-400">
                {profile.designation} • <span className="text-sky-400 font-semibold">{profile.university}</span> ({profile.department})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={openCreateBlogModal}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-900/30 transition-all"
            >
              <PenTool className="w-4 h-4" />
              <span>+ Write New Blog</span>
            </button>

            <button
              onClick={() => setShowAddResource(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-slate-700"
            >
              <Plus className="w-4 h-4 text-sky-400" />
              <span>Upload Resource</span>
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

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          
          <button
            onClick={() => setActiveTab('BLOGS')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'BLOGS'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>My Blogs & Articles ({blogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('RESOURCES')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'RESOURCES'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Teaching Resources ({profile.resources?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'PROFILE'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Edit Profile & Expertise</span>
          </button>
        </div>

        {/* Tab 1: MY BLOGS & ARTICLES */}
        {activeTab === 'BLOGS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-sky-400" />
                  <span>Your Published & Draft Blogs</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Write academic articles, study tips, or research notes. Use Calibri / Times New Roman fonts, formatting, and fit images anywhere in your blog!
                </p>
              </div>

              <button
                onClick={openCreateBlogModal}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-900/30 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Write Blog Post</span>
              </button>
            </div>

            {loadingBlogs ? (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold flex items-center justify-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                <span>Loading your blogs...</span>
              </div>
            ) : blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((post) => (
                  <div
                    key={post.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Status and Read stats */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            post.isPublished
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {post.isPublished ? '● Published' : '○ Draft'}
                        </span>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-sky-400" />
                            {post.estimatedReadingMinutes} min
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-sky-400" />
                            {post.viewCount} reads
                          </span>
                        </div>
                      </div>

                      {/* Title & Excerpt */}
                      <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">{post.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{post.summary}</p>

                      <div className="text-[11px] text-slate-500 font-mono">
                        Created: {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-sky-400 hover:underline inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Blog</span>
                      </a>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openEditBlogModal(post)}
                          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Blog"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(post.id, post.title)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Blog"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <PenTool className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-300">No Blogs Written Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Share your expertise with computer engineering students! Write articles with Calibri & Times New Roman fonts, underline/italic/bold styles, and fitted images.
                </p>
                <button
                  onClick={openCreateBlogModal}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-500 shadow-md shadow-sky-900/30"
                >
                  Write Your First Blog
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Teaching Resources */}
        {activeTab === 'RESOURCES' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Uploaded Academic Content</h2>
                <p className="text-xs text-slate-400">Manage Notes, PPT Slides, and Question Banks accessible to students.</p>
              </div>
            </div>

            {profile.resources && profile.resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.resources.map((res) => (
                  <div key={res.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          res.resourceType === 'NOTES' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          res.resourceType === 'PPT' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {res.resourceType === 'NOTES' ? 'Notes' : res.resourceType === 'PPT' ? 'PPT Presentation' : 'Question Bank'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(res.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white line-clamp-2">{res.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{res.description}</p>
                      
                      <div className="text-[11px] text-sky-400 font-medium pt-1">
                        Subject: {res.subject?.name || 'General'} ({res.subject?.code})
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-sky-400 hover:underline inline-flex items-center space-x-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Document</span>
                      </a>

                      <button
                        onClick={() => handleDeleteResource(res.id, res.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-300">No Teaching Resources Uploaded Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Upload your lecture notes, PPT presentations, or question banks for students to access.</p>
                <button
                  onClick={() => setShowAddResource(true)}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-500"
                >
                  Upload Your First Resource
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Edit Profile */}
        {activeTab === 'PROFILE' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-white">Teacher Profile Settings</h2>
              <p className="text-xs text-slate-400">Update your University name, designation, and Expertise keywords for student discovery.</p>
            </div>

            {profileSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">University / Institution</label>
                  <input
                    type="text"
                    required
                    value={editForm.university}
                    onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={editForm.designation}
                    onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specialized Expertise Areas (Comma-separated)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Web Technologies, Machine Learning, Data Structures"
                  value={editForm.expertise}
                  onChange={(e) => setEditForm({ ...editForm, expertise: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">Students search for teachers using these expertise tags.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Biography & Academic Summary</label>
                <textarea
                  rows={4}
                  value={editForm.bioText}
                  onChange={(e) => setEditForm({ ...editForm, bioText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={editForm.contactEmail}
                    onChange={(e) => setEditForm({ ...editForm, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editForm.contactPhone}
                    onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-3 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-500 shadow-lg shadow-sky-900/30 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Perfectly Sized & Responsive Write / Edit Blog Modal with Header & Footer Sticky Bar */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
            
            {/* Fixed Top Modal Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-900 shrink-0">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <PenTool className="w-5 h-5 text-sky-400" />
                <span>{editingBlog ? 'Edit Blog Post' : 'Compose New Blog Post'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowBlogModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-bold text-base transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Middle Form Content Area */}
            <form id="blogPostForm" onSubmit={handleSaveBlog} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Blog Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Understanding Binary Trees in Data Structures"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-bold text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Short Excerpt / Summary *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Brief summary of what students will learn from this article..."
                    value={blogForm.summary}
                    onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-semibold text-sky-300 mb-1 flex items-center justify-between">
                      <span>🖼️ Blog Header Cover Image</span>
                      {uploadingCover && <span className="text-amber-400 animate-pulse text-[10px]">Uploading...</span>}
                    </label>

                    {/* Local File Picker for Header Cover Image */}
                    <div className="space-y-1.5">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileUpload}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-sky-500/40 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
                      />
                      
                      <div className="text-[9px] text-slate-500 text-center font-bold uppercase tracking-wider">- OR PASTE IMAGE URL -</div>

                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={blogForm.coverImage.startsWith('data:image/') ? '[Local Laptop Image Selected]' : blogForm.coverImage}
                        onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {blogForm.coverImage && (
                    <div className="relative w-full h-16 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                      <img src={blogForm.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setBlogForm({ ...blogForm, coverImage: '' })}
                        className="absolute top-1 right-1 bg-slate-900/90 text-white rounded-full p-1 text-[10px] hover:bg-rose-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="isPublishedCheck"
                      checked={blogForm.isPublished}
                      onChange={(e) => setBlogForm({ ...blogForm, isPublished: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-sky-500 w-4 h-4"
                    />
                    <label htmlFor="isPublishedCheck" className="text-xs font-bold text-slate-300 cursor-pointer">
                      Publish immediately to Student Community
                    </label>
                  </div>
                </div>
              </div>

              {/* Custom Rich Text Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Blog Content Body *</span>
                  <span className="text-[10px] sm:text-[11px] text-sky-400 font-normal">
                    Calibri & Times New Roman | Bold, Italic, Underline | Laptop Image Fitting
                  </span>
                </label>

                <BlogRichEditor
                  value={blogForm.content}
                  onChange={(htmlContent) => setBlogForm({ ...blogForm, content: htmlContent })}
                />
              </div>

            </form>

            {/* Fixed Bottom Action Buttons Footer */}
            <div className="p-4 px-6 border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm flex items-center justify-end space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowBlogModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="blogPostForm"
                disabled={savingBlog || uploadingCover}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-bold hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-sky-900/30 disabled:opacity-50 transition-all"
              >
                {savingBlog ? 'Saving Article...' : editingBlog ? 'Update Blog' : 'Post Blog Article'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Upload Resource Modal */}
      {showAddResource && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-sky-400" />
                <span>Upload Resource for Students</span>
              </h3>
              <button onClick={() => setShowAddResource(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Module 1: Data Structures Notes"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resource Category *</label>
                <select
                  value={newResource.resourceType}
                  onChange={(e) => setNewResource({ ...newResource, resourceType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:ring-2 focus:ring-sky-500"
                >
                  <option value="NOTES">Lecture Notes (PDF)</option>
                  <option value="PPT">PPT Presentation Slides</option>
                  <option value="QUESTION_BANK">Question Bank & Exam Keys</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject *</label>
                <select
                  value={newResource.subjectId}
                  onChange={(e) => setNewResource({ ...newResource, subjectId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:ring-2 focus:ring-sky-500"
                >
                  {profile.subjects?.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resource Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of topics covered in this PDF/PPT file..."
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">File Download URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/file.pdf"
                  value={newResource.fileUrl}
                  onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddResource(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingResource}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 shadow-md shadow-sky-900/30 disabled:opacity-50"
                >
                  {uploadingResource ? 'Uploading...' : 'Publish Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
