/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/
import React, { cache } from 'react';
import { Type, Layers, LucideIcon, Sparkles } from 'lucide-react';

import { PageContent } from '@/app/dashboard/admin/page-builder/utils';
import { AllForms, AllFormsKeys } from '@/components/all-form/all-form-index/all-form';
import { AllSections, AllSectionsKeys } from '@/components/all-section/all-section-index/all-sections';

import { getAllPages } from '../api/page-builder/v1/controller';

interface PageApiResponse {
  data?: {
    pages?: NormalizedPage[];
    total?: number;
    page?: number;
    limit?: number;
  } | null;
  message?: string;
  status?: number;
}

interface NormalizedPage {
  _id: string;
  pageName: string;
  path: string;
  isActive?: boolean;
  content: PageContent[];
  subPage?: NormalizedPage[];
  pageTitle?: string;
  pagePath?: string;
  [key: string]: unknown;
}

interface ComponentMapEntry {
  collection: Record<string, Record<string, React.ElementType>>;
  keys: string[];
  label: string;
  icon: LucideIcon;
}

const COMPONENT_MAP: Record<string, ComponentMapEntry> = {
  form: {
    collection: AllForms as unknown as Record<string, Record<string, React.ElementType>>,
    keys: AllFormsKeys,
    label: 'Forms',
    icon: Type,
  },
  section: {
    collection: AllSections as unknown as Record<string, Record<string, React.ElementType>>,
    keys: AllSectionsKeys,
    label: 'Sections',
    icon: Layers,
  },
};

const getCachedAllPages = cache(async (): Promise<NormalizedPage[]> => {
  try {
    const pagesData = (await getAllPages()) as unknown as PageApiResponse;

    if (pagesData?.data?.pages && Array.isArray(pagesData.data.pages)) {
      return getNormalizedPages(pagesData.data.pages.filter(i => i.isActive));
    }
    return [];
  } catch {
    return [];
  }
});

function getNormalizedPages(rawPages: NormalizedPage[]): NormalizedPage[] {
  const flattenPages = (list: NormalizedPage[]): NormalizedPage[] => {
    let results: NormalizedPage[] = [];
    list.forEach(item => {
      const norm: NormalizedPage = {
        ...item,
        _id: item._id,
        pageName: item.pageName || item.pageTitle || 'Untitled',
        path: (item.path || item.pagePath || '#').startsWith('/') ? item.path || item.pagePath || '/' : '/' + (item.path || item.pagePath),
        content: item.content || [],
      };
      results.push(norm);

      if (item.subPage && Array.isArray(item.subPage)) {
        results = [...results, ...flattenPages(item.subPage)];
      }
    });
    return results;
  };
  return flattenPages(rawPages);
}

const SSRItemRenderer = ({ item }: { item: PageContent }) => {
  if (!item.type || !COMPONENT_MAP[item.type]) return null;

  const mapEntry = COMPONENT_MAP[item.type];
  const config = mapEntry ? mapEntry.collection[item.key] : null;

  if (!mapEntry || !config) return null;

  let ComponentToRender: React.ElementType | undefined;

  if (item.type === 'form' && 'FormField' in config) {
    ComponentToRender = config.FormField;
  } else if ('query' in config) {
    ComponentToRender = config.query;
  }

  if (!ComponentToRender) return null;

  return (
    <div className="w-full">
      {item.type !== 'form' ? (
        <ComponentToRender data={JSON.stringify(item.data)} />
      ) : (
        <div className="pointer-events-auto">
          <ComponentToRender data={item.data} />
        </div>
      )}
    </div>
  );
};

const constructPathFromParams = (slugs: string[]) => {
  if (!slugs || slugs.length === 0) return '/';
  return '/' + slugs.join('/');
};

export async function generateStaticParams() {
  const pages = await getCachedAllPages();

  const filteredPages = pages.filter(page => page.path && page.path !== '/' && page.path !== '');

  if (!filteredPages.length) {
    return [];
  }

  return filteredPages.map(page => {
    const slug = page.path.split('/').filter(Boolean);
    return {
      pageTitle: slug,
    };
  });
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ pageTitle?: string[] }> }) {
  const resolvedParams = await params;
  const pathString = constructPathFromParams(resolvedParams.pageTitle || []);

  const pages = await getCachedAllPages();
  const currentPage = pages.find(p => p.path === pathString);

  if (!currentPage) {
    return { title: 'Hello Page' };
  }

  return {
    title: currentPage.pageName,
  };
}

const HelloPageFallback = () => (
  <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-slate-950 overflow-hidden px-4 md:px-8">
    <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
    <div
      className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse"
      style={{ animationDelay: '1s' }}
    />

    <div className="relative z-10 flex flex-col items-center justify-center p-8 md:p-16 backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl shadow-2xl transition-all hover:scale-[1.02] duration-500 max-w-2xl w-full">
      <div className="relative">
        <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-indigo-400 mb-8 animate-bounce" />
        <div className="absolute top-0 left-0 w-full h-full bg-indigo-400/50 blur-2xl -z-10 animate-pulse" />
      </div>

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-purple-400 mb-6 tracking-tight text-center">
        Hello Page
      </h1>

      <p className="text-slate-400 text-base md:text-xl lg:text-2xl max-w-lg text-center leading-relaxed">
        Welcome to your dynamic space. There is no custom configuration here yet, but the potential is endless.
      </p>

      <div className="mt-10 flex gap-4">
        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
        <div className="h-2 w-2 rounded-full bg-purple-500 animate-ping" style={{ animationDelay: '0.2s' }} />
        <div className="h-2 w-2 rounded-full bg-pink-500 animate-ping" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  </div>
);

export default async function StaticPage({ params }: { params: Promise<{ pageTitle?: string[] }> }) {
  const resolvedParams = await params;
  const pathString = constructPathFromParams(resolvedParams.pageTitle || []);

  const pages = await getCachedAllPages();

  const currentPage = pages.find(p => p.path === pathString);

  if (!currentPage) {
    return <HelloPageFallback />;
  }

  const items: PageContent[] = Array.isArray(currentPage.content) ? currentPage.content : [];

  if (items.length === 0) {
    return <HelloPageFallback />;
  }

  return (
    <main className="min-h-screen w-full bg-slate-950 pt-[80px]">
      <div className="w-full flex flex-col">
        {items.map((item, index) => (
          <SSRItemRenderer key={item.id || index} item={item} />
        ))}
      </div>
    </main>
  );
}
