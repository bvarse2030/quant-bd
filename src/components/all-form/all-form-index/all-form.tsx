/*
|-----------------------------------------
| setting up AllForm for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { defaultDataForm1, IForm1Data } from '../form-1/data';
import { defaultDataForm2, IForm2Data } from '../form-2/data';
import { defaultDataForm3, IForm3Data } from '../form-3/data';
import { defaultDataForm4, IForm4Data } from '../form-4/data';
import { defaultDataForm5, IForm5Data } from '../form-5/data';
import { defaultDataForm6, IForm6Data } from '../form-6/data';
import { defaultDataForm7, IForm7Data } from '../form-7/data';

import FormFieldForm1 from '../form-1/FormField';
import FormFieldForm2 from '../form-2/FormField';
import FormFieldForm3 from '../form-3/FormField';
import FormFieldForm4 from '../form-4/FormField';
import FormFieldForm5 from '../form-5/FormField';
import FormFieldForm6 from '../form-6/FormField';
import FormFieldForm7 from '../form-7/FormField';

import PreviewForm1 from '../form-1/Preview';
import PreviewForm2 from '../form-2/Preview';
import PreviewForm3 from '../form-3/Preview';
import PreviewForm4 from '../form-4/Preview';
import PreviewForm5 from '../form-5/Preview';
import PreviewForm6 from '../form-6/Preview';
import PreviewForm7 from '../form-7/Preview';

export type { IForm1Data, IForm2Data, IForm3Data, IForm4Data, IForm5Data, IForm6Data, IForm7Data };

export const AllForms = {
  'form-personal-uid-1': {
    FormField: FormFieldForm1,
    preview: PreviewForm1,
    data: defaultDataForm1,
  },
  'form-family-uid-2': {
    FormField: FormFieldForm2,
    preview: PreviewForm2,
    data: defaultDataForm2,
  },
  'form-location-uid-3': {
    FormField: FormFieldForm3,
    preview: PreviewForm3,
    data: defaultDataForm3,
  },
  'form-academic-uid-4': {
    FormField: FormFieldForm4,
    preview: PreviewForm4,
    data: defaultDataForm4,
  },
  'form-uni-uid-5': {
    FormField: FormFieldForm5,
    preview: PreviewForm5,
    data: defaultDataForm5,
  },
  'form-skills-uid-6': {
    FormField: FormFieldForm6,
    preview: PreviewForm6,
    data: defaultDataForm6,
  },
  'form-document-uid-7': {
    FormField: FormFieldForm7,
    preview: PreviewForm7,
    data: defaultDataForm7,
  },
};

export const AllFormsKeys = Object.keys(AllForms);
