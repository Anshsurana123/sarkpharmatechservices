import type { Metadata } from 'next';
import { supabase } from '@/utils/supabase/client';
import { InsightDetailContent } from './InsightDetailContent';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const { data } = await supabase
        .from('insights')
        .select('title, excerpt, category')
        .eq('id', id)
        .single();

    if (!data) {
        return {
            title: 'Insight Not Found | Sark Pharma Tech Services',
            description: 'The requested regulatory insight could not be found.',
        };
    }

    const description = data.excerpt
        ? data.excerpt.substring(0, 160)
        : `Regulatory insight on ${data.category} from Sark Pharma Tech Services.`;

    return {
        title: `${data.title} | Regulatory Insights | Sark Pharma Tech Services`,
        description,
        openGraph: {
            title: `${data.title} | Sark Pharma Tech Services`,
            description,
            type: 'article',
        },
    };
}

export default function InsightDetailPage() {
    return <InsightDetailContent />;
}
