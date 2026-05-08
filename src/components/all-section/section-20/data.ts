/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface Button2Props {
  data?: IButton2Data | string;
}

export interface IButton2Data {
  buttonName: string;
  buttonIcon: string;
  buttonPath: string;
  isNewTab: boolean;
  buttonSize: 'default' | 'sm' | 'lg' | 'xl' | 'xs';
  buttonWidth: 'auto' | 'full' | 'fixed-sm' | 'fixed-md' | 'fixed-lg' | 'fixed-xl';
  buttonVariant:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'garden'
    | 'fire'
    | 'water'
    | 'outlineGarden'
    | 'outlineFire'
    | 'outlineWater'
    | 'outlineDefault'
    | 'outlineGlassy'
    | 'glassyPrimary'
    | 'glassySuccess'
    | 'glassyDanger'
    | 'glassyWarning'
    | 'glassyInfo'
    | 'glassyDark'
    | 'glassyLight'
    | 'neonBlue'
    | 'neonPink'
    | 'neonGreen'
    | 'neonPurple';
}

export const defaultDataSection20: IButton2Data = {
  buttonName: 'View Guidelines',
  buttonIcon: 'doc-icon',
  buttonPath: '/guidelines/student-guidenes',
  isNewTab: true,
  buttonVariant: 'neonBlue',
  buttonSize: 'default',
  buttonWidth: 'auto',
};

export interface ButtonFormProps {
  data?: IButton2Data;
  onSubmit: (values: IButton2Data) => void;
}
