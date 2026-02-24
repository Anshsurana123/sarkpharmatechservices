import type { Metadata } from 'next';
import { supabase } from '@/utils/supabase/client';
import { LibraryDetailContent } from './LibraryDetailContent';

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
            title: 'Document Not Found | SOP Library | Sark Pharma Tech Services',
            description: 'The requested document could not be found in the SOP Library.',
        };
    }

    const description = data.content
        ? data.content.substring(0, 160).replace(/\n/g, ' ')
        : `Read the free text content of "${data.title}" — a GMP-compliant ${data.documentType} for ${data.department}. Browse the Sark Pharma Tech Services SOP Library.`;

    return {
        title: `${data.title} | Free SOP Library | Sark Pharma Tech Services`,
        description,
        openGraph: {
            title: `${data.title} | Sark Pharma Tech Services`,
            description,
            type: 'article',
        },
    };
}

export default function LibraryDetailPage({ params }: Props) {
    return <LibraryDetailContent params={params} />;
}
