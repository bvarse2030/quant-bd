/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { Suspense } from 'react';

import EmailConfirmationPage from './email-component';

import LoadingServerComponent from '@/components/common/LoadingServerSkeleton';

const Page = () => {
  return (
    <Suspense fallback={<LoadingServerComponent />}>
      <div className="py-6 w-full" />
      <EmailConfirmationPage />
    </Suspense>
  );
};
export default Page;
