/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Form6Props {
  data?: IForm6Data | string;
}

export interface IForm6Data {
  formUid: string;
  formTitle: string;
  technicalSkills: string;
  languages: string;
  hobbies: string;
  extraCurricular: string;
  awards: string;
  submitButtonText: string;
}

export const defaultDataForm6: IForm6Data = {
  formUid: 'form-skills-uid-6',
  formTitle: 'Skills & Activities',
  technicalSkills: 'JavaScript, Python, MS Office',
  languages: 'English (Fluent), Bengali (Native)',
  hobbies: 'Photography, Traveling, Cricket',
  extraCurricular: 'Debate Club President, Volunteer at Red Crescent',
  awards: 'Math Olympiad Regional Winner 2021',
  submitButtonText: 'Complete Profile',
};
