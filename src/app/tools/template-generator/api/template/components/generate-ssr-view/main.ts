/*
|-----------------------------------------
| setting up Main for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import writeInFile from '../create-and-write';
import { generateIDHomeButton } from './generate-[id]-home-button';
import { generateDetailPageFile } from './generate-[id]-page';
import { generateCustomButton } from './generate-custom-button';
import { generateMainPage } from './generate-main-page';

const generateSSRView = async (data: string) => {
  let folderName = 'example';
  let isUseGenerateFolder = false;
  const { namingConvention } = JSON.parse(data) || {};
  if (namingConvention.users_2_000___) {
    folderName = namingConvention.users_2_000___;
    isUseGenerateFolder = namingConvention.use_generate_folder;
  }

  const mainPageTemplate = generateMainPage(data);
  const custombuttonTemplate = generateCustomButton();
  const idHomeButtonTemplate = generateIDHomeButton(data);
  const detailPageTemplate = generateDetailPageFile(data);

  if (isUseGenerateFolder) {
    writeInFile(mainPageTemplate, `src/app/generate/${folderName}/ssr-view/page.tsx`);
    writeInFile(custombuttonTemplate, `src/app/generate/${folderName}/ssr-view/CustomButton.tsx`);
    writeInFile(idHomeButtonTemplate, `src/app/generate/${folderName}/ssr-view/details/[id]/HomeButton.tsx`);
    writeInFile(detailPageTemplate, `src/app/generate/${folderName}/ssr-view/details/[id]/page.tsx`);
  } else {
    writeInFile(mainPageTemplate, `src/app/dashboard/${folderName}/ssr-view/page.tsx`);
    writeInFile(custombuttonTemplate, `src/app/dashboard/${folderName}/ssr-view/CustomButton.tsx`);
    writeInFile(idHomeButtonTemplate, `src/app/dashboard/${folderName}/ssr-view/details/[id]/HomeButton.tsx`);
    writeInFile(detailPageTemplate, `src/app/dashboard/${folderName}/ssr-view/details/[id]/page.tsx`);
  }
};
export default generateSSRView;
