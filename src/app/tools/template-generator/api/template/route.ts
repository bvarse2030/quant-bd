/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { NextRequest, NextResponse } from 'next/server';
import generateApi from './components/generate-api/main';
import generateRtk from './components/generate-redux-toolkit/main';
import generateStore from './components/generate-store/main';
import generateSSRView from './components/generate-ssr-view/main';
import generateAdminPage from './components/generate-admin-page/main';
import generateClientView from './components/generate-client-view/main';
import generateAllOtherComponents from './components/generate-component/main';
import writeInFile from './components/create-and-write';
import generateOthersFields from './components/generate-others-field/main';
import generatePersonalPage from './components/generate-personal-page/main';

export async function POST(request: NextRequest) {
  try {
    let folderName = 'example';
    let isUseGenerateFolder = false;
    const { data } = await request.json();
    const { namingConvention } = JSON.parse(data) || {};
    if (namingConvention.users_2_000___) {
      folderName = namingConvention.users_2_000___;
      isUseGenerateFolder = namingConvention.use_generate_folder;
    }

    if (isUseGenerateFolder) {
      writeInFile(data, `src/app/generate/${folderName}/slice-schema/slice-schema.json`);
    } else {
      writeInFile(data, `src/app/dashboard/${folderName}/slice-schema/slice-schema.json`);
    }

    generateApi(data);
    generateRtk(data);
    generateStore(data);
    generateSSRView(data);

    generateAdminPage(data);
    generatePersonalPage(data);
    generateClientView(data);
    generateOthersFields(data);
    generateAllOtherComponents(data);

    return NextResponse.json({ message: 'file found' }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return NextResponse.json({ message: 'Error creating file' }, { status: 500 });
  }
}
