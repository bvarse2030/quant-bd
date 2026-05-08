/*
|-----------------------------------------
| setting up CreateAndWrite for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { NextResponse } from 'next/server';

import fs from 'fs';
import path from 'path';

const writeInFile = (contentPage: string, filePath: string) => {
  try {
    const newFilePath = path.join(process.cwd(), filePath);
    const dirPath = path.dirname(newFilePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(newFilePath, contentPage, 'utf8');

    console.log('File created successfully : ', filePath);
    return { message: 'File created successfully' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }
};

export default writeInFile;
