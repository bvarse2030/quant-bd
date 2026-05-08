/*
|-----------------------------------------
| setting up Main for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import writeInFile from '../../create-and-write';
import { generateRichTextEditorIndex } from './generate-rich-text-editor-index';
import { generateRichTextEditorMenuBar } from './generate-rich-text-editor-menu-bar';

const generateRichTextEditorMain = async (data: string) => {
  let folderName = 'example';
  let isUseGenerateFolder = false;
  const { namingConvention } = JSON.parse(data) || {};
  if (namingConvention.users_2_000___) {
    folderName = namingConvention.users_2_000___;
    isUseGenerateFolder = namingConvention.use_generate_folder;
  }

  const richTextEditorIndexTemplate = generateRichTextEditorIndex();
  const richTextEditorMenuBarTemplate = generateRichTextEditorMenuBar();

  if (isUseGenerateFolder) {
    writeInFile(richTextEditorIndexTemplate, `src/app/generate/${folderName}/components/rich-text-editor/index.tsx`);
    writeInFile(richTextEditorMenuBarTemplate, `src/app/generate/${folderName}/components/rich-text-editor/menu-bar.tsx`);
  } else {
    writeInFile(richTextEditorIndexTemplate, `src/app/dashboard/${folderName}/components/rich-text-editor/index.tsx`);
    writeInFile(richTextEditorMenuBarTemplate, `src/app/dashboard/${folderName}/components/rich-text-editor/menu-bar.tsx`);
  }
};
export default generateRichTextEditorMain;
