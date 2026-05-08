/*
|-----------------------------------------
| setting up Main for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import writeInFile from '../../create-and-write';

import { generateAddComponentFile } from './generate-add';
import { generatePersonalAddComponentFile } from './generate-personal-add';
import { generateBulkDeleteComponentFile } from './generate-bulk-delete';
import { generatePersonalBulkDeleteComponentFile } from './generate-personal-bulk-delete';
import { generateBulkDynamicUpdateComponentFile } from './generate-bulk-dynamic-update';
import { generateBulkEditComponentFile } from './generate-bulk-edit';
import { generatePersonalBulkEditComponentFile } from './generate-personal-build-edit';
import { generateBulkUpdateComponentFile } from './generate-bulk-update';
import { generatePersonalBulkUpdateComponentFile } from './generate-personal-bulk-update';
import { generateDataSelectComponentFile } from './generate-data-select';
import { generateDeleteComponentFile } from './generate-delete';
import { generateDynamicDataSelectComponentFile } from './generate-dynamic-data-select';
import { generateEditComponentFile } from './generate-edit';
import { generatePersonalEditComponentFile } from './generate-personal-edit';
import { generateImagesSelectComponentFile } from './generate-images-select';
import { generateImageDialogComponentFile } from './generate-imge-dialog';
import { generateMultiSelectComponentFile } from './generate-multi-select';
import { generatePaginationComponentFile } from './generate-pagination';
import { generateSearchBoxComponentFile } from './generate-search-box';
import { generateTypeUtils } from './generate-type-utils';
import { generateUtils } from './generate-utils';
import { generateViewComponentFile } from './generate-view';
import { generateViewTableComponentFile } from './generate-table-view';
import { generatePersonalViewTableComponentFile } from './generate-personal-table-view';
import { generateFilterDialogFile } from './generate-filter-dialog';
import { generateExportDialogField } from './generate-export-dialog';
import { generateSummaryComponentFile } from './generate-summery';
import { generateTooManyRequestComponent } from './generate-toomany-request';

const generateAllOtherComponentsMain = async (data: string) => {
  let folderName = 'example';
  let isUseGenerateFolder = false;
  const { namingConvention } = JSON.parse(data) || {};
  if (namingConvention.users_2_000___) {
    folderName = namingConvention.users_2_000___;
    isUseGenerateFolder = namingConvention.use_generate_folder;
  }

  const addComponentTemplate = generateAddComponentFile(data);
  const personalAddComponentTemplate = generatePersonalAddComponentFile(data);
  const bulkDeleteComponentContent = generateBulkDeleteComponentFile(data);
  const personalBulkDeleteComponentContent = generatePersonalBulkDeleteComponentFile(data);
  const bulkDynamicUpdateComponentContent = generateBulkDynamicUpdateComponentFile(data);
  const bulkEditComponentContent = generateBulkEditComponentFile(data);
  const personalBulkEditComponentContent = generatePersonalBulkEditComponentFile(data);
  const bulkUpdateComponentContent = generateBulkUpdateComponentFile(data);
  const personalBulkUpdateComponentContent = generatePersonalBulkUpdateComponentFile(data);
  const dataSelectComponentContent = generateDataSelectComponentFile();
  const deleteComponentContent = generateDeleteComponentFile(data);
  const dynamicDataSelectComponentContent = generateDynamicDataSelectComponentFile();
  const editComponentContent = generateEditComponentFile(data);
  const personalEditComponentContent = generatePersonalEditComponentFile(data);
  const imageDialogComponentContent = generateImageDialogComponentFile();
  const imagesSelectComponentContent = generateImagesSelectComponentFile();
  const multiSelectComponentContent = generateMultiSelectComponentFile();
  const paginationComponentContent = generatePaginationComponentFile();
  const searchBoxComponentContent = generateSearchBoxComponentFile();
  const generateTooManyRequestContent = generateTooManyRequestComponent();
  const generateTypeUtilsContent = generateTypeUtils();
  const generateUtilsCentent = generateUtils();
  const viewComponentContent = generateViewComponentFile(data);
  const viewTableComponentContent = generateViewTableComponentFile(data);
  const personalViewTableComponentContent = generatePersonalViewTableComponentFile(data);
  const generateFilterDialogContent = generateFilterDialogFile(data);
  const generateExportDialogContent = generateExportDialogField(data);
  const generateSummaryComponentContent = generateSummaryComponentFile(data);

  if (isUseGenerateFolder) {
    writeInFile(addComponentTemplate, `src/app/generate/${folderName}/components/Add.tsx`);
    writeInFile(personalAddComponentTemplate, `src/app/generate/${folderName}/components/PersonalAdd.tsx`);
    writeInFile(bulkDeleteComponentContent, `src/app/generate/${folderName}/components/BulkDelete.tsx`);
    writeInFile(personalBulkDeleteComponentContent, `src/app/generate/${folderName}/components/PersonalBulkDelete.tsx`);
    writeInFile(bulkDynamicUpdateComponentContent, `src/app/generate/${folderName}/components/BulkDynamicUpdate.tsx`);
    writeInFile(bulkEditComponentContent, `src/app/generate/${folderName}/components/BulkEdit.tsx`);
    writeInFile(personalBulkEditComponentContent, `src/app/generate/${folderName}/components/PersonalBulkEdit.tsx`);
    writeInFile(bulkUpdateComponentContent, `src/app/generate/${folderName}/components/BulkUpdate.tsx`);
    writeInFile(personalBulkUpdateComponentContent, `src/app/generate/${folderName}/components/PersonalBulkUpdate.tsx`);
    writeInFile(dataSelectComponentContent, `src/app/generate/${folderName}/components/DataSelect.tsx`);
    writeInFile(deleteComponentContent, `src/app/generate/${folderName}/components/Delete.tsx`);
    writeInFile(dynamicDataSelectComponentContent, `src/app/generate/${folderName}/components/DynamicDataSelect.tsx`);
    writeInFile(editComponentContent, `src/app/generate/${folderName}/components/Edit.tsx`);
    writeInFile(personalEditComponentContent, `src/app/generate/${folderName}/components/PersonalEdit.tsx`);
    writeInFile(imageDialogComponentContent, `src/app/generate/${folderName}/components/ImageDialog.tsx`);
    writeInFile(imagesSelectComponentContent, `src/app/generate/${folderName}/components/ImagesSelect.tsx`);
    writeInFile(multiSelectComponentContent, `src/app/generate/${folderName}/components/MultiSelect.tsx`);
    writeInFile(paginationComponentContent, `src/app/generate/${folderName}/components/Pagination.tsx`);
    writeInFile(searchBoxComponentContent, `src/app/generate/${folderName}/components/SearchBox.tsx`);
    writeInFile(generateTooManyRequestContent, `src/app/generate/${folderName}/components/TooManyRequest.tsx`);
    writeInFile(generateTypeUtilsContent, `src/app/generate/${folderName}/components/TypeUtils.tsx`);
    writeInFile(generateUtilsCentent, `src/app/generate/${folderName}/components/utils.tsx`);
    writeInFile(viewComponentContent, `src/app/generate/${folderName}/components/View.tsx`);
    writeInFile(viewTableComponentContent, `src/app/generate/${folderName}/components/TableView.tsx`);
    writeInFile(personalViewTableComponentContent, `src/app/generate/${folderName}/components/PersonalTableView.tsx`);
    writeInFile(generateFilterDialogContent, `src/app/generate/${folderName}/components/FilterDialog.tsx`);
    writeInFile(generateExportDialogContent, `src/app/generate/${folderName}/components/ExportDialog.tsx`);
    writeInFile(generateSummaryComponentContent, `src/app/generate/${folderName}/components/Summary.tsx`);
  } else {
    writeInFile(personalEditComponentContent, `src/app/dashboard/${folderName}/components/PersonalEdit.tsx`);
    writeInFile(personalBulkUpdateComponentContent, `src/app/dashboard/${folderName}/components/PersonalBulkUpdate.tsx`);
    writeInFile(personalBulkDeleteComponentContent, `src/app/dashboard/${folderName}/components/PersonalBulkDelete.tsx`);
    writeInFile(personalBulkEditComponentContent, `src/app/dashboard/${folderName}/components/PersonalBulkEdit.tsx`);
    writeInFile(personalAddComponentTemplate, `src/app/dashboard/${folderName}/components/PersonalAdd.tsx`);
    writeInFile(personalViewTableComponentContent, `src/app/dashboard/${folderName}/components/PersonalTableView.tsx`);
    writeInFile(addComponentTemplate, `src/app/dashboard/${folderName}/components/Add.tsx`);
    writeInFile(bulkDeleteComponentContent, `src/app/dashboard/${folderName}/components/BulkDelete.tsx`);
    writeInFile(bulkDynamicUpdateComponentContent, `src/app/dashboard/${folderName}/components/BulkDynamicUpdate.tsx`);
    writeInFile(bulkEditComponentContent, `src/app/dashboard/${folderName}/components/BulkEdit.tsx`);
    writeInFile(bulkUpdateComponentContent, `src/app/dashboard/${folderName}/components/BulkUpdate.tsx`);
    writeInFile(dataSelectComponentContent, `src/app/dashboard/${folderName}/components/DataSelect.tsx`);
    writeInFile(deleteComponentContent, `src/app/dashboard/${folderName}/components/Delete.tsx`);
    writeInFile(dynamicDataSelectComponentContent, `src/app/dashboard/${folderName}/components/DynamicDataSelect.tsx`);
    writeInFile(editComponentContent, `src/app/dashboard/${folderName}/components/Edit.tsx`);
    writeInFile(imageDialogComponentContent, `src/app/dashboard/${folderName}/components/ImageDialog.tsx`);
    writeInFile(imagesSelectComponentContent, `src/app/dashboard/${folderName}/components/ImagesSelect.tsx`);
    writeInFile(multiSelectComponentContent, `src/app/dashboard/${folderName}/components/MultiSelect.tsx`);
    writeInFile(paginationComponentContent, `src/app/dashboard/${folderName}/components/Pagination.tsx`);
    writeInFile(searchBoxComponentContent, `src/app/dashboard/${folderName}/components/SearchBox.tsx`);
    writeInFile(generateTooManyRequestContent, `src/app/dashboard/${folderName}/components/TooManyRequest.tsx`);
    writeInFile(generateTypeUtilsContent, `src/app/dashboard/${folderName}/components/TypeUtils.tsx`);
    writeInFile(generateUtilsCentent, `src/app/dashboard/${folderName}/components/utils.tsx`);
    writeInFile(viewComponentContent, `src/app/dashboard/${folderName}/components/View.tsx`);
    writeInFile(viewTableComponentContent, `src/app/dashboard/${folderName}/components/TableView.tsx`);
    writeInFile(generateFilterDialogContent, `src/app/dashboard/${folderName}/components/FilterDialog.tsx`);
    writeInFile(generateExportDialogContent, `src/app/dashboard/${folderName}/components/ExportDialog.tsx`);
    writeInFile(generateSummaryComponentContent, `src/app/dashboard/${folderName}/components/Summary.tsx`);
  }
};
export default generateAllOtherComponentsMain;
