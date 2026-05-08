
here is example of menuWithClient.tsx 
```
/*
|-----------------------------------------
| setting up MenuClient for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  X,
  Menu,
  Info,
  Phone,
  Users,
  LogIn,
  Settings,
  LucideIcon,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useMemo } from 'react';

import { useSession } from '@/lib/auth-client';

type BrandFontSize = 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
type BrandFontFamily = 'font-sans' | 'font-serif' | 'font-mono';

interface MenuItem {
  id: number;
  name: string;
  path: string;
  iconName?: string;
  imagePath?: string;
  isImagePublish?: boolean;
  isIconPublish?: boolean;
  _id?: string;
  children?: MenuItem[];
}

interface BrandConfiguration {
  brandName: string;
  logoUrl: string | null;
  textColor: string;
  fontSize: BrandFontSize;
  fontFamily: BrandFontFamily;
  menuTextColor: string;
  menuFontSize: BrandFontSize;
  menuFontFamily: BrandFontFamily;
  menuBackgroundColor: string;
  backgroundTransparent: number;
  menuSticky: boolean;
}

interface MenuClientProps {
  initialBrandConfig: BrandConfiguration;
  initialMenuItems: MenuItem[];
}

const parseColorToRgba = (color: string, opacity: number) => {
  if (!color) return `rgba(15, 23, 42, ${opacity / 100})`;
  const alpha = opacity / 100;

  if (color.startsWith('rgba') || color.startsWith('rgb')) {
    const values = color.match(/\d+/g);
    if (values && values.length >= 3) {
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
    }
  }

  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
};

const IconMapper = ({ name, className, color }: { name?: string; className?: string; color?: string }) => {
  const iconMap: { [key: string]: LucideIcon } = {
    Info,
    FolderKanban,
    Menu,
    Phone,
    Settings,
    HelpCircle,
    Users,
    LayoutDashboard,
  };
  const IconComponent = name ? iconMap[name] || HelpCircle : HelpCircle;
  return <IconComponent className={className} style={{ color }} />;
};

const DesktopMenuItem = ({
  item,
  isActive,
  depth = 0,
  config,
}: {
  item: MenuItem;
  isActive: (path: string) => boolean;
  depth?: number;
  config: BrandConfiguration;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const active = isActive(item.path);
  const isRoot = depth === 0;

  return (
    <div className="relative z-50 h-full flex items-center" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Link
        href={item.path}
        className={`
          group flex items-center gap-2 px-5 py-2 transition-all duration-300 rounded-full
          ${config.menuFontSize} ${config.menuFontFamily}
          ${!isRoot && 'justify-between w-full rounded-xl h-auto px-4'}
        `}
        style={{
          color: active ? config.textColor : config.menuTextColor,
          backgroundColor: isHovered ? parseColorToRgba(config.menuTextColor, 10) : 'transparent',
        }}
      >
        <div className="flex items-center gap-3">
          {item.imagePath && item.isImagePublish ? (
            <div className={`relative overflow-hidden rounded-md flex-shrink-0 ${isRoot ? 'w-8 h-5' : 'w-10 h-6'}`}>
              <Image src={item.imagePath} alt={item.name} fill className="object-cover" sizes="40px" />
            </div>
          ) : (
            item.iconName &&
            item.isIconPublish && <IconMapper name={item.iconName} className="w-4 h-4" color={active ? config.textColor : config.menuTextColor} />
          )}
          <span className="relative z-10 whitespace-nowrap font-semibold">{item.name}</span>
        </div>

        {hasChildren &&
          (isRoot ? (
            <ChevronDown size={14} style={{ color: config.menuTextColor }} className={`transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`} />
          ) : (
            <ChevronRight size={14} style={{ color: config.menuTextColor }} />
          ))}
      </Link>

      <AnimatePresence>
        {isHovered && hasChildren && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'circOut' }}
            className="absolute p-2 min-w-[260px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border backdrop-blur-3xl"
            style={{
              backgroundColor: parseColorToRgba(config.menuBackgroundColor, 98),
              borderColor: parseColorToRgba(config.menuTextColor, 15),
              top: isRoot ? '100%' : '0',
              left: isRoot ? '0' : '100%',
              marginTop: isRoot ? '0.75rem' : '0',
              marginLeft: isRoot ? '0' : '0.5rem',
            }}
          >
            <div className="relative z-10 flex flex-col gap-1">
              {item.children?.map(child => (
                <DesktopMenuItem key={child._id || child.id} item={child} isActive={isActive} depth={depth + 1} config={config} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileMenuItem = ({
  item,
  pathname,
  onNavigate,
  level = 0,
  config,
}: {
  item: MenuItem;
  pathname: string;
  onNavigate: () => void;
  level?: number;
  config: BrandConfiguration;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.path;

  return (
    <div className="my-1">
      {hasChildren ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${config.menuFontSize} ${config.menuFontFamily}`}
          style={{
            paddingLeft: `${1 + level}rem`,
            color: config.menuTextColor,
            backgroundColor: isOpen ? parseColorToRgba(config.menuTextColor, 8) : 'transparent',
          }}
        >
          <div className="flex items-center gap-3">
            {item.imagePath && item.isImagePublish && (
              <div className="relative w-10 h-6 rounded overflow-hidden flex-shrink-0">
                <Image src={item.imagePath} alt={item.name} fill className="object-cover" />
              </div>
            )}
            {item.iconName && item.isIconPublish && <IconMapper name={item.iconName} className="w-5 h-5" color={config.menuTextColor} />}
            <span className="font-semibold">{item.name}</span>
          </div>
          <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <Link href={item.path} onClick={onNavigate}>
          <div
            className={`flex items-center gap-3 px-4 py-4 my-1 rounded-2xl transition-all ${config.menuFontSize} ${config.menuFontFamily}`}
            style={{
              paddingLeft: `${1 + level}rem`,
              color: isActive ? config.textColor : config.menuTextColor,
              backgroundColor: isActive ? parseColorToRgba(config.textColor, 12) : 'transparent',
            }}
          >
            {item.imagePath && item.isImagePublish && (
              <div className="relative w-10 h-6 rounded overflow-hidden flex-shrink-0">
                <Image src={item.imagePath} alt={item.name} fill className="object-cover" />
              </div>
            )}
            {item.iconName && item.isIconPublish && (
              <IconMapper name={item.iconName} className="w-5 h-5" color={isActive ? config.textColor : config.menuTextColor} />
            )}
            <span className="font-semibold">{item.name}</span>
          </div>
        </Link>
      )}
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="py-1 flex flex-col">
              {item.children?.map(child => (
                <MobileMenuItem key={child._id || child.id} item={child} pathname={pathname} onNavigate={onNavigate} level={level + 0.5} config={config} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuClient: React.FC<MenuClientProps> = ({ initialBrandConfig, initialMenuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [brandConfig, setBrandConfig] = useState<BrandConfiguration>(initialBrandConfig);
  const pathname = usePathname();
  const session = useSession();
  const isLoggedIn = !!session?.data?.session;

  useEffect(() => {
    const fetchBrandSettings = async () => {
      try {
        const response = await fetch('/api/brand-settings', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (data) setBrandConfig(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Update fetch error', error);
      }
    };
    const handleUpdate = () => fetchBrandSettings();
    if (typeof window !== 'undefined') {
      window.addEventListener('brand-settings-updated', handleUpdate);
      fetchBrandSettings();
    }
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('brand-settings-updated', handleUpdate);
    };
  }, []);

  const navStyles = useMemo(() => {
    const bgColor = parseColorToRgba(brandConfig.menuBackgroundColor, brandConfig.backgroundTransparent);
    return {
      backgroundColor: bgColor,
      position: (brandConfig.menuSticky ? 'fixed' : 'relative') as 'fixed' | 'relative',
      backdropFilter: brandConfig.backgroundTransparent < 100 ? 'blur(24px)' : 'none',
      borderBottom: `1px solid ${parseColorToRgba(brandConfig.menuTextColor, 15)}`,
      boxShadow: `0 10px 40px -10px ${parseColorToRgba(brandConfig.menuBackgroundColor, 30)}`,
    };
  }, [brandConfig]);

  return (
    <nav style={navStyles} className="top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out">
      <div className="container mx-auto px-4 lg:px-10">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-4 z-50 group">
            {brandConfig.logoUrl ? (
              <div className="relative h-10 w-auto lg:h-12 transition-transform duration-300 group-hover:scale-105">
                <Image src={brandConfig.logoUrl} alt={brandConfig.brandName} width={160} height={50} className="h-full w-auto object-contain" priority />
              </div>
            ) : (
              <div className="p-2.5 rounded-2xl shadow-xl group-hover:rotate-6 transition-transform" style={{ backgroundColor: brandConfig.textColor }}>
                <GraduationCap style={{ color: brandConfig.menuBackgroundColor }} className="w-6 h-6 lg:w-8 lg:h-8" />
              </div>
            )}
            <span className={`${brandConfig.fontSize} ${brandConfig.fontFamily} font-black tracking-tight`} style={{ color: brandConfig.textColor }}>
              {brandConfig.brandName}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-2 h-full">
            {initialMenuItems.map(item => (
              <DesktopMenuItem key={item._id || item.id} item={item} isActive={path => pathname === path} config={brandConfig} />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)] transition-all"
                    style={{ backgroundColor: brandConfig.textColor, color: brandConfig.menuBackgroundColor }}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </motion.button>
                </Link>
              ) : (
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold border transition-all"
                    style={{
                      borderColor: parseColorToRgba(brandConfig.menuTextColor, 30),
                      color: brandConfig.menuTextColor,
                      backgroundColor: parseColorToRgba(brandConfig.menuTextColor, 5),
                    }}
                  >
                    <LogIn size={18} />
                    Login
                  </motion.button>
                </Link>
              )}
            </div>
            <button
              className="lg:hidden p-3 rounded-2xl transition-all active:scale-90"
              style={{ color: brandConfig.menuTextColor, backgroundColor: parseColorToRgba(brandConfig.menuTextColor, 12) }}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden border-t"
            style={{ backgroundColor: brandConfig.menuBackgroundColor, borderColor: parseColorToRgba(brandConfig.menuTextColor, 10) }}
          >
            <div className="flex flex-col p-6 space-y-2 max-h-[85vh] overflow-y-auto custom-scrollbar">
              {initialMenuItems.map(item => (
                <MobileMenuItem key={item._id || item.id} item={item} pathname={pathname} onNavigate={() => setIsOpen(false)} config={brandConfig} />
              ))}
              <div className="pt-8 pb-4 space-y-4">
                {isLoggedIn ? (
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <div
                      className="flex items-center justify-center gap-3 px-4 py-4 rounded-2xl font-black shadow-xl"
                      style={{ backgroundColor: brandConfig.textColor, color: brandConfig.menuBackgroundColor }}
                    >
                      <LayoutDashboard className="w-6 h-6" />
                      Dashboard
                    </div>
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <div
                      className="flex items-center justify-center gap-3 px-4 py-4 rounded-2xl font-black border transition-all"
                      style={{
                        borderColor: parseColorToRgba(brandConfig.menuTextColor, 25),
                        color: brandConfig.menuTextColor,
                        backgroundColor: parseColorToRgba(brandConfig.menuTextColor, 5),
                      }}
                    >
                      <LogIn className="w-6 h-6" />
                      Login
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MenuClient;
```

I use session inside this div. 


here is example of hasAccess.tsx 
```
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
``` 

You can found example of role from HasAccess

and here is page.tsx 
```
/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Quant BD, May, 2026
|-----------------------------------------
*/
import { useSession } from '@/lib/auth-client';

const Page = () => {
  return <main>Page</main>;
};
export default Page;

```


Now your task is update page.tsx with the following instructions.
First it check Is the user Login or not 
    - if not login then 
        - Display a Div "Pelase login first"
    - if log in 
        - render div as role.

        - Quant Admin: QuantAdminDiv
        - Quant Researcher: QuantResearcherDiv
        - Quant Trader: QuantTraderDiv


