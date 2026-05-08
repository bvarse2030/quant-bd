/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Form2Props {
  data?: IForm2Data | string;
}

export interface IForm2Data {
  formUid: string;
  formTitle: string;
  fatherName: string;
  motherName: string;
  sponsorName: string;
  sponsorRelation: string;
  annualFamilyIncome: string;
  emergencyContact: string;
  submitButtonText: string;
}

export const defaultDataForm2: IForm2Data = {
  formUid: 'form-family-uid-2',
  formTitle: 'Family & Sponsorship Details',
  fatherName: 'Rahim Khan',
  motherName: 'Fatema Khan',
  sponsorName: 'Rahim Khan',
  sponsorRelation: 'Father',
  annualFamilyIncome: '$45,000 USD',
  emergencyContact: '+8801812345678',
  submitButtonText: 'Save Family Info',
};
