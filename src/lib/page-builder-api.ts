/*
|-----------------------------------------
| setting up PageBuilderApi for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface ISection {
  isActive: boolean;
  sectionUid: string;
  serialNo: number;
  data?: {
    _id: string;
  };
  _id: string;
}

export interface SubPage {
  _id: string;
  pageTitle: string;
  pagePath: string;
  content: ISection[];
  isActive: boolean;
}

export interface Page {
  _id: string;
  pageTitle: string;
  pagePath: string;
  content: ISection[];
  subPage: SubPage[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PageResponse {
  data: {
    pages: Page[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
  status: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/page-builder/v1';

export async function fetchAllPages(): Promise<PageResponse> {
  const res = await fetch(API_BASE_URL);

  if (!res.ok) {
    throw new Error('Failed to fetch pages');
  }

  return res.json();
}

export function findPageByPath(pages: PageResponse['data']['pages'], pathSegments: string[]) {
  const fullPath = '/' + pathSegments.join('/');

  for (const page of pages) {
    if (page.pagePath === fullPath && page.isActive) {
      return { type: 'page' as const, data: page };
    }

    for (const subPage of page.subPage) {
      const subPageFullPath = page.pagePath === '/' ? subPage.pagePath : `${page.pagePath}${subPage.pagePath}`;

      if (subPageFullPath === fullPath && subPage.isActive) {
        return { type: 'subpage' as const, data: subPage, parent: page };
      }
    }
  }

  return null;
}
