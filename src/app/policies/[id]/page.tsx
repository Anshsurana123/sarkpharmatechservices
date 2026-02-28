import type { Metadata } from 'next';
import { supabase } from '@/utils/supabase/client';
import { PolicyDetailContent } from './PolicyDetailContent';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const { data } = await supabase
        .from('policies_presentations')
        .select('title, department, content, documentType')
        .eq('id', id)
        .single();

    if (!data) {
        return {
            title: 'Policy Not Found | Sark Pharma Tech Services',
            description: 'The requested policy or presentation could not be found.',
        };
    }

    const description = data.content
        ? data.content.substring(0, 160).replace(/\n/g, ' ')
        : `${data.title} — GMP-compliant ${data.documentType} for the ${data.department} department. Purchase the editable MS Word version from Sark Pharma Tech Services.`;

    return {
        title: `${data.title} | Policies & Presentations | Sark Pharma Tech Services`,
        description,
        openGraph: {
            title: `${data.title} | Sark Pharma Tech Services`,
            description,
            type: 'article',
        },
    };
}

export default function PolicyDetailPage({ params }: Props) {
    return <PolicyDetailContent params={params} />;
}
