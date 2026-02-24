export type SOP = {
  id: string;
  title: string;
  department: string;
  documentType: string;
  date: string;
  author: string;
  content?: string;
  file_url?: string;
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  file_url?: string;
};

export type Course = {
  id: string;
  title: string;
  modules: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
};

export const sops: SOP[] = [
  {
    id: 'SOP-QA-001',
    title: 'Good Documentation Practices (GDP) in Manufacturing',
    department: 'Quality Assurance',
    documentType: 'Manual',
    date: '2026-01-15',
    author: 'Sarah Jenkins',
  },
  {
    id: 'SOP-QC-042',
    title: 'HPLC Equipment Calibration and Maintenance',
    department: 'Quality Control',
    documentType: 'Protocol',
    date: '2026-02-10',
    author: 'Dr. Alan Grant',
  },
  {
    id: 'SOP-MB-012',
    title: 'Environmental Monitoring of Grade A Cleanrooms',
    department: 'Microbiology',
    documentType: 'Checklist',
    date: '2026-02-18',
    author: 'Elena Rostova',
  },
  {
    id: 'SOP-PR-088',
    title: 'Aseptic Filling Operations and Media Fill Testing',
    department: 'Production',
    documentType: 'Protocol',
    date: '2025-11-20',
    author: 'Marcus Thorne',
  },
  {
    id: 'SOP-RA-005',
    title: 'Adverse Event Reporting and FDA Communication',
    department: 'Regulatory Affairs',
    documentType: 'Manual',
    date: '2026-02-22',
    author: 'Priya Patel',
  },
];

// Articles (Insights) are now loaded dynamically from Supabase via the store.

export const courses: Course[] = [
  {
    id: 'CRS-01',
    title: 'CGMP Fundamentals for New Hires',
    modules: 5,
    duration: '2.5 Hours',
    level: 'Beginner',
  },
  {
    id: 'CRS-02',
    title: 'Advanced Root Cause Analysis (CAPA)',
    modules: 8,
    duration: '4 Hours',
    level: 'Advanced',
  },
  {
    id: 'CRS-03',
    title: 'Cleanroom Behavior and Gowning',
    modules: 3,
    duration: '1.5 Hours',
    level: 'Intermediate',
  },
];
