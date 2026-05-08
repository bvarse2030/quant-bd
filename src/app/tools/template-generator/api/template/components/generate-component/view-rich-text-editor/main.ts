/*
|-----------------------------------------
| setting up Main for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import writeInFile from '../../create-and-write';
import { generateViewRichTextViewComponent } from './generate-v-r-t';
import { generateViewRichTextEditorClientComponent } from './generate-v-r-t-e-c-component';
import { generateViewRichTextEditorServerComponent } from './generate-v-r-t-e-s-component';

const generateViewRichTextEditorMain = async (data: string) => {
  let folderName = 'example';
  let isUseGenerateFolder = false;
  const { namingConvention } = JSON.parse(data) || {};
  if (namingConvention.users_2_000___) {
    folderName = namingConvention.users_2_000___;
    isUseGenerateFolder = namingConvention.use_generate_folder;
  }

  const richTextEditorClientTemplate = generateViewRichTextEditorClientComponent();
  const richTextEditorServerTemplate = generateViewRichTextEditorServerComponent();
  const richTextViewTemplate = generateViewRichTextViewComponent();

  if (isUseGenerateFolder) {
    writeInFile(richTextEditorClientTemplate, `src/app/generate/${folderName}/components/view-rich-text/ClientComponent.tsx`);
    writeInFile(richTextEditorServerTemplate, `src/app/generate/${folderName}/components/view-rich-text/ServerComponent.tsx`);
    writeInFile(richTextViewTemplate, `src/app/generate/${folderName}/components/view-rich-text/ViewRichText.tsx`);
  } else {
    writeInFile(richTextEditorClientTemplate, `src/app/dashboard/${folderName}/components/view-rich-text/ClientComponent.tsx`);
    writeInFile(richTextEditorServerTemplate, `src/app/dashboard/${folderName}/components/view-rich-text/ServerComponent.tsx`);
    writeInFile(richTextViewTemplate, `src/app/dashboard/${folderName}/components/view-rich-text/ViewRichText.tsx`);
  }
};
export default generateViewRichTextEditorMain;
