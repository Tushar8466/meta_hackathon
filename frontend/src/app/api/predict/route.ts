import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Forward the request to the FastAPI backend
    // In a real production setup, this URL would be an environment variable
    const backendResponse = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      body: formData,
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json({ error: errorData.detail || 'Backend error' }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Failed to connect to AI engine' }, { status: 500 });
  }
}
