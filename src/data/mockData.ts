export type SOP = {
  id: string;
  title: string;
  department: string;
  documentType: string;
  date: string;
  status: 'Draft' | 'Approved' | 'Under Review';
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
    status: 'Approved',
    author: 'Sarah Jenkins',
  },
  {
    id: 'SOP-QC-042',
    title: 'HPLC Equipment Calibration and Maintenance',
    department: 'Quality Control',
    documentType: 'Protocol',
    date: '2026-02-10',
    status: 'Approved',
    author: 'Dr. Alan Grant',
  },
  {
    id: 'SOP-MB-012',
    title: 'Environmental Monitoring of Grade A Cleanrooms',
    department: 'Microbiology',
    documentType: 'Checklist',
    date: '2026-02-18',
    status: 'Under Review',
    author: 'Elena Rostova',
  },
  {
    id: 'SOP-PR-088',
    title: 'Aseptic Filling Operations and Media Fill Testing',
    department: 'Production',
    documentType: 'Protocol',
    date: '2025-11-20',
    status: 'Approved',
    author: 'Marcus Thorne',
  },
  {
    id: 'SOP-RA-005',
    title: 'Adverse Event Reporting and FDA Communication',
    department: 'Regulatory Affairs',
    documentType: 'Manual',
    date: '2026-02-22',
    status: 'Draft',
    author: 'Priya Patel',
  },
];

export const articles: Article[] = [
  {
    id: 'ART-001',
    title: 'FDA Finalizes Guidance on AI in Drug Manufacturing',
    excerpt: 'The new guidance provides essential guardrails for implementing machine learning in the QA lifecycle.',
    date: '2026-02-20',
    category: 'Regulatory Updates',
    readTime: '5 min read',
  },
  {
    id: 'ART-002',
    title: 'Reducing False Positives in Endotoxin Testing',
    excerpt: 'A comprehensive review of the latest recombinant factor C (rFC) methods vs traditional LAL.',
    date: '2026-02-15',
    category: 'Microbiology',
    readTime: '8 min read',
  },
  {
    id: 'ART-003',
    title: 'Data Integrity in the Cloud Era: ALCOA+ Principles',
    excerpt: 'How modern pharmaceutical companies are securing their cloud QMS systems to ensure compliance.',
    date: '2026-02-10',
    category: 'Quality Assurance',
    readTime: '6 min read',
  },
  {
    id: 'ART-004',
    title: 'Supply Chain Resiliency Post-Pandemic',
    excerpt: 'Strategies for qualifying secondary API suppliers and mitigating high-risk bottlenecks.',
    date: '2026-01-28',
    category: 'Supply Chain',
    readTime: '7 min read',
  },
  {
    id: 'ART-005',
    title: 'Next-Gen Spectrophotometry in Quality Control',
    excerpt: 'Advancements in automated sample prep and their impact on batch release times.',
    date: '2026-01-15',
    category: 'Quality Control',
    readTime: '4 min read',
  },
];

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
