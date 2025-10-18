import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/genai';

// Initialize the Google Generative AI client using server-side API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req) {
  try {
    const { symptoms } = await req.json();

    if (!symptoms || symptoms.trim() === "") {
      return NextResponse.json({ error: "Please provide symptoms" }, { status: 400 });
    }

    // Generate AI advice
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(`
      User symptoms: ${symptoms}
      Give answer in bullet points in simple, easy-to-understand language for a non-medical person.
      Include:
      - Possible illness
      - Simple advice
      - Nearby hospital suggestion (if available in hospital-data.json)
    `);

    const advice = result.outputText || "No advice available";

    return NextResponse.json({ advice });

  } catch (err) {
    console.error("AI API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch AI advice. Check API key or server logs." },
      { status: 500 }
    );
  }
}
