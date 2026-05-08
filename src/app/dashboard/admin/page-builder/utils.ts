/*
|-----------------------------------------
| setting up Utils for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export type ItemType = 'section' | 'form' | 'button' | 'title' | 'description' | 'paragraph' | 'sliders' | 'tagSliders' | 'logoSliders' | 'gellery';

export interface PageContent {
  id: string;
  key: string;
  name: string;
  type: ItemType;
  heading: string;
  path: string;
  data: unknown;
}

export const defaultPageContent: PageContent = {
  id: '1',
  key: 'heading',
  name: 'Name',
  type: 'title',
  heading: 'Heading',
  path: '/heading',
  data: '',
};

export interface IPage {
  _id?: string;
  id?: string;
  pageName: string;
  path: string;
  isActive: boolean;
  content: PageContent[];
  createdAt?: string;
  updatedAt?: string;
}

export const INITIAL_DATA: IPage[] = [
  { id: '1', pageName: 'Home Page', path: '/', isActive: true, content: [] },
  { id: '2', pageName: 'About Us', path: '/about/us', isActive: true, content: [] },
  { id: '3', pageName: 'Our Services', path: '/about/services', isActive: false, content: [] },
  { id: '4', pageName: 'Contact Support', path: '/contact/support', isActive: true, content: [] },
  { id: '5', pageName: 'Office Locations', path: '/contact/locations', isActive: true, content: [] },
  { id: '6', pageName: 'Blog List', path: '/blog', isActive: true, content: [] },
];
