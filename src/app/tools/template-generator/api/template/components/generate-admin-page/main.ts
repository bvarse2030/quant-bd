/*
|-----------------------------------------
| setting up Main for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import writeInFile from '../create-and-write';
import { generateMainPageFile } from './generate-main-page';
import { generateLayoutFile } from './generate-admin-layout';

const generateMainPage = async (data: string) => {
  let folderName = 'example';
  let isUseGenerateFolder = false;
  const { namingConvention } = JSON.parse(data) || {};
  if (namingConvention.users_2_000___) {
    folderName = namingConvention.users_2_000___;
    isUseGenerateFolder = namingConvention.use_generate_folder;
  }

  const mainPageTemplate = generateMainPageFile(data);
  const adminLayout = generateLayoutFile();

  if (isUseGenerateFolder) {
    writeInFile(mainPageTemplate, `src/app/generate/${folderName}/admin/page.tsx`);
    writeInFile(adminLayout, `src/app/generate/${folderName}/admin/layout.tsx`);
  } else {
    writeInFile(mainPageTemplate, `src/app/dashboard/${folderName}/admin/page.tsx`);
    writeInFile(adminLayout, `src/app/dashboard/${folderName}/admin/layout.tsx`);
  }
};
export default generateMainPage;
