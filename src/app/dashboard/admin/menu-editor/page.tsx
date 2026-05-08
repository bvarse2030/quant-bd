/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  X,
  Eye,
  Plus,
  Save,
  Check,
  Edit2,
  Trash2,
  Tablet,
  EyeOff,
  Search,
  Loader2,
  ArrowUp,
  Monitor,
  ArrowDown,
  Smartphone,
  UploadCloud,
  ChevronDown,
  ArrowUpDown,
  GripVertical,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Cropper, { Area } from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import {
  useSensor,
  DndContext,
  useSensors,
  DragOverlay,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  pointerWithin,
  KeyboardSensor,
  DragStartEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { IMenuItem } from '@/app/api/menu-editor/model';
import { ScrollArea } from '@/components/ui/scroll-area';
import { iconMap, iconOptions } from '@/components/all-icons/all-icons-jsx';
import { useGetMenuQuery, useUpdateMenuMutation } from '@/redux/features/menu-editor/menuEditorSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

import BrandSettingsEditor from './BrandSettingsEditor';

interface SidebarItem {
  id: number;
  name: string;
  path: string;
  icon: React.ReactNode;
  iconName?: string;
  imagePath?: string;
  isImagePublish?: boolean;
  isIconPublish?: boolean;
  children?: SidebarItem[];
}

interface DragState {
  activeId: string | null;
  overId: string | null;
  activeItem: SidebarItem | null;
  originalParentId: number | null;
  originalGrandParentId: number | null;
  originalIndex: number;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: Area, targetWidth = 120, targetHeight = 60): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas is empty'));
      },
      'image/jpeg',
      0.95,
    );
  });
}

const FormToggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (val: boolean) => void }) => (
  <div
    onClick={() => onChange(!checked)}
    className={`
      flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none
      ${checked ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}
    `}
  >
    <span className={`text-xs font-medium ${checked ? 'text-blue-200' : 'text-gray-400'}`}>{label}</span>
    <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${checked ? 'bg-blue-500' : 'bg-white/20'}`}>
      <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  </div>
);

interface MenuImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

function MenuImageUploader({ value, onChange, label = 'Menu Image' }: MenuImageUploaderProps) {
  const [viewState, setViewState] = useState<'preview' | 'crop' | 'library'>('preview');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const [allAvailableImages, setAllAvailableImages] = useState<string[]>([]);

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch('/api/media/v1');
      if (!response.ok) return;
      const data = await response.json();
      if (data?.data && Array.isArray(data.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAllAvailableImages(data.data.map((i: any) => i.url));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl as string);
      setViewState('crop');
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    }
  };

  const readFile = (file: File) => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsLoading(true);
    setLoadingText('Cropping...');

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 120, 60);
      const croppedFile = new File([croppedBlob], 'menu-item.jpg', { type: 'image/jpeg' });

      setLoadingText('Compressing...');
      const compressionOptions = {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 200,
        useWebWorker: true,
        fileType: 'image/jpeg',
      };

      const compressedFile = await imageCompression(croppedFile, compressionOptions);

      setLoadingText('Uploading...');
      const formData = new FormData();
      formData.append('image', compressedFile);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const newUrl = data.data.url;
        await fetch('/api/media/v1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            delete_url: data.data.delete_url,
            url: newUrl,
            display_url: data.data.display_url,
          }),
        });

        onChange(newUrl);
        setViewState('preview');
        setImageSrc(null);
        toast.success('Image processed & uploaded!');
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to process image');
    } finally {
      setIsLoading(false);
      setLoadingText('');
    }
  };

  const handleSelectFromLibrary = (url: string) => {
    onChange(url);
    setViewState('preview');
  };

  if (viewState === 'crop' && imageSrc) {
    return (
      <div className="w-full h-[320px] text-white bg-black/40 rounded-xl relative overflow-hidden flex flex-col border border-white/20 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative flex-1 bg-[url('https://transparenttextures.com/patterns/stardust.png')]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={2 / 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="contain"
            showGrid={true}
          />
        </div>
        <div className="h-16 bg-slate-900/95 backdrop-blur border-t border-white/10 flex items-center justify-between px-4 gap-4 z-10">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setViewState('preview');
                setImageSrc(null);
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleUploadCroppedImage} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white min-w-[100px]">
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                  {loadingText || 'Processing'}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex justify-between items-end">
        <Label className="text-xs font-bold uppercase text-white/60 tracking-wider">{label}</Label>
        {value && (
          <button onClick={() => onChange('')} className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
            <Trash2 size={10} /> Remove Image
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10 transition-colors hover:bg-white/[0.07]">
        <div className="relative w-[120px] h-[60px] bg-black/40 border border-white/10 rounded-md overflow-hidden flex-shrink-0 group shadow-inner">
          {value ? (
            <Image src={value} alt="Preview" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/50 gap-1">
              <ImageIcon size={18} />
              <span className="text-[9px]">Empty</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[10px] text-white font-medium">Change</span>
          </div>
          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={onSelectFile} title="Change image" />
        </div>

        <div className="flex flex-col justify-between h-[60px] flex-1 py-0.5">
          <div className="flex gap-2">
            <div className="relative">
              <Button variant="outlineGlassy" size="sm">
                <UploadCloud size={12} className="mr-1.5" /> Upload New
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onSelectFile} />
              </Button>
            </div>
            <Button
              variant="outlineGlassy"
              size="sm"
              onClick={() => {
                setViewState('library');
                fetchImages();
              }}
            >
              <Search size={12} className="mr-1.5" /> Library
            </Button>
          </div>
          <p className="text-[10px] text-gray-50/50 font-mono">Size: 120x60px • Auto-Compressed</p>
        </div>
      </div>

      <AnimatePresence>
        {viewState === 'library' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border border-white/10 rounded-xl bg-slate-950/80 backdrop-blur-md mt-2 shadow-2xl"
          >
            <div className="p-2.5 flex justify-between items-center bg-white/5 border-b border-white/10">
              <span className="text-xs font-semibold text-white/80">Select from Media Library</span>
              <Button size="icon" variant="ghost" className="h-5 w-5 rounded-full hover:bg-white/10" onClick={() => setViewState('preview')}>
                <X size={12} />
              </Button>
            </div>
            <ScrollArea className="h-48 p-2">
              {allAvailableImages.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {allAvailableImages.map((img, idx) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={idx}
                      onClick={() => handleSelectFromLibrary(img)}
                      className="aspect-[2/1] relative rounded border border-white/10 overflow-hidden cursor-pointer group hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/50 transition-all"
                    >
                      <Image src={img} fill alt="lib" className="object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <ImageIcon size={24} className="mb-2 opacity-50" />
                  <span className="text-xs">No images found in library</span>
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width >= 768 && width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

const initialData: SidebarItem[] = [];

interface SortableItemProps {
  item: SidebarItem;
  onView: (item: SidebarItem) => void;
  onEdit: (item: SidebarItem) => void;
  onDelete: (item: SidebarItem) => void;
  onAddChild?: (parentItem: SidebarItem) => void;
  onToggleCollapse?: (itemId: number) => void;
  onReorderRequest?: (item: SidebarItem) => void;
  isCollapsed?: boolean;
  level?: number;
  isOverTarget?: boolean;
  isDragging?: boolean;
  dropPosition?: 'before' | 'after' | 'inside' | null;
  deviceType: DeviceType;
}

function SortableItem({
  item,
  onView,
  onEdit,
  onDelete,
  onAddChild,
  onToggleCollapse,
  onReorderRequest,
  isCollapsed = false,
  level = 0,
  isOverTarget = false,
  isDragging = false,
  dropPosition = null,
  deviceType,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id.toString(),
    disabled: deviceType !== 'desktop',
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const hasChildren = item.children && item.children.length > 0;

  const getBorderClass = () => {
    if (!isOverTarget) return 'border border-white/10 hover:border-white/30';
    if (dropPosition === 'inside') return 'border-2 border-purple-400 ring-2 ring-purple-400/50';
    if (dropPosition === 'before') return 'border-t-4 border-t-blue-400 border-x border-b border-white/20';
    if (dropPosition === 'after') return 'border-b-4 border-b-blue-400 border-x border-t border-white/20';
    return 'border-2 border-blue-400 ring-2 ring-blue-400/50';
  };

  const getLevelStyles = () => {
    const styles = [
      { bg: 'from-blue-500/20 to-purple-500/20', text: 'text-blue-200', ml: '' },
      { bg: 'from-emerald-500/20 to-teal-500/20', text: 'text-emerald-200', ml: 'ml-4 sm:ml-6' },
      { bg: 'from-orange-500/20 to-pink-500/20', text: 'text-orange-200', ml: 'ml-8 sm:ml-12' },
    ];
    return styles[level] || styles[0];
  };

  const levelStyle = getLevelStyles();
  const canAddChild = level < 2;
  const isDesktop = deviceType === 'desktop';

  const iconOpacity = item.isIconPublish === false ? 'opacity-30 grayscale' : 'opacity-100';
  const imageOpacity = item.isImagePublish === false ? 'opacity-30 grayscale' : 'opacity-100';

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      layoutId={item.id.toString()}
      className={`group relative backdrop-blur-md bg-white/5 rounded-xl p-2 sm:p-2.5 shadow-sm hover:shadow-md hover:bg-white/10 transition-all duration-200 ${
        levelStyle.ml
      } ${getBorderClass()}`}
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-col xl:flex-row">
        <div className="flex items-center gap-3 w-full overflow-hidden">
          <div className="flex items-center gap-1 flex-shrink-0">
            {isDesktop ? (
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-gray-200 touch-none"
              >
                <GripVertical size={18} />
              </div>
            ) : (
              <Button
                onClick={e => {
                  e.stopPropagation();
                  onReorderRequest?.(item);
                }}
                variant="outline"
                className="min-w-0 h-8 w-8 p-0 bg-white/5 border-white/10"
                size="sm"
              >
                <ArrowUpDown size={15} />
              </Button>
            )}

            <div className="w-6 flex justify-center">
              {hasChildren && (
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    onToggleCollapse?.(item.id);
                  }}
                  variant="outline"
                  className="min-w-0 ml-3 h-8 w-8 p-0 bg-white/5 border-white/10"
                  size="sm"
                >
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`relative p-2 bg-gradient-to-br ${levelStyle.bg} rounded-lg shadow-sm border border-white/5 flex-shrink-0 transition-all ${iconOpacity}`}
            >
              {item.icon}
              {item.isIconPublish === false && (
                <div className="absolute -top-1 -right-1 text-red-300 bg-red-900/80 rounded-full p-0.5 border border-red-500/50">
                  <EyeOff size={10} />
                </div>
              )}
            </div>

            {item.imagePath && (
              <div
                className={`hidden sm:block relative w-16 h-8 rounded overflow-hidden border border-white/10 flex-shrink-0 shadow-sm transition-all ${imageOpacity}`}
              >
                <Image src={item.imagePath} alt="Menu Img" fill className="object-cover" />
                {item.isImagePublish === false && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <EyeOff size={14} className="text-white/80" />
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col justify-center min-w-0">
              <span className={`font-semibold text-sm leading-tight ${levelStyle.text} truncate`}>{item.name}</span>
              <span className="text-[11px] text-gray-200/70 truncate font-mono mt-0.5">{item.path}</span>
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-end w-full gap-1 ${isDesktop ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} transition-opacity`}>
          <Button onClick={() => onView(item)} variant="outline" size="icon" className="min-w-1 bg-white/5 border-white/10 hover:bg-white/20" title="View">
            <Eye size={14} />
          </Button>

          <Button onClick={() => onEdit(item)} variant="outline" size="icon" className="min-w-1 bg-white/5 border-white/10 hover:bg-white/20" title="Edit">
            <Edit2 size={14} />
          </Button>

          <Button
            onClick={() => onDelete(item)}
            variant="outline"
            size="icon"
            className="min-w-1 bg-rose-400 border-rose-300 hover:bg-red-600 text-rose-50 hover:text-rose-100"
            title="Delete"
          >
            <Trash2 size={14} />
          </Button>

          {canAddChild && onAddChild && (
            <Button
              onClick={() => onAddChild(item)}
              variant="outline"
              size="icon"
              className="min-w-1 bg-white/5 border-white/10 hover:bg-white/20"
              title="Add Child"
            >
              <Plus size={14} />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DropZone({ id, label, isOver }: { id: string; label: string; isOver: boolean }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`h-14 rounded-xl border-2 border-dashed transition-all duration-300 flex items-center justify-center gap-2 ${
        isOver
          ? 'border-emerald-400 bg-emerald-400/10 scale-[1.02] shadow-[0_0_20px_rgba(52,211,153,0.3)]'
          : 'border-white/10 bg-white/20 hover:border-white/20 hover:bg-white/10'
      }`}
    >
      <Plus size={18} className={isOver ? 'text-emerald-50' : 'text-gray-50'} />
      <span className={`text-sm font-medium transition-colors ${isOver ? 'text-emerald-50' : 'text-gray-50'}`}>{label}</span>
    </div>
  );
}

