/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IOtherDoc {
  id: string;
  name: string;
  path: string;
  type?: string;
}

export interface IDocuments {
  nid: string;
  passport: string;
  images: string;
  ssc_certificate: string;
  hsc_certificate: string;
  birth_certificate: string;
  others: IOtherDoc[];
}

export interface IForm7Data {
  formUid: string;
  formTitle: string;
  student_name: string;
  mobile_number: string;
  documents: IDocuments;
  submitButtonText: string;
}

export const defaultDataForm7: IForm7Data = {
  formUid: 'form-docs-uid-7',
  formTitle: 'Student Document Uploads',
  student_name: '',
  mobile_number: '',
  documents: {
    nid: '',
    passport: '',
    images: '',
    ssc_certificate: '',
    hsc_certificate: '',
    birth_certificate: '',
    others: [],
  },
  submitButtonText: 'Save Documents',
};
