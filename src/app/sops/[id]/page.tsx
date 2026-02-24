import type { Metadata } from 'next';
import { supabase } from '@/utils/supabase/client';
import { SOPDetailContent } from './SOPDetailContent';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const { data } = await supabase
        .from('sops')
        .select('title, department, content, documentType')
        .eq('id', id)
        .single();

    if (!data) {
        return {
            title: 'SOP Not Found | Sark Pharma Tech Services',
            description: 'The requested SOP document could not be found.',
        };
    }

    const description = data.content
        ? data.content.substring(0, 160).replace(/\n/g, ' ')
        : `${data.title} — GMP-compliant ${data.documentType} for the ${data.department} department. Purchase the editable MS Word version from Sark Pharma Tech Services.`;

    return {
        title: `${data.title} | SOP Database | Sark Pharma Tech Services`,
        description,
        openGraph: {
            title: `${data.title} | Sark Pharma Tech Services`,
            description,
            type: 'article',
        },
    };
}

export default function SOPDetailPage({ params }: Props) {
    return <SOPDetailContent params={params} />;
}
