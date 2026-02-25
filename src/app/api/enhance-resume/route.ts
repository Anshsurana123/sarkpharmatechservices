import { NextResponse } from 'next/server';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

export async function POST(req: Request) {
    try {
        if (!process.env.CEREBRAS_API_KEY) {
            console.error('CEREBRAS_API_KEY is not set');
            return NextResponse.json({ error: 'AI Service Configuration Error' }, { status: 500 });
        }

        const client = new Cerebras({
            apiKey: process.env.CEREBRAS_API_KEY,
        });

        const body = await req.json();
        const { summary, experience, skills } = body;

        if (!summary && (!experience || experience.length === 0) && !skills) {
            return NextResponse.json({ error: 'No data provided to enhance' }, { status: 400 });
        }

        const systemPrompt = `You are an expert Pharmaceutical and Life Sciences Resume Writer. 
Your job is to rewrite the provided resume sections to sound highly professional, authoritative, and optimized for ATS systems (Applicant Tracking Systems) in the Pharma industry (QA, QC, Regulatory Affairs, Manufacturing).

Rules:
1. ONLY return a raw JSON object. Do not include markdown formatting or backticks like \`\`\`json.
2. The JSON must exactly match this structure:
{
  "summary": "new summary string",
  "experience": [
    {
      "id": int,
      "description": "new description string with bullet points"
    }
  ],
  "skills": "comma separated string of enhanced skills"
}
3. Transform experience task descriptions into "Harvard style" bullet points starting with strong action verbs.
4. Keep the original IDs intact for the experience array.`;

        const userContent = JSON.stringify({
            summary: summary,
            experience: experience.map((exp: any) => ({ id: exp.id, description: exp.description })),
            skills: skills
        });

        const completionCreateResponse = await client.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent }
            ],
            model: 'gpt-oss-120b', // Best available on Cerebras for instruction following if gpt-oss-120b fails, but I will use specific user string if needed. Changing to gpt-oss-120b per user request
        }) as any;

        const aiResponse = completionCreateResponse.choices[0].message.content;

        // Clean up markdown if the AI mistakenly wrapped the JSON
        const cleanJsonString = aiResponse?.replace(/```json/g, '')?.replace(/```/g, '')?.trim() || '{}';

        const enhancedData = JSON.parse(cleanJsonString);

        return NextResponse.json(enhancedData);

    } catch (error: any) {
        console.error('Error enhancing resume with AI:', error);
        return NextResponse.json({ error: error.message || 'Failed to enhance resume' }, { status: 500 });
    }
}
