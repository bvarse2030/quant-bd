/*
|-----------------------------------------
| setting up Main for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import writeInFile from '../create-and-write';

import { generateMainPageFile } from './generate-main-page';
import { generateLayoutFile } from './generate-personal-layout';

const generatePersonalPage = async (data: string) => {
  let folderName = 'example';
  let isUseGenerateFolder = false;
  const { namingConvention } = JSON.parse(data) || {};
  if (namingConvention.users_2_000___) {
    folderName = namingConvention.users_2_000___;
    isUseGenerateFolder = namingConvention.use_generate_folder;
  }

  const mainPageTemplate = generateMainPageFile(data);
  const personalLayout = generateLayoutFile();

  if (isUseGenerateFolder) {
    writeInFile(mainPageTemplate, `src/app/generate/${folderName}/personal/page.tsx`);
    writeInFile(personalLayout, `src/app/generate/${folderName}/personal/layout.tsx`);
  } else {
    writeInFile(mainPageTemplate, `src/app/dashboard/${folderName}/personal/page.tsx`);
    writeInFile(personalLayout, `src/app/dashboard/${folderName}/personal/layout.tsx`);
  }
};
export default generatePersonalPage;
