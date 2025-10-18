import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  const { symptoms } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(`
User symptoms: ${symptoms}

⚡ Please provide a **simple, short, bullet-point answer** that anyone can understand, even without medical knowledge.
Include:
- Possible illness (in simple words)
- What kind of doctor to see
- Simple home care / precautions
- Nearby government hospital suggestions (use simple names)
Limit to **5-6 bullet points** max. Avoid long paragraphs.
    `);

    return NextResponse.json({ advice: result.response.text() });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
