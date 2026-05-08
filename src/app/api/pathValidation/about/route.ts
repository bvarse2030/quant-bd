/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !Array.isArray(body.paths)) {
      return NextResponse.json({ success: false, message: 'Invalid request body. Expected { paths: string[] }.' }, { status: 400 });
    }

    const invalidPaths = body.paths.filter((p: string) => typeof p !== 'string' || !p.startsWith('/about'));

    if (invalidPaths.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid paths found. All paths must start with "/about".',
          invalidPaths,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'All paths are valid for /about.',
    });
  } catch (error) {
    console.error('Path Validation Error:', error);
    return NextResponse.json({ success: false, message: 'Server error occurred while validating paths.' }, { status: 500 });
  }
}
