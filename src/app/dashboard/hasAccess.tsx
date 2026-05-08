/*
|-----------------------------------------
| setting up HasAccess for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import TooManyRequests from '@/components/common/TooManyRequest';
import { useGetRolesQuery } from '@/redux/features/roles/rolesSlice';
import { useGetAccessManagementsQuery } from '@/redux/features/accessManagements/accessManagementsSlice';

const LoadingOverlay = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
    <div className="fixed inset-0 bg-linear-to-br from-indigo-500 via-purple-500 to-blue-500 blur-sm" />
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative z-10 flex flex-col items-center justify-center gap-4 p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-white/30 border-t-white"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 w-12 h-12 rounded-full border-4 border-transparent border-b-purple-200"
        />
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-white font-medium tracking-wider">
        Verifying Access...
      </motion.p>
    </motion.div>
  </div>
);

const UnauthorizedView = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />

        <div className="mx-auto bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mb-6 text-red-200 border border-red-500/30">
          <ShieldAlert size={40} />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-white/70 mb-8">
          You do not have permission to view this resource. Please contact your administrator if you believe this is an error.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => router.back()} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
          <Button onClick={() => router.push('/dashboard')} className="bg-white text-purple-900 hover:bg-gray-100">
            Dashboard Home
          </Button>
        </div>

        <div className="absolute -bottom-10 -right-10 text-white/5 rotate-12 pointer-events-none">
          <Lock size={150} />
        </div>
      </motion.div>
    </div>
  );
};

const HasAccess = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const currentPath = usePathname();
  const session = useSession();

  const isPending = session?.isPending;
  const isAuthenticated = !!session?.data?.session;
  const user = session?.data?.user;
  const email = user?.email || '';

  const {
    data: userAccessManagementQuery,
    isLoading: isAccessLoading,
    isError: isAccessError,
    error: accessManagementError,
  } = useGetAccessManagementsQuery({ user_email: email ?? '', page: 1, limit: 100 }, { skip: !email });

  const {
    data: allRolesQuery,
    isLoading: isRolesLoading,
    isError: isRolesError,
    error: rolesError,
  } = useGetRolesQuery({
    page: 1,
    limit: 100,
  });

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      router.push('/login');
    }
  }, [isPending, isAuthenticated, router]);
  const isUniversalRoute = currentPath === '/dashboard' || currentPath === '/dashboard/profile';

  const hasPermission = useMemo(() => {
    if (!isAuthenticated || isPending) return false;
    if (isUniversalRoute) return true;
    if (isAccessLoading || isRolesLoading) return false;
    if (isRolesError || isAccessError) return false;

    const userRoles = userAccessManagementQuery?.data?.accessManagements?.[0]?.assign_role || [];

    if (!userRoles.length) return false;

    const allRoles = allRolesQuery?.data?.roles || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matchedRoles = allRoles.filter((role: any) => userRoles.includes(role.name));

    const allowedPaths = new Set<string>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    matchedRoles.forEach((role: any) => {
      if (role.dashboard_access_ui && Array.isArray(role.dashboard_access_ui)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role.dashboard_access_ui.forEach((uiItem: any) => {
          if (uiItem.path) {
            allowedPaths.add(uiItem.path);
          }
        });
      }
    });

    if (allowedPaths.has(currentPath)) {
      return true;
    }

    for (const allowedPath of allowedPaths) {
      if (currentPath.startsWith(`${allowedPath}/`)) {
        return true;
      }
    }

    return false;
  }, [
    isAuthenticated,
    isPending,
    isUniversalRoute,
    isAccessLoading,
    isRolesLoading,
    userAccessManagementQuery,
    allRolesQuery,
    currentPath,
    isAccessError,
    isRolesError,
  ]);

  const shouldShowLoading = isPending || (!isUniversalRoute && isAuthenticated && (isAccessLoading || isRolesLoading));
  if (process.env.NEXT_PUBLIC_AuthorizationEnable === 'false') {
    return (
      <main>
        <div className="lg:p-10 p-4 pb-12 animate-in fade-in duration-500">{children}</div>
      </main>
    );
  }
  if (shouldShowLoading) {
    return <LoadingOverlay />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!hasPermission) {
    const roleStatus = rolesError as { status: number };
    const accessManagementStatus = accessManagementError as { status: number };
    if (roleStatus?.status === 429 || accessManagementStatus?.status === 429) {
      return <TooManyRequests />;
    }
    return (
      <main>
        <UnauthorizedView />
      </main>
    );
  }

  return (
    <main>
      <div className="lg:p-10 p-4 pb-12 animate-in fade-in duration-500">{children}</div>
    </main>
  );
};

export default HasAccess;
