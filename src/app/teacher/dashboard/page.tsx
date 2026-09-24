'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, BookOpen, Plus, Trash2, Edit, Save, LogOut, FileText, RefreshCw, CheckCircle, AlertCircle, PenTool, Eye, Clock, Upload, GraduationCap, Briefcase, Award, X, FileBadge, Calendar, ExternalLink } from 'lucide-react';
import BlogRichEditor, { compressImageFile } from '@/components/blog/BlogRichEditor';

export interface EducationData {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description?: string | null;
}

export interface ExperienceData {
  id: string;
  role: string;
  organization: string;
  period: string;
  description?: string | null;
}

export interface PublicationData {
  id: string;
  title: string;
  authors: string;
  journalOrConference: string;
  year: number;
  doi?: string | null;
  category: 'PHD_THESIS' | 'JOURNAL_PUBLICATION' | 'CONFERENCE_PAPER';
  pdfUrl?: string | null;
  publisher?: string | null;
}

export interface WorkshopData {
  id: string;
  title: string;
  type: 'FDP' | 'WORKSHOP' | 'SEMINAR' | 'STTP';
  role: 'ATTENDED' | 'ORGANIZED' | 'RESOURCE_PERSON';
  venue: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  certificateUrl?: string | null;
}

export interface CertificateData {
  id: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  credentialId?: string | null;
  credentialUrl?: string | null;
  imageUrl?: string | null;
}

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
  education?: EducationData[];
  experience?: ExperienceData[];
  publications?: PublicationData[];
  workshops?: WorkshopData[];
  certificates?: CertificateData[];
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
  const [activeTab, setActiveTab] = useState<'RESOURCES' | 'BLOGS' | 'PROFILE' | 'ACADEMIC_TIMELINES' | 'PUBLICATIONS' | 'WORKSHOPS_CERTIFICATES'>('BLOGS');

  // Education state
  const [showEduModal, setShowEduModal] = useState(false);
  const [savingEdu, setSavingEdu] = useState(false);
  const [eduForm, setEduForm] = useState({ id: '', degree: '', institution: '', year: '', description: '' });

  // Experience state
  const [showExpModal, setShowExpModal] = useState(false);
  const [savingExp, setSavingExp] = useState(false);
  const [expForm, setExpForm] = useState({ id: '', role: '', organization: '', period: '', description: '' });

  // Publication state
  const [showPubModal, setShowPubModal] = useState(false);
  const [savingPub, setSavingPub] = useState(false);
  const [pubForm, setPubForm] = useState({
    id: '',
    title: '',
    authors: '',
    journalOrConference: '',
    year: new Date().getFullYear(),
    doi: '',
    category: 'JOURNAL_PUBLICATION' as 'PHD_THESIS' | 'JOURNAL_PUBLICATION' | 'CONFERENCE_PAPER',
    pdfUrl: '',
    publisher: '',
  });

  // Workshop state
  const [showWrkModal, setShowWrkModal] = useState(false);
  const [savingWrk, setSavingWrk] = useState(false);
  const [wrkForm, setWrkForm] = useState({
    id: '',
    title: '',
    type: 'FDP' as 'FDP' | 'WORKSHOP' | 'SEMINAR' | 'STTP',
    role: 'ATTENDED' as 'ATTENDED' | 'ORGANIZED' | 'RESOURCE_PERSON',
    venue: '',
    startDate: '',
    endDate: '',
    description: '',
    certificateUrl: '',
  });

  // Certificate state
  const [showCertModal, setShowCertModal] = useState(false);
  const [savingCert, setSavingCert] = useState(false);
  const [certForm, setCertForm] = useState({
    id: '',
    title: '',
    issuingOrganization: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: '',
    imageUrl: '',
  });

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
  const [uploadingNativeFile, setUploadingNativeFile] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    resourceType: 'NOTES' as 'NOTES' | 'PPT' | 'QUESTION_BANK',
    subjectId: '',
    fileUrl: '',
    fileType: 'pdf',
  });
  const [uploadingResource, setUploadingResource] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingNativeFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.fileUrl) {
        setNewResource((prev) => ({
          ...prev,
          fileUrl: data.fileUrl,
          fileType: data.fileType || 'pdf',
        }));
      } else {
        alert(data.error || 'File upload failed');
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Failed to upload file');
    } finally {
      setUploadingNativeFile(false);
    }
  };

  const openCreateEduModal = () => {
    setEduForm({ id: '', degree: '', institution: '', year: '', description: '' });
    setShowEduModal(true);
  };

  const openEditEduModal = (item: EducationData) => {
    setEduForm({
      id: item.id,
      degree: item.degree,
      institution: item.institution,
      year: item.year,
      description: item.description || '',
    });
    setShowEduModal(true);
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEdu(true);
    try {
      const method = eduForm.id ? 'PUT' : 'POST';
      const res = await fetch('/api/teacher/education', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eduForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowEduModal(false);
        fetchTeacherProfile();
      } else {
        alert(data.error || 'Failed to save education entry');
      }
    } catch (err) {
      alert('Error saving education entry');
    } finally {
      setSavingEdu(false);
    }
  };

  const handleDeleteEdu = async (id: string, degree: string) => {
    if (!confirm(`Are you sure you want to delete education entry "${degree}"?`)) return;
    try {
      const res = await fetch(`/api/teacher/education?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchTeacherProfile();
      } else {
        alert(data.error || 'Failed to delete education entry');
      }
    } catch (err) {
      alert('Error deleting education entry');
    }
  };

  const openCreateExpModal = () => {
    setExpForm({ id: '', role: '', organization: '', period: '', description: '' });
    setShowExpModal(true);
  };

  const openEditExpModal = (item: ExperienceData) => {
    setExpForm({
      id: item.id,
      role: item.role,
      organization: item.organization,
      period: item.period,
      description: item.description || '',
    });
    setShowExpModal(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingExp(true);
    try {
      const method = expForm.id ? 'PUT' : 'POST';
      const res = await fetch('/api/teacher/experience', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowExpModal(false);
        fetchTeacherProfile();
      } else {
        alert(data.error || 'Failed to save experience entry');
      }
    } catch (err) {
      alert('Error saving experience entry');
    } finally {
      setSavingExp(false);
    }
  };

  const handleDeleteExp = async (id: string, role: string) => {
    if (!confirm(`Are you sure you want to delete work experience entry "${role}"?`)) return;
    try {
      const res = await fetch(`/api/teacher/experience?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchTeacherProfile();
      } else {
        alert(data.error || 'Failed to delete experience entry');
      }
    } catch (err) {
      alert('Error deleting experience entry');
    }
  };

  // Handlers for Publication
  const openCreatePubModal = () => {
    setPubForm({
      id: '',
      title: '',
      authors: profile?.fullName || '',
      journalOrConference: '',
      year: new Date().getFullYear(),
      doi: '',
      category: 'JOURNAL_PUBLICATION',
      pdfUrl: '',
      publisher: '',
    });
    setShowPubModal(true);
  };

  const openEditPubModal = (item: PublicationData) => {
    setPubForm({
      id: item.id,
      title: item.title,
      authors: item.authors,
      journalOrConference: item.journalOrConference,
      year: item.year,
      doi: item.doi || '',
      category: item.category,
      pdfUrl: item.pdfUrl || '',
      publisher: item.publisher || '',
    });
    setShowPubModal(true);
  };

  const handleSavePub = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPub(true);
    try {
      const method = pubForm.id ? 'PUT' : 'POST';
      const res = await fetch('/api/teacher/publications', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pubForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowPubModal(false);
        fetchTeacherProfile();
      } else {
        alert(data.error || 'Failed to save publication');
      }
    } catch (err) {
      alert('Error saving publication');
    } finally {
      setSavingPub(false);
    }
  };

  const handleDeletePub = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete publication "${title}"?`)) return;
    try {
      const res = await fetch(`/api/teacher/publications?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchTeacherProfile();
      } else {
        alert(data.error || 'Failed to delete publication');
      }
    } catch (err) {
      alert('Error deleting publication');
    }
  };

  // Handlers for Workshop
  const openCreateWrkModal = () => {
    const today = new Date().toISOString().split('T')[0];
    setWrkForm({
      id: '',
      title: '',
      type: 'FDP',
      role: 'ATTENDED',
      venue: '',
      startDate: today,
      endDate: '',
      description: '',
      certificateUrl: '',
    });
    setShowWrkModal(true);
  };

  const openEditWrkModal = (item: WorkshopData) => {
    setWrkForm({
      id: item.id,
      title: item.title,
      type: item.type,
      role: item.role,
      venue: item.venue,
      startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
      endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
      description: item.description || '',
      certificateUrl: item.certificateUrl || '',
    });
    setShowWrkModal(true);
  };

  const handleSaveWrk = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWrk(true);
    try {
      const method = wrkForm.id ? 'PUT' : 'POST';
      const res = await fetch('/api/teacher/workshops', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wrkForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowWrkModal(false);
        fetchTeacherProfile();
      } else {
        alert(data.error || 'Failed to save workshop/FDP entry');
      }
    } catch (err) {
      alert('Error saving workshop/FDP entry');
    } finally {
      setSavingWrk(false);
    }
  };

  const handleDeleteWrk = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete workshop/FDP entry "${title}"?`)) return;
    try {
      const res = await fetch(`/api/teacher/workshops?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchTeacherProfile();
      } else {
        alert(data.error || 'Failed to delete workshop/FDP entry');
      }
    } catch (err) {
      alert('Error deleting workshop/FDP entry');
    }
  };

  // Handlers for Certificate
  const openCreateCertModal = () => {
    const today = new Date().toISOString().split('T')[0];
    setCertForm({
      id: '',
      title: '',
      issuingOrganization: '',
      issueDate: today,
      credentialId: '',
      credentialUrl: '',
      imageUrl: '',
    });
    setShowCertModal(true);
  };

  const openEditCertModal = (item: CertificateData) => {
    setCertForm({
      id: item.id,
      title: item.title,
      issuingOrganization: item.issuingOrganization,
      issueDate: item.issueDate ? new Date(item.issueDate).toISOString().split('T')[0] : '',
      credentialId: item.credentialId || '',
      credentialUrl: item.credentialUrl || '',
      imageUrl: item.imageUrl || '',
    });
    setShowCertModal(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCert(true);
    try {
      const method = certForm.id ? 'PUT' : 'POST';
      const res = await fetch('/api/teacher/certificates', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowCertModal(false);
        fetchTeacherProfile();
      } else {
        alert(data.error || 'Failed to save certificate');
      }
    } catch (err) {
      alert('Error saving certificate');
    } finally {
      setSavingCert(false);
    }
  };

  const handleDeleteCert = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete certificate "${title}"?`)) return;
    try {
      const res = await fetch(`/api/teacher/certificates?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchTeacherProfile();
      } else {
        alert(data.error || 'Failed to delete certificate');
      }
    } catch (err) {
      alert('Error deleting certificate');
    }
  };

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

          <button
            onClick={() => setActiveTab('ACADEMIC_TIMELINES')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'ACADEMIC_TIMELINES'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Education & Work Experience ({profile.education?.length || 0} / {profile.experience?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('PUBLICATIONS')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'PUBLICATIONS'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileBadge className="w-4 h-4" />
            <span>Research Publications ({profile.publications?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('WORKSHOPS_CERTIFICATES')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'WORKSHOPS_CERTIFICATES'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>FDPs, Workshops & Certificates ({profile.workshops?.length || 0} / {profile.certificates?.length || 0})</span>
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

        {/* Tab 4: ACADEMIC TIMELINES (EDUCATION & WORK EXPERIENCE) */}
        {activeTab === 'ACADEMIC_TIMELINES' && (
          <div className="space-y-10">
            {/* Education Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-sky-400" />
                    <span>Education Qualifications</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Manage your degrees, university qualifications, and specialized academic achievements.
                  </p>
                </div>

                <button
                  onClick={openCreateEduModal}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-md shadow-sky-950 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Education Degree</span>
                </button>
              </div>

              {profile.education && profile.education.length > 0 ? (
                <div className="space-y-4">
                  {profile.education.map((item) => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-sky-500/40 transition-all">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-bold">
                            {item.year}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-white">{item.degree}</h3>
                        <p className="text-xs font-semibold text-slate-300">{item.institution}</p>
                        {item.description && (
                          <p className="text-xs text-slate-400 pt-1 leading-relaxed">{item.description}</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => openEditEduModal(item)}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 hover:text-white hover:bg-sky-600 transition-colors"
                          title="Edit Education"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteEdu(item.id, item.degree)}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                          title="Delete Education"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800/80 text-slate-400 text-xs">
                  No education qualifications added yet. Click &quot;Add Education Degree&quot; to populate your academic degrees.
                </div>
              )}
            </div>

            {/* Work Experience Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-amber-400" />
                    <span>Work & Career Experience</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Manage your academic appointments, teaching positions, and institution history.
                  </p>
                </div>

                <button
                  onClick={openCreateExpModal}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-md shadow-amber-950 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience Entry</span>
                </button>
              </div>

              {profile.experience && profile.experience.length > 0 ? (
                <div className="space-y-4">
                  {profile.experience.map((item) => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/40 transition-all">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">
                            {item.period}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-white">{item.role}</h3>
                        <p className="text-xs font-semibold text-slate-300">{item.organization}</p>
                        {item.description && (
                          <p className="text-xs text-slate-400 pt-1 leading-relaxed">{item.description}</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => openEditExpModal(item)}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:text-white hover:bg-amber-600 transition-colors"
                          title="Edit Experience"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteExp(item.id, item.role)}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                          title="Delete Experience"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800/80 text-slate-400 text-xs">
                  No work experience entries added yet. Click &quot;Add Experience Entry&quot; to populate your career timeline.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: RESEARCH PUBLICATIONS */}
        {activeTab === 'PUBLICATIONS' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileBadge className="w-5 h-5 text-sky-400" />
                  <span>Research Publications & Scholarly Papers</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Manage your journal articles, IEEE/Springer conference papers, and doctoral thesis publications.
                </p>
              </div>

              <button
                onClick={openCreatePubModal}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-md shadow-sky-950 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Research Paper</span>
              </button>
            </div>

            {profile.publications && profile.publications.length > 0 ? (
              <div className="space-y-4">
                {profile.publications.map((item) => (
                  <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-sky-500/40 transition-all">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          item.category === 'JOURNAL_PUBLICATION' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                          item.category === 'CONFERENCE_PAPER' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {item.category === 'JOURNAL_PUBLICATION' ? 'Journal' : item.category === 'CONFERENCE_PAPER' ? 'Conference' : 'PhD Thesis'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">{item.year}</span>
                        {item.publisher && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">{item.publisher}</span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                      <p className="text-xs text-sky-300 font-medium">Authors: {item.authors}</p>
                      <p className="text-xs text-slate-400">{item.journalOrConference}</p>
                      {item.doi && <p className="text-[11px] text-slate-500 font-mono">DOI: {item.doi}</p>}
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {item.pdfUrl && (
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 hover:text-white hover:bg-sky-600 transition-colors"
                          title="View PDF"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => openEditPubModal(item)}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 hover:text-white hover:bg-sky-600 transition-colors"
                        title="Edit Publication"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeletePub(item.id, item.title)}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                        title="Delete Publication"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800/80 text-slate-400 text-xs">
                No research publications added yet. Click &quot;Add Research Paper&quot; to populate your academic papers.
              </div>
            )}
          </div>
        )}

        {/* Tab 6: FDPs, WORKSHOPS & CERTIFICATES */}
        {activeTab === 'WORKSHOPS_CERTIFICATES' && (
          <div className="space-y-10">
            {/* Workshops & FDPs Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <span>FDPs, Workshops, Seminars & STTPs</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Manage events attended, organized, or delivered as a Resource Person.
                  </p>
                </div>

                <button
                  onClick={openCreateWrkModal}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-950 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Workshop / FDP</span>
                </button>
              </div>

              {profile.workshops && profile.workshops.length > 0 ? (
                <div className="space-y-4">
                  {profile.workshops.map((item) => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition-all">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
                            {item.type}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                            Role: {item.role}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(item.startDate).toLocaleDateString()} {item.endDate ? `– ${new Date(item.endDate).toLocaleDateString()}` : ''}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                        <p className="text-xs text-slate-300 font-medium">Venue: {item.venue}</p>
                        {item.description && <p className="text-xs text-slate-400 pt-1">{item.description}</p>}
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {item.certificateUrl && (
                          <a
                            href={item.certificateUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 hover:text-white hover:bg-indigo-600 transition-colors"
                            title="View Certificate PDF"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => openEditWrkModal(item)}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 hover:text-white hover:bg-indigo-600 transition-colors"
                          title="Edit Workshop"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteWrk(item.id, item.title)}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                          title="Delete Workshop"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800/80 text-slate-400 text-xs">
                  No workshops or FDP events added yet. Click &quot;Add Workshop / FDP&quot; to populate.
                </div>
              )}
            </div>

            {/* Certificates & Professional Credentials Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>Certificates & Professional Credentials</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Manage certifications, licensing credentials, and online course certificates (Coursera, NPTEL, AWS, etc.).
                  </p>
                </div>

                <button
                  onClick={openCreateCertModal}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-md shadow-amber-950 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Certificate</span>
                </button>
              </div>

              {profile.certificates && profile.certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.certificates.map((item) => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-amber-500/40 transition-all">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                            {item.issuingOrganization}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Issued: {new Date(item.issueDate).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                        {item.credentialId && (
                          <p className="text-[11px] text-slate-400 font-mono">Credential ID: {item.credentialId}</p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        {item.credentialUrl ? (
                          <a
                            href={item.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-amber-400 hover:underline flex items-center space-x-1"
                          >
                            <span>Verify Credential</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : <span />}

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditCertModal(item)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 hover:text-white hover:bg-amber-600 transition-colors"
                            title="Edit Certificate"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteCert(item.id, item.title)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                            title="Delete Certificate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800/80 text-slate-400 text-xs">
                  No professional certificates added yet. Click &quot;Add Certificate&quot; to populate.
                </div>
              )}
            </div>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select & Upload Local File (PDF / PPT) *</label>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
                />
                {uploadingNativeFile && (
                  <p className="text-[11px] text-sky-400 mt-1.5 font-semibold animate-pulse">Uploading binary file to server...</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">File URL (Auto-filled or External Link) *</label>
                <input
                  type="text"
                  required
                  placeholder="/uploads/file.pdf or https://example.com/file.pdf"
                  value={newResource.fileUrl}
                  onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:ring-2 focus:ring-sky-500 font-mono"
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

      {/* Education Modal */}
      {showEduModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-sky-400" />
                <span>{eduForm.id ? 'Edit Education Degree' : 'Add Education Degree'}</span>
              </h3>
              <button onClick={() => setShowEduModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdu} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Degree / Qualification Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ph.D. in Computer Engineering"
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">University / Institution *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University of Mumbai"
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Year / Period *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2021 – Present or 2013 – 2015"
                  value={eduForm.year}
                  onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Specialization (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Focus area, thesis topic, or academic honors..."
                  value={eduForm.description}
                  onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEduModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdu}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 shadow-md shadow-sky-900/30 disabled:opacity-50"
                >
                  {savingEdu ? 'Saving...' : 'Save Education Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Work Experience Modal */}
      {showExpModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                <span>{expForm.id ? 'Edit Work Experience' : 'Add Work Experience'}</span>
              </h3>
              <button onClick={() => setShowExpModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Designation / Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assistant Professor"
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Organization / Department *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Computer Engineering"
                  value={expForm.organization}
                  onChange={(e) => setExpForm({ ...expForm, organization: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Period / Duration *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2017 – Present (7+ Years)"
                  value={expForm.period}
                  onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role Description / Responsibilities (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Key responsibilities, courses taught, committee roles..."
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowExpModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingExp}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 shadow-md shadow-amber-900/30 disabled:opacity-50"
                >
                  {savingExp ? 'Saving...' : 'Save Experience Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Research Publication Modal */}
      {showPubModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <FileBadge className="w-5 h-5 text-sky-400" />
                <span>{pubForm.id ? 'Edit Research Paper' : 'Add Research Paper'}</span>
              </h3>
              <button onClick={() => setShowPubModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePub} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Paper Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adaptive Deep Reinforcement Learning for Cloud Task Scheduling"
                  value={pubForm.title}
                  onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Authors *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Ashwini Sawant, Dr. R. K. Sharma"
                  value={pubForm.authors}
                  onChange={(e) => setPubForm({ ...pubForm, authors: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Journal or Conference Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IEEE Transactions on Cloud Computing"
                  value={pubForm.journalOrConference}
                  onChange={(e) => setPubForm({ ...pubForm, journalOrConference: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={pubForm.category}
                    onChange={(e) => setPubForm({ ...pubForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="JOURNAL_PUBLICATION">Journal Publication</option>
                    <option value="CONFERENCE_PAPER">Conference Paper</option>
                    <option value="PHD_THESIS">PhD Thesis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    value={pubForm.year}
                    onChange={(e) => setPubForm({ ...pubForm, year: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">DOI (Optional)</label>
                  <input
                    type="text"
                    placeholder="10.1109/TCC.2024.3389102"
                    value={pubForm.doi}
                    onChange={(e) => setPubForm({ ...pubForm, doi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Publisher (Optional)</label>
                  <input
                    type="text"
                    placeholder="IEEE, Elsevier, Springer"
                    value={pubForm.publisher}
                    onChange={(e) => setPubForm({ ...pubForm, publisher: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">PDF Link URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/paper.pdf"
                  value={pubForm.pdfUrl}
                  onChange={(e) => setPubForm({ ...pubForm, pdfUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPubModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPub}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 shadow-md shadow-sky-900/30 disabled:opacity-50"
                >
                  {savingPub ? 'Saving...' : 'Save Research Paper'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workshop / FDP Modal */}
      {showWrkModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span>{wrkForm.id ? 'Edit Workshop / FDP' : 'Add Workshop / FDP'}</span>
              </h3>
              <button onClick={() => setShowWrkModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWrk} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Level FDP on Deep Learning Architectures"
                  value={wrkForm.title}
                  onChange={(e) => setWrkForm({ ...wrkForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Type *</label>
                <select
                  value={wrkForm.type}
                  onChange={(e) => setWrkForm({ ...wrkForm, type: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="FDP">Faculty Development Program (FDP)</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="SEMINAR">Seminar</option>
                  <option value="STTP">Short Term Training Program (STTP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Venue / Institution *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of CE, Mumbai University"
                  value={wrkForm.venue}
                  onChange={(e) => setWrkForm({ ...wrkForm, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={wrkForm.startDate}
                    onChange={(e) => setWrkForm({ ...wrkForm, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={wrkForm.endDate}
                    onChange={(e) => setWrkForm({ ...wrkForm, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Certificate PDF Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/certificate.pdf"
                  value={wrkForm.certificateUrl}
                  onChange={(e) => setWrkForm({ ...wrkForm, certificateUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Key topics learned or delivered..."
                  value={wrkForm.description}
                  onChange={(e) => setWrkForm({ ...wrkForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWrkModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingWrk}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-md shadow-indigo-950 disabled:opacity-50"
                >
                  {savingWrk ? 'Saving...' : 'Save Workshop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>{certForm.id ? 'Edit Certificate' : 'Add Certificate'}</span>
              </h3>
              <button onClick={() => setShowCertModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Certificate / Credential Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issuing Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services / NPTEL / Coursera"
                  value={certForm.issuingOrganization}
                  onChange={(e) => setCertForm({ ...certForm, issuingOrganization: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credential ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. AWS-839210"
                    value={certForm.credentialId}
                    onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Credential Verification URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://coursera.org/verify/..."
                  value={certForm.credentialUrl}
                  onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCert}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 shadow-md shadow-amber-950 disabled:opacity-50"
                >
                  {savingCert ? 'Saving...' : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
