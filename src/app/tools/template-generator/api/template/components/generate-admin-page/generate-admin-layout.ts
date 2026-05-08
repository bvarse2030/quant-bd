/*
|-----------------------------------------
| setting up GenerateAdminLayout for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const generateLayoutFile = (): string => {
  return `'use client';
import { useGetAccessManagementsQuery } from '@/redux/features/accessManagements/accessManagementsSlice';
import { useGetRolesQuery } from '@/redux/features/roles/rolesSlice';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { useEffect, useState } from 'react';
import LoadingComponent from '@/components/common/Loading';

type RoleType = { name: string; dashboard_access_ui?: { name: string; path: string }[] };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const is_active_authorization = process.env.NEXT_PUBLIC_IS_ACTIVE_AUTHORIZATION;

  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const [hasAccess, setHasAccess] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    if (!session?.data?.session && !session?.isPending) {
      router.push('/login');
    }
  }, [session, router]);

  const email = session?.data?.user?.email || '';

  const { data: userAccessManagementQuery, isLoading: isAccessManagementLoading } = useGetAccessManagementsQuery(
    { user_email: email, page: 1, limit: 100 },
    { skip: !email },
  );
  const { data: allRolesQuery, isLoading: isRolesLoading } = useGetRolesQuery({ page: 1, limit: 100 }, { skip: !email });

  useEffect(() => {
    if (email && !isAccessManagementLoading && !isRolesLoading) {
      const assignedRoles = userAccessManagementQuery?.data?.accessManagements?.[0]?.assign_role || [];

      const userRoles = allRolesQuery?.data?.roles?.filter((role: RoleType) => assignedRoles.includes(role.name));

      let canAccess = false;
      if (userRoles && userRoles.length > 0) {
        for (const role of userRoles) {
          const dashboardAccessUI = role.dashboard_access_ui || [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (dashboardAccessUI.some((item: any) => item.path === pathname)) {
            canAccess = true;
            break;
          }
        }
      }
      setHasAccess(canAccess);
      setAccessChecked(true);
    } else if (!email && !session?.isPending) {
      setAccessChecked(true);
      setHasAccess(false);
    }
  }, [email, userAccessManagementQuery, allRolesQuery, isAccessManagementLoading, isRolesLoading, pathname, session?.isPending]);

  if(is_active_authorization === 'false'){
   return <div>{children}</div>;
}
   
  if (session?.isPending || !accessChecked || isAccessManagementLoading || isRolesLoading) {
    return <LoadingComponent />;
  }

  if (!email && accessChecked) {
    return <LoadingComponent />;
  }

  if (hasAccess) {
    return <div>{children}</div>;
  } else {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTQtNHYyaDJ2LTJoLTJ6bTAtNGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="absolute top-20 left-20 h-72 w-72 animate-pulse rounded-full bg-purple-500/30 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-pink-500/20 blur-3xl delay-2000"></div>

        <div className="relative z-10 mx-4 w-full max-w-md animate-fade-in">
          <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:bg-white/15 hover:shadow-purple-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>

            <div className="relative space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-purple-600/20 backdrop-blur-sm">
                    <svg className="h-12 w-12 animate-pulse text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-bounce text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <h2 className="bg-gradient-to-r from-red-200 via-purple-200 to-pink-200 bg-clip-text text-3xl font-bold text-transparent">Access Denied</h2>
                </div>
                <p className="text-base text-slate-200/80">You do not have permission to access this data</p>
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                    <div className="h-2 w-2 rounded-full bg-red-400"></div>
                  </div>
                  <p className="text-sm text-slate-300/90">Your current role doesn&apos;t have access to this resource</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500/20">
                    <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                  </div>
                  <p className="text-sm text-slate-300/90">Contact your administrator to request access</p>
                </div>
              </div>

              <button className="group/btn relative w-full overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-purple-600/80 to-pink-600/80 py-6 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:border-white/30 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl hover:shadow-purple-500/50">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full"></span>
                <span className="relative flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 transition-transform group-hover/btn:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
`;
};
