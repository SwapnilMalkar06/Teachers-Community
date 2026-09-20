import React from 'react';
import { prisma } from '@/lib/prisma';
import BioHeader from '@/components/about/BioHeader';
import EducationTimeline from '@/components/about/EducationTimeline';
import ExperienceTimeline from '@/components/about/ExperienceTimeline';
import ExpertiseGrid from '@/components/about/ExpertiseGrid';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  let profileRecord = null;
  try {
    profileRecord = await prisma.teacherProfile.findFirst({
      include: {
        education: { orderBy: { createdAt: 'desc' } },
        experience: { orderBy: { createdAt: 'desc' } },
      },
    });
  } catch (err) {
    console.error("Database connection warning during build/render:", err);
  }

  const profile = profileRecord || {
    fullName: 'Prof. Ashwini Sawant',
    designation: 'Assistant Professor',
    department: 'Department of Computer Engineering',
    institution: 'Engineering Institute',
    heroTitle: 'Educator, Researcher & Academic Mentor',
    heroSubtitle: 'Specializing in Computer Networks, Data Structures, Distributed Systems, and Machine Learning.',
    profileImageUrl: '/images/profile.png',
    bioText: 'Prof. Ashwini Sawant has over 12+ years of academic teaching experience in Computer Engineering. She has guided numerous undergraduate and postgraduate research projects, published research papers in reputed international journals, and organized national-level FDPs and workshops. Her focus areas include Cloud Computing, Artificial Intelligence, and Algorithmic System Optimization.',
    phdSummary: 'Pursuing PhD research focused on Machine Learning-driven Dynamic Load Balancing in Distributed Cloud Frameworks.',
    officeAddress: 'Room 402, Academic Block A, Department of Computer Engineering',
    contactEmail: 'ashwini.sawant@example.com',
    contactPhone: '+91 98765 43210',
  };

  // 2. Education Data (Dynamic with static fallback)
  const defaultEducation = [
    {
      id: 'edu-1',
      degree: 'Ph.D. in Computer Engineering (Pursuing)',
      institution: 'Mumbai University / Technical University',
      year: '2021 – Present',
      description: 'Focus area: Machine Learning-based Resource Allocation & Load Balancing in Cloud Systems.',
    },
    {
      id: 'edu-2',
      degree: 'M.E. / M.Tech in Computer Engineering',
      institution: 'VJT Institute of Technology / University Department',
      year: '2013 – 2015',
      description: 'First Class with Distinction. Specialization in Computer Networks & Distributed Systems.',
    },
    {
      id: 'edu-3',
      degree: 'B.E. / B.Tech in Computer Engineering',
      institution: 'Saraswati College of Engineering / University of Mumbai',
      year: '2008 – 2012',
      description: 'First Class Honors. Capstone Project: Distributed P2P File Management System.',
    },
  ];

  const educationList = (profileRecord?.education && profileRecord.education.length > 0)
    ? profileRecord.education.map(e => ({
        id: e.id,
        degree: e.degree,
        institution: e.institution,
        year: e.year,
        description: e.description || '',
      }))
    : defaultEducation;

  // 3. Experience Data (Dynamic with static fallback)
  const defaultExperience = [
    {
      id: 'exp-1',
      role: 'Assistant Professor',
      organization: 'Department of Computer Engineering',
      period: '2017 – Present (7+ Years)',
      description: 'Teaching UG/PG courses including Data Structures, Computer Networks, and Distributed Systems. Department NAAC/NBA Coordinator and Student Project Mentor.',
    },
    {
      id: 'exp-2',
      role: 'Senior Lecturer',
      organization: 'Department of Information Technology',
      period: '2014 – 2017 (3 Years)',
      description: 'Delivered lectures, supervised computer network laboratories, and organized departmental technical symposiums.',
    },
    {
      id: 'exp-3',
      role: 'Lecturer & Academic Counsellor',
      organization: 'Faculty of Engineering & Technology',
      period: '2012 – 2014 (2 Years)',
      description: 'Conducted foundation programming labs in C/C++ and supervised first-year engineering students.',
    },
  ];

  const experienceList = (profileRecord?.experience && profileRecord.experience.length > 0)
    ? profileRecord.experience.map(x => ({
        id: x.id,
        role: x.role,
        organization: x.organization,
        period: x.period,
        description: x.description || '',
      }))
    : defaultExperience;

  // 4. Skills & Domains
  const expertiseCategories = [
    {
      title: 'Core Teaching Subjects',
      skills: ['Data Structures & Algorithms', 'Computer Networks', 'Distributed Systems', 'Operating Systems', 'Object Oriented Programming (C++/Java)'],
    },
    {
      title: 'Research Focus Areas',
      skills: ['Cloud Computing', 'Machine Learning in Systems', 'Algorithmic Optimization', 'Network Security & IPv6', 'Resource Scheduling'],
    },
    {
      title: 'Technical Stack & Tools',
      skills: ['Python', 'C / C++', 'Java', 'Linux / Shell Scripting', 'AWS Cloud & Docker', 'Cisco Packet Tracer', 'MATLAB / NS2'],
    },
    {
      title: 'Academic Responsibilities',
      skills: ['NAAC & NBA Committee Member', 'UG / PG Project Guide', 'Departmental Exam Coordinator', 'Technical Event Convenor'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Bio Header */}
      <BioHeader profile={profile} />

      {/* Education Timeline */}
      <EducationTimeline educationList={educationList} />

      {/* Career Experience Timeline */}
      <ExperienceTimeline experienceList={experienceList} />

      {/* Subject & Skill Expertise Grid */}
      <ExpertiseGrid categories={expertiseCategories} />
    </div>
  );
}