export default function SiteMenuPage() {
  const { data: menuData, isLoading } = useGetMenuQuery('main-menu');
  const [updateMenu, { isLoading: isUpdating }] = useUpdateMenuMutation();
  const deviceType = useDeviceType();

  const [menuItems, setMenuItems] = useState<SidebarItem[]>(initialData);
  const [viewItem, setViewItem] = useState<SidebarItem | null>(null);
  const [editItem, setEditItem] = useState<SidebarItem | null>(null);
  const [addParentItem, setAddParentItem] = useState<SidebarItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<SidebarItem | null>(null);
  const [reorderItem, setReorderItem] = useState<SidebarItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    path: '',
    iconName: 'Menu',
    imagePath: '',
    isImagePublish: true,
    isIconPublish: true,
  });
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set());
  const [iconSearch, setIconSearch] = useState('');

  const [showBrandSettings, setShowBrandSettings] = useState(false);

  useEffect(() => {
    if (menuData?.data?.items) {
      const mapItems = (items: IMenuItem[]): SidebarItem[] => {
        return items.map(item => {
          const IconComp = iconMap[item.iconName || 'Menu'] || iconMap.Menu;
          return {
            id: item.id,
            name: item.name,
            path: item.path,
            iconName: item.iconName,
            imagePath: item.imagePath || '',
            isImagePublish: item.isImagePublish ?? true,
            isIconPublish: item.isIconPublish ?? true,
            icon: <IconComp size={18} />,
            children: item.children ? mapItems(item.children) : [],
          };
        });
      };
      setMenuItems(mapItems(menuData.data.items));
    }
  }, [menuData]);

  useEffect(() => {
    if (!editItem && !isAddingNew && !addParentItem) {
      setIconSearch('');
      setFormData({
        name: '',
        path: '',
        iconName: 'Menu',
        imagePath: '',
        isImagePublish: true,
        isIconPublish: true,
      });
    }
  }, [editItem, isAddingNew, addParentItem]);

  const filteredIcons = useMemo(() => {
    if (!iconSearch) return iconOptions.slice(0, 100);
    return iconOptions.filter(i => i.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [iconSearch]);

  const findItemById = useCallback(
    (
      id: string,
      items: SidebarItem[] = menuItems,
    ): { item: SidebarItem; parentId: number | null; grandParentId: number | null; index: number; level: number } | null => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.id.toString() === id) {
          return { item, parentId: null, grandParentId: null, index: i, level: 0 };
        }
        if (item.children) {
          for (let j = 0; j < item.children.length; j++) {
            const child = item.children[j];
            if (child.id.toString() === id) {
              return { item: child, parentId: item.id, grandParentId: null, index: j, level: 1 };
            }
            if (child.children) {
              for (let k = 0; k < child.children.length; k++) {
                if (child.children[k].id.toString() === id) {
                  return {
                    item: child.children[k],
                    parentId: child.id,
                    grandParentId: item.id,
                    index: k,
                    level: 2,
                  };
                }
              }
            }
          }
        }
      }
      return null;
    },
    [menuItems],
  );

  const [dragState, setDragState] = useState<DragState>({
    activeId: null,
    overId: null,
    activeItem: null,
    originalParentId: null,
    originalGrandParentId: null,
    originalIndex: -1,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const getAllSortableIds = (): string[] => {
    const ids: string[] = ['drop-zone-top'];
    const traverse = (items: SidebarItem[]) => {
      items.forEach(item => {
        ids.push(item.id.toString());
        if (item.children) traverse(item.children);
      });
    };
    traverse(menuItems);
    return ids;
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (deviceType !== 'desktop') return;
    const activeId = event.active.id.toString();
    const result = findItemById(activeId);
    if (result) {
      setDragState({
        activeId,
        overId: null,
        activeItem: result.item,
        originalParentId: result.parentId,
        originalGrandParentId: result.grandParentId,
        originalIndex: result.index,
      });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (deviceType !== 'desktop') return;
    const overId = event.over?.id?.toString() || null;
    setDragState(prev => ({ ...prev, overId }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (deviceType !== 'desktop') {
      setDragState({ activeId: null, overId: null, activeItem: null, originalParentId: null, originalGrandParentId: null, originalIndex: -1 });
      return;
    }

    const { active, over } = event;
    if (!over) {
      handleDragCancel();
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) {
      handleDragCancel();
      return;
    }

    const activeResult = findItemById(activeId);
    const overResult = overId === 'drop-zone-top' ? null : findItemById(overId);

    if (!activeResult) {
      handleDragCancel();
      return;
    }

    const removeItem = (items: SidebarItem[], id: number): SidebarItem[] => {
      return items.filter(i => i.id !== id).map(i => ({ ...i, children: i.children ? removeItem(i.children, id) : [] }));
    };

    const addItem = (items: SidebarItem[], targetId: number, itemToAdd: SidebarItem): SidebarItem[] => {
      return items.map(i => {
        if (i.id === targetId) return { ...i, children: [...(i.children || []), itemToAdd] };
        if (i.children) return { ...i, children: addItem(i.children, targetId, itemToAdd) };
        return i;
      });
    };

    setMenuItems(prevItems => {
      let newItems = [...prevItems];
      const itemToMove = { ...activeResult.item };

      newItems = removeItem(newItems, itemToMove.id);

      if (overId === 'drop-zone-top') {
        delete itemToMove.children;
        newItems = [itemToMove, ...newItems];
        toast.success('Moved to Top Level');
        return newItems;
      }

      if (!overResult) return prevItems;

      const isDroppingInside =
        (overResult.level < 2 && activeResult.level > overResult.level) || (overResult.level < 2 && activeResult.parentId !== overResult.item.id);

      if (isDroppingInside && !dragState.overId?.includes(activeResult.item.id.toString())) {
        newItems = addItem(newItems, overResult.item.id, itemToMove);
        return newItems;
      }

      if (activeResult.parentId === overResult.parentId) {
        const reorderInTree = (items: SidebarItem[]): SidebarItem[] => {
          if (activeResult.parentId === null) {
            const idx1 = items.findIndex(i => i.id === activeResult.item.id);
            const idx2 = items.findIndex(i => i.id === overResult.item.id);
            return arrayMove(items, idx1, idx2);
          }
          return items.map(item => {
            if (item.id === activeResult.parentId) {
              const idx1 = item.children!.findIndex(i => i.id === activeResult.item.id);
              const idx2 = item.children!.findIndex(i => i.id === overResult.item.id);
              return { ...item, children: arrayMove(item.children!, idx1, idx2) };
            }
            if (item.children) return { ...item, children: reorderInTree(item.children) };
            return item;
          });
        };
        return reorderInTree(prevItems);
      }

      newItems = addItem(newItems, overResult.item.id, itemToMove);
      return newItems;
    });

    handleDragCancel();
  };

  const handleDragCancel = () => {
    setDragState({
      activeId: null,
      overId: null,
      activeItem: null,
      originalParentId: null,
      originalGrandParentId: null,
      originalIndex: -1,
    });
  };

  const handleManualMove = (direction: 'up' | 'down') => {
    if (!reorderItem) return;

    const cloneItems = (items: SidebarItem[]): SidebarItem[] => {
      return items.map(item => ({
        ...item,
        children: item.children ? cloneItems(item.children) : [],
      }));
    };

    const deepClone = cloneItems(menuItems);
    const result = findItemById(reorderItem.id.toString(), deepClone);

    if (!result) return;

    const { parentId, index } = result;
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    let targetArray: SidebarItem[] = deepClone;

    if (parentId !== null) {
      const findParent = (items: SidebarItem[]): SidebarItem | undefined => {
        for (const item of items) {
          if (item.id === parentId) return item;
          if (item.children) {
            const found = findParent(item.children);
            if (found) return found;
          }
        }
        return undefined;
      };
      const parentItem = findParent(deepClone);
      if (parentItem && parentItem.children) {
        targetArray = parentItem.children;
      }
    }

    if (newIndex < 0 || newIndex >= targetArray.length) {
      toast.info(`Cannot move further ${direction}`);
      return;
    }

    [targetArray[index], targetArray[newIndex]] = [targetArray[newIndex], targetArray[index]];

    setMenuItems(deepClone);
    toast.success(`Item moved ${direction}`);
  };

  const handleToggleCollapse = (itemId: number) => {
    setCollapsedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) newSet.delete(itemId);
      else newSet.add(itemId);
      return newSet;
    });
  };

  const handleDelete = (item: SidebarItem) => setDeleteItem(item);

  const confirmDelete = () => {
    if (!deleteItem) return;
    const removeItemRecursive = (items: SidebarItem[]): SidebarItem[] => {
      return items
        .filter(i => i.id !== deleteItem.id)
        .map(i => ({
          ...i,
          children: i.children ? removeItemRecursive(i.children) : [],
        }));
    };
    setMenuItems(prev => removeItemRecursive(prev));
    toast.success(`"${deleteItem.name}" deleted successfully!`);
    setDeleteItem(null);
  };

  const handleEditSave = () => {
    if (!editItem) return;
    const IconComp = iconMap[formData.iconName] || iconMap.Menu;

    const updateRecursive = (items: SidebarItem[]): SidebarItem[] => {
      return items.map(item => {
        if (item.id === editItem.id) {
          return {
            ...item,
            name: formData.name,
            path: formData.path,
            imagePath: formData.imagePath,
            isImagePublish: formData.isImagePublish,
            isIconPublish: formData.isIconPublish,
            icon: <IconComp size={18} />,
            iconName: formData.iconName,
          };
        }
        if (item.children) return { ...item, children: updateRecursive(item.children) };
        return item;
      });
    };
    setMenuItems(prev => updateRecursive(prev));
    toast.success(`"${formData.name}" updated!`);
    setEditItem(null);
    setFormData({ name: '', path: '', iconName: 'Menu', imagePath: '', isImagePublish: true, isIconPublish: true });
  };

  const handleAddNew = () => {
    if (!formData.name || !formData.path) {
      toast.error('Fill all fields');
      return;
    }
    const IconComp = iconMap[formData.iconName] || iconMap.Menu;

    const newItem: SidebarItem = {
      id: Date.now(),
      name: formData.name,
      path: formData.path,
      imagePath: formData.imagePath,
      isImagePublish: formData.isImagePublish,
      isIconPublish: formData.isIconPublish,
      icon: <IconComp size={18} />,
      iconName: formData.iconName,
      children: [],
    };
    setMenuItems(prev => [...prev, newItem]);
    toast.success('Added new item');
    setIsAddingNew(false);
    setFormData({ name: '', path: '', iconName: 'Menu', imagePath: '', isImagePublish: true, isIconPublish: true });
  };

  const handleAddChild = () => {
    if (!addParentItem || !formData.name) return;
    const IconComp = iconMap[formData.iconName] || iconMap.Menu;

    const newItem: SidebarItem = {
      id: Date.now(),
      name: formData.name,
      path: formData.path,
      imagePath: formData.imagePath,
      isImagePublish: formData.isImagePublish,
      isIconPublish: formData.isIconPublish,
      icon: <IconComp size={18} />,
      iconName: formData.iconName,
      children: [],
    };
    const addRecursive = (items: SidebarItem[]): SidebarItem[] => {
      return items.map(item => {
        if (item.id === addParentItem.id) {
          return { ...item, children: [...(item.children || []), newItem] };
        }
        if (item.children) return { ...item, children: addRecursive(item.children) };
        return item;
      });
    };
    setMenuItems(prev => addRecursive(prev));
    toast.success('Added submenu item');
    setAddParentItem(null);
    setFormData({ name: '', path: '', iconName: 'Menu', imagePath: '', isImagePublish: true, isIconPublish: true });
  };

  const handleSubmit = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clean = (items: SidebarItem[]): any[] =>
        items.map(i => ({
          id: i.id,
          name: i.name,
          path: i.path,
          iconName: i.iconName,
          imagePath: i.imagePath,
          isImagePublish: i.isImagePublish,
          isIconPublish: i.isIconPublish,
          children: i.children ? clean(i.children) : [],
        }));
      await updateMenu({ type: 'main-menu', items: clean(menuItems) }).unwrap();
      toast.success('Menu saved successfully!');
    } catch {
      toast.error('Failed to save menu');
    }
  };

  const getDropPosition = (overId: string, activeId: string) => {
    if (!overId || overId === activeId) return null;
    const overItem = findItemById(overId);
    const activeItem = findItemById(activeId);
    if (!overItem || !activeItem) return null;
    if (overItem.level < 2 && activeItem.level > overItem.level) return 'inside';
    return 'after';
  };

  const renderRecursive = (items: SidebarItem[], level: number = 0) => {
    return items.map(item => (
      <div key={item.id} className="space-y-2 mt-2 first:mt-0">
        <SortableItem
          item={item}
          onView={setViewItem}
          onEdit={i => {
            setEditItem(i);
            setFormData({
              name: i.name,
              path: i.path,
              iconName: i.iconName || 'Menu',
              imagePath: i.imagePath || '',
              isImagePublish: i.isImagePublish ?? true,
              isIconPublish: i.isIconPublish ?? true,
            });
          }}
          onDelete={handleDelete}
          onAddChild={level < 2 ? setAddParentItem : undefined}
          onToggleCollapse={handleToggleCollapse}
          onReorderRequest={setReorderItem}
          isCollapsed={collapsedItems.has(item.id)}
          level={level}
          isOverTarget={dragState.overId === item.id.toString()}
          isDragging={dragState.activeId === item.id.toString()}
          dropPosition={getDropPosition(dragState.overId || '', dragState.activeId || '')}
          deviceType={deviceType}
        />

        {item.children && item.children.length > 0 && !collapsedItems.has(item.id) && (
          <motion.div
            className="space-y-2 relative"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={`absolute left-[${level * 20 + 20}px] top-0 bottom-0 w-px bg-white/10`} />
            {renderRecursive(item.children, level + 1)}
          </motion.div>
        )}
      </div>
    ));
  };

  const renderIconGrid = () => (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          value={iconSearch}
          onChange={e => setIconSearch(e.target.value)}
          placeholder="Search icons..."
          className="pl-8 h-8 bg-white/5 border-white/10 text-xs"
        />
      </div>
      <ScrollArea className="h-48 border border-white/10 rounded-lg p-2 bg-white/5">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {filteredIcons.map(iconName => {
            const IconComp = iconMap[iconName];
            if (!IconComp) return null;
            const isSelected = formData.iconName === iconName;

            return (
              <button
                key={iconName}
                type="button"
                onClick={() => setFormData({ ...formData, iconName: iconName })}
                className={`
                  flex flex-col items-center justify-center p-2 rounded gap-1 transition-all h-16
                  border 
                  ${
                    isSelected
                      ? 'bg-blue-600 text-white scale-105 border-blue-500 shadow-md'
                      : 'bg-transparent text-gray-400 border-transparent hover:bg-white/10 hover:border-white/20 hover:text-white'
                  }
                `}
                title={iconName}
              >
                <IconComp size={18} />
                <span className="text-[9px] w-full text-center truncate px-1">{iconName}</span>
              </button>
            );
          })}
        </div>
        {filteredIcons.length === 0 && <div className="text-center text-gray-500 text-xs py-8">No icons found</div>}
      </ScrollArea>
    </div>
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 p-2 font-sans text-slate-100">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            {deviceType === 'mobile' && <Smartphone size={100} />}
            {deviceType === 'tablet' && <Tablet size={100} />}
            {deviceType === 'desktop' && <Monitor size={100} />}
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
            <div>
              <h1 className="text-2xl sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">Menu Editor</h1>
            </div>

            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <Button onClick={() => setShowBrandSettings(!showBrandSettings)} variant="outlineGlassy" size="sm">
                <Edit2 size={18} className="mr-2" />
                {showBrandSettings ? 'Hide Logo' : 'Edit Logo'}
              </Button>
              <Button onClick={() => setIsAddingNew(true)} variant="outlineGlassy" size="sm">
                <Plus size={18} className="mr-2" />
                New Item
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showBrandSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <BrandSettingsEditor />
            </motion.div>
          )}
        </AnimatePresence>

        {deviceType === 'desktop' && (
          <div className="hidden lg:block min-h-[400px]">
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext items={getAllSortableIds()} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  <DropZone id="drop-zone-top" label="Drop here to move to top level" isOver={dragState.overId === 'drop-zone-top'} />
                  {isLoading ? (
                    <div className="flex justify-center p-10">
                      <Loader2 className="animate-spin" />
                    </div>
                  ) : (
                    renderRecursive(menuItems)
                  )}
                </div>
              </SortableContext>
              <DragOverlay dropAnimation={null}>
                {dragState.activeItem ? (
                  <div className="backdrop-blur-xl bg-slate-800/90 border border-blue-400/50 rounded-xl p-3 shadow-2xl flex items-center gap-3 w-[300px]">
                    <div className="p-2 bg-blue-50/50 rounded-lg">{dragState.activeItem.icon}</div>
                    <span className="font-semibold text-white">{dragState.activeItem.name}</span>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        )}

        {deviceType === 'tablet' && (
          <div className="hidden md:block lg:hidden min-h-[400px]">
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-200 text-sm flex items-center gap-3">
                <Tablet size={20} />
                <span>Tablet Mode: Dragging disabled. Use arrows to reorder.</span>
              </div>
              {isLoading ? (
                <div className="flex justify-center p-10">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                renderRecursive(menuItems)
              )}
            </div>
          </div>
        )}

        {deviceType === 'mobile' && (
          <div className="block md:hidden min-h-[400px]">
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex justify-center p-10">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                renderRecursive(menuItems)
              )}
            </div>
          </div>
        )}

        <div className="w-full flex items-center justify-end mb-4">
          <Button
            onClick={handleSubmit}
            disabled={isUpdating}
            variant="outline"
            className="bg-emerald-600/20 border-emerald-500/50 text-emerald-100 hover:bg-emerald-600/40"
            size="lg"
          >
            {isUpdating ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
            Save Changes
          </Button>
        </div>
      </motion.div>

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4">
              {viewItem.imagePath && viewItem.isImagePublish !== false && (
                <div className="w-full h-32 relative rounded-lg overflow-hidden border border-white/10 mb-4 bg-white/5">
                  <Image src={viewItem.imagePath} fill alt="Cover" className="object-cover" />
                </div>
              )}
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                {viewItem.isIconPublish !== false && <div className="p-3 bg-blue-500/20 rounded-lg scale-125">{viewItem.icon}</div>}
                <div>
                  <h3 className="text-xl font-bold">{viewItem.name}</h3>
                  <p className="text-sm text-gray-400">{viewItem.path}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-2">
                <div className="flex items-center gap-2">
                  <span>Icon Status:</span>
                  <span className={viewItem.isIconPublish === false ? 'text-red-400' : 'text-emerald-400'}>
                    {viewItem.isIconPublish === false ? 'Hidden' : 'Published'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Image Status:</span>
                  <span className={viewItem.isImagePublish === false ? 'text-red-400' : 'text-emerald-400'}>
                    {viewItem.isImagePublish === false ? 'Hidden' : 'Published'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white overflow-y-auto max-h-[85vh] sm:max-w-lg mt-[45px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10 focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Path</Label>
              <Input
                value={formData.path}
                onChange={e => setFormData({ ...formData, path: e.target.value })}
                className="bg-white/5 border-white/10 focus:border-blue-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormToggle label="Publish Icon" checked={formData.isIconPublish} onChange={val => setFormData(prev => ({ ...prev, isIconPublish: val }))} />
              <FormToggle label="Publish Image" checked={formData.isImagePublish} onChange={val => setFormData(prev => ({ ...prev, isImagePublish: val }))} />
            </div>

            <MenuImageUploader value={formData.imagePath} onChange={url => setFormData(prev => ({ ...prev, imagePath: url }))} />

            <div className="space-y-2">
              <Label>Icon</Label>
              {renderIconGrid()}
            </div>
            <Button onClick={handleEditSave} className="w-full bg-blue-600 hover:bg-blue-500 transition-colors">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!reorderItem} onOpenChange={() => setReorderItem(null)}>
        <DialogContent className="bg-blue-400 rounded-sm text-white bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 w-[90%]">
          <DialogHeader>
            <DialogTitle>Move &quot;{reorderItem?.name}&quot;</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-6">
            <Button onClick={() => handleManualMove('up')} className="h-14 text-lg bg-white/5 hover:bg-white/10 border border-white/10 justify-between px-6">
              Bring It Up
              <ArrowUp />
            </Button>
            <Button onClick={() => handleManualMove('down')} className="h-14 text-lg bg-white/5 hover:bg-white/10 border border-white/10 justify-between px-6">
              Bring It Down
              <ArrowDown />
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outlineGlassy" onClick={() => setReorderItem(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
        <DialogContent className="bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white overflow-y-auto max-h-[80vh] sm:max-w-lg mt-[45px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/5 border-white/10"
            />
            <Input
              placeholder="Path / URL"
              value={formData.path}
              onChange={e => setFormData({ ...formData, path: e.target.value })}
              className="bg-white/5 border-white/10"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormToggle label="Publish Icon" checked={formData.isIconPublish} onChange={val => setFormData(prev => ({ ...prev, isIconPublish: val }))} />
              <FormToggle label="Publish Image" checked={formData.isImagePublish} onChange={val => setFormData(prev => ({ ...prev, isImagePublish: val }))} />
            </div>

            <MenuImageUploader value={formData.imagePath} onChange={url => setFormData(prev => ({ ...prev, imagePath: url }))} />

            <div className="space-y-2">
              <Label>Icon</Label>
              {renderIconGrid()}
            </div>
            <Button onClick={handleAddNew} className="w-full bg-blue-600 hover:bg-blue-500">
              Create Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!addParentItem} onOpenChange={() => setAddParentItem(null)}>
        <DialogContent className="bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white overflow-y-auto max-h-[85vh] sm:max-w-lg mt-[45px]">
          <DialogHeader>
            <DialogTitle>Add Sub-Item to {addParentItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Sub Menu Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/5 border-white/10"
            />
            <Input
              placeholder="Sub Path"
              value={formData.path}
              onChange={e => setFormData({ ...formData, path: e.target.value })}
              className="bg-white/5 border-white/10"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormToggle label="Publish Icon" checked={formData.isIconPublish} onChange={val => setFormData(prev => ({ ...prev, isIconPublish: val }))} />
              <FormToggle label="Publish Image" checked={formData.isImagePublish} onChange={val => setFormData(prev => ({ ...prev, isImagePublish: val }))} />
            </div>

            <MenuImageUploader value={formData.imagePath} onChange={url => setFormData(prev => ({ ...prev, imagePath: url }))} />

            <div className="space-y-2">
              <Label>Icon</Label>
              {renderIconGrid()}
            </div>
            <Button onClick={handleAddChild} className="w-full bg-blue-600 hover:bg-blue-500">
              Add Sub Menu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <DialogContent className="bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 text-white">
          <DialogHeader>
            <DialogTitle>Delete Item?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-400">
            Are you sure you want to delete <strong>{deleteItem?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setDeleteItem(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
