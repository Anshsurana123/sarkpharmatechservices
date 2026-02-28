import { create } from 'zustand';
import { SOP } from './mockData';
import { supabase } from '@/utils/supabase/client';
import type { Session } from '@supabase/supabase-js';

export type Policy = {
    id: string;
    title: string;
    department: string;
    documentType: string;
    status: string;
    date: string;
    author: string;
    content?: string;
    file_url?: string;
    price?: number;
};

export type Insight = {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    read_time: string;
    file_url?: string;
};

export type Course = {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    level: string;
    modules: string[]; // Stored as JSON array in Supabase
    image_url?: string;
    files?: { name: string, url: string, type: string }[];
    created_at?: string;
};

export type BundleLink = {
    id: string;
    file_url: string;
    updated_at: string;
};

export type Department = {
    id: string;
    title: string;
    description: string;
    url: string;
    icon: string;
};

// No initial static mock data needed for departments

interface PharmaStore {
    sops: SOP[];
    policies: Policy[];
    protocols_reports: Policy[];
    checklists_formats: Policy[];
    departments: Department[];
    insights: Insight[];
    courses: Course[];
    bundleLinks: BundleLink[];
    session: Session | null;
    isInitialized: boolean;
    initialize: () => Promise<void>;
    addSop: (sop: Omit<SOP, 'id'>) => Promise<void>;
    addPolicy: (policy: Omit<Policy, 'id'>) => Promise<void>;
    addProtocolReport: (doc: Omit<Policy, 'id'>) => Promise<void>;
    addChecklistFormat: (doc: Omit<Policy, 'id'>) => Promise<void>;
    addDepartment: (dept: Omit<Department, 'id' | 'url'>) => Promise<void>;
    deleteSop: (id: string) => Promise<void>;
    deletePolicy: (id: string) => Promise<void>;
    deleteProtocolReport: (id: string) => Promise<void>;
    deleteChecklistFormat: (id: string) => Promise<void>;
    deleteDepartment: (id: string) => Promise<void>;
    addInsight: (insight: Omit<Insight, 'id'>) => Promise<void>;
    deleteInsight: (id: string) => Promise<void>;
    addCourse: (course: Omit<Course, 'id' | 'created_at'>) => Promise<void>;
    deleteCourse: (id: string) => Promise<void>;
    updateBundleLink: (id: string, file_url: string) => Promise<void>;
}

