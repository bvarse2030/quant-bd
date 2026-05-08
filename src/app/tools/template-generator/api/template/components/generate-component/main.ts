/*
|-----------------------------------------
| setting up Main for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import generateAllOtherComponentsMain from './others-component/main';
import generateRichTextEditorMain from './rich-text-editor/main';
import generateViewRichTextEditorMain from './view-rich-text-editor/main';

const generateAllOtherComponents = async (data: string) => {
  generateRichTextEditorMain(data);
  generateViewRichTextEditorMain(data);
  generateAllOtherComponentsMain(data);
};
export default generateAllOtherComponents;
