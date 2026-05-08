/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Form1Props {
  data?: IForm1Data | string;
}

export interface IForm1Data {
  formUid: string;
  formTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  passportNumber: string;
  gender: string;
  submitButtonText: string;
  currentPath?: string;
}

export const defaultDataForm1: IForm1Data = {
  formUid: 'form-personal-uid-1',
  formTitle: 'Student Personal Information',
  firstName: 'Aarav',
  lastName: 'Khan',
  email: 'aarav.khan@example.com',
  phoneNumber: '+8801712345678',
  dateOfBirth: '1999-05-15',
  passportNumber: 'A12345678',
  gender: 'Male',
  submitButtonText: 'Save & Next',
};
