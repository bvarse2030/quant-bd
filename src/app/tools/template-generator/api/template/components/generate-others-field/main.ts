/*
|-----------------------------------------
| setting up Main for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import writeInFile from '../create-and-write';
import { generateStringArrayField } from './generate-string-array-field';
import { generateStringArrayType } from './generate-string-array-type';

const generateOthersFields = async (data: string) => {
  let folderName = 'example';
  let isUseGenerateFolder = false;
  const { namingConvention } = JSON.parse(data) || {};

  if (namingConvention.users_2_000___) {
    folderName = namingConvention.users_2_000___;
    isUseGenerateFolder = namingConvention.use_generate_folder;
  }

  const stringArrayField = generateStringArrayField();
  const stringArrayType = generateStringArrayType();

  if (isUseGenerateFolder) {
    writeInFile(stringArrayField, `src/app/generate/${folderName}/components/others-field-type/StringArrayField.tsx`);
    writeInFile(stringArrayType, `src/app/generate/${folderName}/components/others-field-type/types.ts`);
  } else {
    writeInFile(stringArrayField, `src/app/dashboard/${folderName}/components/others-field-type/StringArrayField.tsx`);
    writeInFile(stringArrayType, `src/app/dashboard/${folderName}/components/others-field-type/types.ts`);
  }
};
export default generateOthersFields;
