import { create } from 'zustand';
import { sops as initialSops, SOP } from './mockData';
import { supabase } from '@/utils/supabase/client';
import type { Session } from '@supabase/supabase-js';

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
    session: Session | null;
    isInitialized: boolean;
    initialize: () => Promise<void>;
    addSop: (sop: Omit<SOP, 'id'>) => Promise<void>;
    addDepartment: (dept: Omit<Department, 'id' | 'url'>) => Promise<void>;
    deleteSop: (id: string) => Promise<void>;
    deleteDepartment: (id: string) => Promise<void>;
}

export const usePharmaStore = create<PharmaStore>((set, get) => ({
    sops: [],
    departments: [],
    session: null,
    isInitialized: false,

    initialize: async () => {
        if (get().isInitialized) return;

        try {
            // Try fetching from Supabase
            const { data: deptData, error: deptError } = await supabase.from('departments').select('*');
            const { data: sopData, error: sopError } = await supabase.from('sops').select('*');

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
    }
}));
