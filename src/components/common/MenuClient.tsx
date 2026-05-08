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
