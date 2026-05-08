/*
|-----------------------------------------
| setting up Utils for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import {
  ShieldCheck,
  FolderKanban,
  FileSignature,
  User,
  Users,
  FileText,
  Settings,
  Info,
  Wrench,
  Phone,
  HelpCircle,
  Menu,
  Lock,
  ScrollText,
  FileBadge,
} from 'lucide-react';

export interface SidebarItem {
  _id?: string;
  sl_no: number;
  name: string;
  path: string;
  icon: React.ReactNode;
  iconName?: string;
  children?: SidebarItem[];
}

export interface DragState {
  activeId: string | null;
  overId: string | null;
  activeItem: SidebarItem | null;
  originalParentId: number | null;
  originalIndex: number;
}

export const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck size={18} />,
  FolderKanban: <FolderKanban size={16} />,
  FileSignature: <FileSignature size={16} />,
  User: <User size={16} />,
  Users: <Users size={16} />,
  FileText: <FileText size={16} />,
  Settings: <Settings size={18} />,
  Info: <Info size={16} />,
  Wrench: <Wrench size={16} />,
  Phone: <Phone size={16} />,
  HelpCircle: <HelpCircle size={16} />,
  Menu: <Menu size={16} />,
  Lock: <Lock size={16} />,
  ScrollText: <ScrollText size={16} />,
  FileBadge: <FileBadge size={16} />,
};

export const iconOptions = Object.keys(iconMap);

export interface SortableItemProps {
  item: SidebarItem;
  onView: (item: SidebarItem) => void;
  onEdit: (item: SidebarItem) => void;
  onDelete: (item: SidebarItem) => void;
  onAddChild?: (parentItem: SidebarItem) => void;
  onToggleCollapse?: (itemId: number) => void;
  isCollapsed?: boolean;
  isChild?: boolean;
  isOverTarget?: boolean;
  isDragging?: boolean;
  dropPosition?: 'before' | 'after' | 'inside' | null;
}
