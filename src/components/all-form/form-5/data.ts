/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Form5Props {
  data?: IForm5Data | string;
}

export interface IForm5Data {
  formUid: string;
  formTitle: string;
  targetCountry: string;
  preferredIntake: string;
  desiredMajor: string;
  degreeLevel: string;
  budgetRange: string;
  scholarshipNeeded: string;
  submitButtonText: string;
}

export const defaultDataForm5: IForm5Data = {
  formUid: 'form-uni-uid-5',
  formTitle: 'University & Course Preferences',
  targetCountry: 'Canada',
  preferredIntake: 'Fall 2024',
  desiredMajor: 'Computer Science',
  degreeLevel: 'Masters',
  budgetRange: '20k - 30k CAD',
  scholarshipNeeded: 'Yes',
  submitButtonText: 'Find Universities',
};
