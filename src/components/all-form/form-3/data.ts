/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Form3Props {
  data?: IForm3Data | string;
}

export interface IForm3Data {
  formUid: string;
  formTitle: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  hasRefusalHistory: string;
  submitButtonText: string;
}

export const defaultDataForm3: IForm3Data = {
  formUid: 'form-location-uid-3',
  formTitle: 'Current Residential Address',
  streetAddress: 'House 12, Road 5, Dhanmondi',
  city: 'Dhaka',
  state: 'Dhaka Division',
  postalCode: '1209',
  country: 'Bangladesh',
  hasRefusalHistory: 'No',
  submitButtonText: 'Confirm Location',
};
