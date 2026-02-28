import type { Metadata } from 'next';
import { supabase } from '@/utils/supabase/client';
import { PresentationDetailContent } from './PresentationDetailContent';

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
            title: 'Presentation Not Found | Sark Pharma Tech Services',
            description: 'The requested presentation could not be found.',
        };
    }

    const description = data.content
        ? data.content.substring(0, 160).replace(/\n/g, ' ')
        : `${data.title} — GMP-compliant training presentation for the ${data.department} department. Purchase the editable format from Sark Pharma Tech Services.`;

    return {
        title: `${data.title} | Presentations | Sark Pharma Tech Services`,
        description,
        openGraph: {
            title: `${data.title} | Sark Pharma Tech Services`,
            description,
            type: 'article',
        },
    };
}

export default function PresentationDetailPage({ params }: Props) {
    return <PresentationDetailContent params={params} />;
}