export const usePharmaStore = create<PharmaStore>((set, get) => ({
    sops: [],
    policies: [],
    protocols_reports: [],
    checklists_formats: [],
    departments: [],
    insights: [],
    courses: [],
    bundleLinks: [],
    session: null,
    isInitialized: false,

    initialize: async () => {
        if (get().isInitialized) return;

        try {
            // Try fetching from Supabase
            const { data: deptData, error: deptError } = await supabase.from('departments').select('*');
            const { data: sopData, error: sopError } = await supabase.from('sops').select('*');
            const { data: policyData } = await supabase.from('policies_presentations').select('*');
            const { data: protocolData } = await supabase.from('protocols_reports').select('*');
            const { data: checklistData } = await supabase.from('checklists_formats').select('*');
            const { data: insightData } = await supabase.from('insights').select('*').order('created_at', { ascending: false });
            const { data: courseData } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
            const { data: bundleData } = await supabase.from('bundle_links').select('*');

            // Initialize Auth Session
            const { data: { session: initialSession } } = await supabase.auth.getSession();

            // Set up Auth Listener
            supabase.auth.onAuthStateChange((_event, session) => {
                set({ session });
            });

            if (deptError || sopError) {
                console.warn('Supabase fetch failed.', deptError, sopError);
                set({ isInitialized: true, session: initialSession });
                return;
            }

            set({
                sops: sopData as SOP[],
                policies: (policyData as Policy[]) || [],
                protocols_reports: (protocolData as Policy[]) || [],
                checklists_formats: (checklistData as Policy[]) || [],
                departments: deptData as Department[],
                insights: (insightData as Insight[]) || [],
                courses: (courseData as Course[]) || [],
                bundleLinks: (bundleData as BundleLink[]) || [],
                session: initialSession,
                isInitialized: true
            });

        } catch (err) {
            console.error(err);
            set({ isInitialized: true });
        }
    },

    addSop: async (sop) => {
        const newSop = {
            ...sop,
            id: `SOP-${sop.department.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };

        try {
            const { error } = await supabase.from('sops').insert([newSop]);
            if (error) {
                console.error('Supabase Insert Error:', error);
                throw error;
            }

            set((state) => ({ sops: [...state.sops, newSop] }));
        } catch (e) {
            console.warn('Failed to insert SOP to Supabase.', e);
            throw e;
        }
    },

    addPolicy: async (policy) => {
        const newPolicy = {
            ...policy,
            id: `POL-${policy.department.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };

        try {
            const { error } = await supabase.from('policies_presentations').insert([newPolicy]);
            if (error) {
                console.error('Supabase Insert Error:', error);
                throw error;
            }

            set((state) => ({ policies: [...state.policies, newPolicy] }));
        } catch (e) {
            console.warn('Failed to insert Policy to Supabase.', e);
            throw e;
        }
    },

    addProtocolReport: async (doc) => {
        const newDoc = {
            ...doc,
            id: `PR-${doc.department.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };

        try {
            const { error } = await supabase.from('protocols_reports').insert([newDoc]);
            if (error) {
                console.error('Supabase Insert Error:', error);
                throw error;
            }

            set((state) => ({ protocols_reports: [...state.protocols_reports, newDoc] }));
        } catch (e) {
            console.warn('Failed to insert Protocol/Report to Supabase.', e);
            throw e;
        }
    },

    addChecklistFormat: async (doc) => {
        const newDoc = {
            ...doc,
            id: `CF-${doc.department.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };

        try {
            const { error } = await supabase.from('checklists_formats').insert([newDoc]);
            if (error) {
                console.error('Supabase Insert Error:', error);
                throw error;
            }

            set((state) => ({ checklists_formats: [...state.checklists_formats, newDoc] }));
        } catch (e) {
            console.warn('Failed to insert Checklist/Format to Supabase.', e);
            throw e;
        }
    },

    addDepartment: async (dept) => {
        const id = dept.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const newDept = { ...dept, id, url: `/departments/${id}` };

        try {
            const { error } = await supabase.from('departments').insert([newDept]);
            if (error) {
                console.error('Supabase Insert Error:', error);
                throw error;
            }

            set((state) => ({ departments: [...state.departments, newDept] }));
        } catch (e) {
            console.warn('Failed to insert Department to Supabase.', e);
            throw e;
        }
    },

    deleteSop: async (id) => {
        try {
            const { error } = await supabase.from('sops').delete().eq('id', id);
            if (error) {
                console.error('Supabase Delete Error:', error);
                throw error;
            }
            set((state) => ({ sops: state.sops.filter(sop => sop.id !== id) }));
        } catch (e) {
            console.warn('Failed to delete SOP from Supabase.', e);
        }
    },

    deletePolicy: async (id) => {
        try {
            const { error } = await supabase.from('policies_presentations').delete().eq('id', id);
            if (error) {
                console.error('Supabase Delete Error:', error);
                throw error;
            }
            set((state) => ({ policies: state.policies.filter(p => p.id !== id) }));
        } catch (e) {
            console.warn('Failed to delete Policy from Supabase.', e);
        }
    },

    deleteProtocolReport: async (id) => {
        try {
            const { error } = await supabase.from('protocols_reports').delete().eq('id', id);
            if (error) {
                console.error('Supabase Delete Error:', error);
                throw error;
            }
            set((state) => ({ protocols_reports: state.protocols_reports.filter(p => p.id !== id) }));
        } catch (e) {
            console.warn('Failed to delete Protocol/Report from Supabase.', e);
        }
    },

    deleteChecklistFormat: async (id) => {
        try {
            const { error } = await supabase.from('checklists_formats').delete().eq('id', id);
            if (error) {
                console.error('Supabase Delete Error:', error);
                throw error;
            }
            set((state) => ({ checklists_formats: state.checklists_formats.filter(p => p.id !== id) }));
        } catch (e) {
            console.warn('Failed to delete Checklist/Format from Supabase.', e);
        }
    },

    deleteDepartment: async (id) => {
        // Also delete associated SOPs from UI for consistency, 
        // in a real DB you'd use CASCADE DELETE on the foreign key
        try {
            const { error } = await supabase.from('departments').delete().eq('id', id);
            if (error) {
                console.error('Supabase Delete Error:', error);
                throw error;
            }
            // Supabase deletes it, now update local state
            set((state) => {
                const targetDept = state.departments.find(d => d.id === id);
                return {
                    departments: state.departments.filter(dept => dept.id !== id),
                    sops: state.sops.filter(sop => sop.department !== targetDept?.title)
                };
            });
        } catch (e) {
            console.warn('Failed to delete Department from Supabase.', e);
        }
    },

    addInsight: async (insight) => {
        const newInsight: Insight = {
            ...insight,
            id: `INS-${Date.now()}`
        };
        try {
            const { error } = await supabase.from('insights').insert([newInsight]);
            if (error) { console.error('Supabase Insert Error (insight):', error); throw error; }
            set((state) => ({ insights: [newInsight, ...state.insights] }));
        } catch (e) {
            console.warn('Failed to insert Insight to Supabase.', e);
            throw e;
        }
    },

    deleteInsight: async (id) => {
        try {
            const { error } = await supabase.from('insights').delete().eq('id', id);
            if (error) { console.error('Supabase Delete Error (insight):', error); throw error; }
            set((state) => ({ insights: state.insights.filter(i => i.id !== id) }));
        } catch (e) {
            console.warn('Failed to delete Insight from Supabase.', e);
        }
    },

    addCourse: async (course) => {
        const newCourse: Course = {
            ...course,
            id: `CRS-${Date.now()}`,
            created_at: new Date().toISOString()
        };
        try {
            const { error } = await supabase.from('courses').insert([newCourse]);
            if (error) {
                console.error('Supabase Insert Error (course):', JSON.stringify(error, null, 2), error);
                throw error;
            }
            set((state) => ({ courses: [newCourse, ...state.courses] }));
        } catch (e) {
            console.warn('Failed to insert Course to Supabase.', e);
            throw e;
        }
    },

    deleteCourse: async (id) => {
        try {
            const { error } = await supabase.from('courses').delete().eq('id', id);
            if (error) { console.error('Supabase Delete Error (course):', error); throw error; }
            set((state) => ({ courses: state.courses.filter(c => c.id !== id) }));
        } catch (e) {
            console.warn('Failed to delete Course from Supabase.', e);
        }
    },

    updateBundleLink: async (id, file_url) => {
        try {
            const { error } = await supabase
                .from('bundle_links')
                .upsert({ id, file_url, updated_at: new Date().toISOString() });

            if (error) { console.error('Supabase Upsert Error (bundle link):', error); throw error; }

            set((state) => {
                const existing = state.bundleLinks.find(b => b.id === id);
                if (existing) {
                    return { bundleLinks: state.bundleLinks.map(b => b.id === id ? { ...b, file_url, updated_at: new Date().toISOString() } : b) };
                } else {
                    return { bundleLinks: [...state.bundleLinks, { id, file_url, updated_at: new Date().toISOString() }] };
                }
            });
        } catch (e) {
            console.warn('Failed to update Bundle Link.', e);
        }
    }
}));
