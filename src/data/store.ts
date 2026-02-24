import { create } from 'zustand';
import { SOP } from './mockData';
import { supabase } from '@/utils/supabase/client';
import type { Session } from '@supabase/supabase-js';

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
    departments: Department[];
    insights: Insight[];
    courses: Course[];
    session: Session | null;
    isInitialized: boolean;
    initialize: () => Promise<void>;
    addSop: (sop: Omit<SOP, 'id'>) => Promise<void>;
    addDepartment: (dept: Omit<Department, 'id' | 'url'>) => Promise<void>;
    deleteSop: (id: string) => Promise<void>;
    deleteDepartment: (id: string) => Promise<void>;
    addInsight: (insight: Omit<Insight, 'id'>) => Promise<void>;
    deleteInsight: (id: string) => Promise<void>;
    addCourse: (course: Omit<Course, 'id' | 'created_at'>) => Promise<void>;
    deleteCourse: (id: string) => Promise<void>;
}

export const usePharmaStore = create<PharmaStore>((set, get) => ({
    sops: [],
    departments: [],
    insights: [],
    courses: [],
    session: null,
    isInitialized: false,

    initialize: async () => {
        if (get().isInitialized) return;

        try {
            // Try fetching from Supabase
            const { data: deptData, error: deptError } = await supabase.from('departments').select('*');
            const { data: sopData, error: sopError } = await supabase.from('sops').select('*');
            const { data: insightData } = await supabase.from('insights').select('*').order('created_at', { ascending: false });
            const { data: courseData } = await supabase.from('courses').select('*').order('created_at', { ascending: false });

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
                departments: deptData as Department[],
                insights: (insightData as Insight[]) || [],
                courses: (courseData as Course[]) || [],
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
            if (error) { console.error('Supabase Insert Error (course):', error); throw error; }
            set((state) => ({ courses: [newCourse, ...state.courses] }));
        } catch (e) {
            console.warn('Failed to insert Course to Supabase.', e);
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
    }
}));
