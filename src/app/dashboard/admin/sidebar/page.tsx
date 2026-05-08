'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Eye, Plus, Edit2, Trash2, Search, ArrowUp, ArrowDown, ArrowUpDown, MoreVertical, ChevronRight, GripVertical, Menu as MenuIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  pointerWithin,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  useGetSidebarsQuery,
  useAddSidebarMutation,
  useUpdateSidebarMutation,
  useDeleteSidebarMutation,
  useBulkUpdateSidebarsMutation,
} from '@/redux/features/sidebars/sidebarsSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { iconMap, iconOptions } from '@/components/all-icons/all-icons-jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface SidebarItem {
  _id?: string;
  sl_no: number;
  name: string;
  path: string;
  iconName: string;
  children?: SidebarItem[];
}

interface SidebarCardProps {
  item: SidebarItem;
  onView?: (item: SidebarItem) => void;
  onEdit?: (item: SidebarItem) => void;
  onDelete?: (item: SidebarItem) => void;
  onAddChild?: (parentItem: SidebarItem) => void;
  onToggleCollapse?: (itemId: number) => void;
  onReorderRequest?: (item: SidebarItem) => void;
  isCollapsed?: boolean;
  isChild?: boolean;
  isDragging?: boolean;
  isOverlay?: boolean;
  deviceType: DeviceType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners?: any;
  setNodeRef?: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
}

function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setDeviceType('mobile');
      else if (width < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

const getIcon = (name: string) => {
  const IconComp = iconMap[name] || MenuIcon;
  return <IconComp size={18} />;
};

const SidebarCard = React.forwardRef<HTMLDivElement, SidebarCardProps>(
  (
    {
      item,
      onView,
      onEdit,
      onDelete,
      onAddChild,
      onToggleCollapse,
      onReorderRequest,
      isCollapsed = false,
      isChild = false,
      isOverlay = false,
      deviceType,
      attributes,
      listeners,
      style,
    },
    ref,
  ) => {
    const isDesktop = deviceType === 'desktop';
    const [showActions, setShowActions] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <motion.div
        ref={ref}
        style={style}
        layout={!isOverlay}
        initial={!isOverlay ? { opacity: 0, scale: 0.95 } : false}
        animate={!isOverlay ? { opacity: 1, scale: 1 } : false}
        className={`group relative backdrop-blur-2xl bg-white/5 border ${
          isOverlay ? 'border-blue-500 ring-1 ring-blue-500/50 shadow-2xl scale-105' : 'border-white/10'
        } rounded-2xl p-3 mb-3 transition-all duration-300 ${isChild ? 'ml-6 sm:ml-10' : ''}`}
      >
        <div className="flex items-center gap-0 w-full">
          {isDesktop ? (
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0">
              <GripVertical size={18} className="text-white/30 group-hover:text-white/70" />
            </div>
          ) : (
            <Button onClick={() => onReorderRequest?.(item)} variant="ghost" size="icon" className="h-9 w-9 text-white/40 hover:text-white shrink-0 min-w-1">
              <ArrowUpDown size={18} />
            </Button>
          )}

          {!isChild && (
            <button
              onClick={() => onToggleCollapse?.(item.sl_no)}
              className={`p-1 text-white/40 min-w-1 hover:text-white transition-all duration-300 ${isCollapsed ? '' : 'rotate-90'} ${
                !hasChildren ? 'opacity-0 pointer-events-none' : ''
              }`}
            >
              <ChevronRight size={20} />
            </button>
          )}

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/5 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all">
              {getIcon(item.iconName)}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-semibold text-sm sm:text-base text-white truncate">{item.name}</span>
              <span className="text-[10px] sm:text-xs text-white/50 font-mono truncate">{item.path}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <div className="hidden lg:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
              <Button variant="ghost" size="icon" onClick={() => onView?.(item)} className="h-8 w-8 hover:bg-blue-500/20 text-blue-400 min-w-1">
                <Eye size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onEdit?.(item)} className="h-8 w-8 hover:bg-amber-500/20 text-amber-400 min-w-1">
                <Edit2 size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete?.(item)} className="h-8 w-8 hover:bg-rose-500/20 text-rose-400 min-w-1">
                <Trash2 size={16} />
              </Button>
              {!isChild && (
                <Button variant="ghost" size="icon" onClick={() => onAddChild?.(item)} className="h-8 w-8 hover:bg-emerald-500/20 text-emerald-400 min-w-1">
                  <Plus size={16} />
                </Button>
              )}
            </div>

            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowActions(!showActions)}
                className={`h-9 w-9 min-w-1 -ml-2 transition-colors ${showActions ? 'bg-white/10 text-white' : 'text-white/40'}`}
              >
                {showActions ? <X size={18} /> : <MoreVertical size={18} />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden border-t border-white/5 pt-3"
            >
              <div className="grid grid-cols-4 gap-2">
                <Button variant="secondary" className="bg-white/5 hover:bg-blue-500/20 text-blue-400 border-none h-11" onClick={() => onView?.(item)}>
                  <Eye size={18} />
                </Button>
                <Button variant="secondary" className="bg-white/5 hover:bg-amber-500/20 text-amber-400 border-none h-11" onClick={() => onEdit?.(item)}>
                  <Edit2 size={18} />
                </Button>
                <Button variant="secondary" className="bg-white/5 hover:bg-rose-500/20 text-rose-400 border-none h-11" onClick={() => onDelete?.(item)}>
                  <Trash2 size={18} />
                </Button>
                {!isChild && (
                  <Button
                    variant="secondary"
                    className="bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border-none h-11"
                    onClick={() => onAddChild?.(item)}
                  >
                    <Plus size={18} />
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);
SidebarCard.displayName = 'SidebarCard';

function SortableItemWrapper(props: SidebarCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.item.sl_no.toString(),
    disabled: props.deviceType !== 'desktop',
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return <SidebarCard ref={setNodeRef} style={style} {...props} attributes={attributes} listeners={listeners} isDragging={isDragging} />;
}

export default function SiteMenuPage() {
  const deviceType = useDeviceType();
  const { data: sidebarData, isLoading, refetch } = useGetSidebarsQuery({ page: 1, limit: 100 });
  const [addSidebar] = useAddSidebarMutation();
  const [updateSidebar] = useUpdateSidebarMutation();
  const [deleteSidebarMutation] = useDeleteSidebarMutation();
  const [bulkUpdateSidebars] = useBulkUpdateSidebarsMutation();

  const [menuItems, setMenuItems] = useState<SidebarItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<SidebarItem | null>(null);

  const [viewItem, setViewItem] = useState<SidebarItem | null>(null);
  const [editItem, setEditItem] = useState<SidebarItem | null>(null);
  const [addParentItem, setAddParentItem] = useState<SidebarItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<SidebarItem | null>(null);
  const [reorderItem, setReorderItem] = useState<SidebarItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({ name: '', path: '', iconName: 'ShieldCheck' });
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set());
  const [iconSearch, setIconSearch] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (sidebarData?.data?.sidebars) {
      setMenuItems(sidebarData.data.sidebars);
    }
  }, [sidebarData]);

  const filteredIcons = useMemo(() => {
    if (!iconSearch) return iconOptions.slice(0, 80);
    return iconOptions.filter(i => i.toLowerCase().includes(iconSearch.toLowerCase())).slice(0, 80);
  }, [iconSearch]);

  const updateSlNo = (items: SidebarItem[]): SidebarItem[] => {
    return items.map((item, index) => {
      const newSlNo = (index + 1) * 10;
      return {
        ...item,
        sl_no: newSlNo,
        children: item.children?.map((child, childIndex) => ({
          ...child,
          sl_no: newSlNo + childIndex + 1,
        })),
      };
    });
  };

  const autoSave = async (items: SidebarItem[]) => {
    try {
      const payload = items
        .filter(i => i._id)
        .map(i => ({
          id: i._id,
          updateData: { ...i },
        }));
      if (payload.length > 0) {
        await bulkUpdateSidebars(payload).unwrap();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to sync changes automatically');
    }
  };

  const deepUpdate = (list: SidebarItem[], sl_no: number, data: Partial<SidebarItem>): boolean => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.sl_no === sl_no) {
        list[i] = { ...item, ...data };
        return true;
      }
      if (item.children && deepUpdate(item.children as SidebarItem[], sl_no, data)) {
        return true;
      }
    }
    return false;
  };

  const deepDelete = (list: SidebarItem[], sl_no: number): boolean => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.sl_no === sl_no) {
        list.splice(i, 1);
        return true;
      }
      if (item.children && deepDelete(item.children as SidebarItem[], sl_no)) {
        return true;
      }
    }
    return false;
  };

  const findArrayContainingId = (list: SidebarItem[], id: number): SidebarItem[] | null => {
    if (list.some(i => i.sl_no === id)) return list;
    for (const item of list) {
      if (item.children) {
        const found = findArrayContainingId(item.children as SidebarItem[], id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleManualMove = (direction: 'up' | 'down') => {
    if (!reorderItem) return;
    const newItems = JSON.parse(JSON.stringify(menuItems));
    const targetArray = findArrayContainingId(newItems, reorderItem.sl_no);

    if (targetArray) {
      const idx = targetArray.findIndex(i => i.sl_no === reorderItem.sl_no);
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;

      if (targetIdx >= 0 && targetIdx < targetArray.length) {
        [targetArray[idx], targetArray[targetIdx]] = [targetArray[targetIdx], targetArray[idx]];
        const finalized = updateSlNo(newItems);
        setMenuItems(finalized);
        autoSave(finalized);
        toast.success('Position updated');
        setReorderItem(null);
        return;
      }
    }
    toast.info('End of list');
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id.toString());
    const findItem = (list: SidebarItem[], id: number): SidebarItem | null => {
      for (const item of list) {
        if (item.sl_no === id) return item;
        if (item.children) {
          const found = findItem(item.children as SidebarItem[], id);
          if (found) return found;
        }
      }
      return null;
    };
    setActiveItem(findItem(menuItems, parseInt(active.id.toString())));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setActiveItem(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIdNum = parseInt(active.id.toString());
    const overIdNum = parseInt(over.id.toString());

    setMenuItems(prev => {
      const newItems = JSON.parse(JSON.stringify(prev));
      const activeArray = findArrayContainingId(newItems, activeIdNum);
      const overArray = findArrayContainingId(newItems, overIdNum);

      if (activeArray && overArray && activeArray === overArray) {
        const activeIdx = activeArray.findIndex(i => i.sl_no === activeIdNum);
        const overIdx = overArray.findIndex(i => i.sl_no === overIdNum);
        activeArray.splice(overIdx, 0, activeArray.splice(activeIdx, 1)[0]);
        const finalized = updateSlNo(newItems);
        autoSave(finalized);
        return finalized;
      }
      return prev;
    });
  };

  const handleSaveEntry = async () => {
    try {
      if (editItem) {
        if (editItem._id) {
          await updateSidebar({ id: editItem._id, ...formData }).unwrap();
        }
        const newItems = JSON.parse(JSON.stringify(menuItems));
        deepUpdate(newItems, editItem.sl_no, formData);
        const finalized = updateSlNo(newItems);
        setMenuItems(finalized);
        await autoSave(finalized);
        toast.success('Updated successfully');
      } else if (addParentItem) {
        const newItems = JSON.parse(JSON.stringify(menuItems));
        const parentArray = findArrayContainingId(newItems, addParentItem.sl_no);
        if (parentArray) {
          const parent = parentArray.find(i => i.sl_no === addParentItem.sl_no);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push({ ...formData, sl_no: Date.now() });
          }
        }
        const finalized = updateSlNo(newItems);
        setMenuItems(finalized);
        await autoSave(finalized);
        toast.success('Sub-entry created');
      } else {
        await addSidebar({ ...formData, sl_no: (menuItems.length + 1) * 10, children: [] }).unwrap();
        toast.success('Sidebar created successfully');
        refetch();
      }
      setIsAddingNew(false);
      setEditItem(null);
      setAddParentItem(null);
    } catch {
      toast.error('Failed to save entry');
    }
  };

  const handleDeleteEntry = async () => {
    if (!deleteItem) return;
    try {
      const isTopLevel = menuItems.some(i => i.sl_no === deleteItem.sl_no);
      if (isTopLevel && deleteItem._id) {
        await deleteSidebarMutation({ id: deleteItem._id }).unwrap();
        toast.success('Deleted successfully');
        refetch();
      } else {
        const newItems = JSON.parse(JSON.stringify(menuItems));
        deepDelete(newItems, deleteItem.sl_no);
        const finalized = updateSlNo(newItems);
        setMenuItems(finalized);
        await autoSave(finalized);
        toast.success('Deleted sub-entry');
      }
      setDeleteItem(null);
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
  };

  return (
    <main className="min-h-screen text-slate-200 p-4 md:p-12 font-sans overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
              Sidebars
            </h1>
          </motion.div>
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <Button
              onClick={() => {
                setFormData({ name: '', path: '', iconName: 'ShieldCheck' });
                setIsAddingNew(true);
              }}
              variant="outlineGlassy"
            >
              <Plus className="mr-2" size={22} /> Add New
            </Button>
          </motion.div>
        </header>

        <section className="relative z-10">
          <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={menuItems.map(i => i.sl_no.toString())} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {menuItems.map(item => (
                  <div key={item.sl_no}>
                    <SortableItemWrapper
                      item={item}
                      onView={setViewItem}
                      onEdit={i => {
                        setEditItem(i);
                        setFormData({ name: i.name, path: i.path, iconName: i.iconName });
                      }}
                      onDelete={setDeleteItem}
                      onAddChild={i => {
                        setAddParentItem(i);
                        setFormData({ name: '', path: '', iconName: 'ShieldCheck' });
                      }}
                      onToggleCollapse={id =>
                        setCollapsedItems(prev => {
                          const next = new Set(prev);
                          if (next.has(id)) next.delete(id);
                          else next.add(id);
                          return next;
                        })
                      }
                      onReorderRequest={setReorderItem}
                      isCollapsed={collapsedItems.has(item.sl_no)}
                      deviceType={deviceType}
                    />

                    <AnimatePresence>
                      {!collapsedItems.has(item.sl_no) && item.children && item.children.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="relative overflow-hidden"
                        >
                          <div className="absolute left-6 top-0 bottom-6 w-px bg-gradient-to-b from-blue-500/20 to-transparent" />
                          <div className="pt-2">
                            <SortableContext items={item.children.map(c => c.sl_no.toString())} strategy={verticalListSortingStrategy}>
                              {item.children.map(child => (
                                <SortableItemWrapper
                                  key={child.sl_no}
                                  item={child}
                                  onView={setViewItem}
                                  onEdit={i => {
                                    setEditItem(i);
                                    setFormData({ name: i.name, path: i.path, iconName: i.iconName });
                                  }}
                                  onDelete={setDeleteItem}
                                  onReorderRequest={setReorderItem}
                                  isChild
                                  deviceType={deviceType}
                                />
                              ))}
                            </SortableContext>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={dropAnimationConfig}>
              {activeId && activeItem ? (
                <SidebarCard item={activeItem} isChild={menuItems.every(i => i.sl_no !== activeItem.sl_no)} deviceType={deviceType} isOverlay />
              ) : null}
            </DragOverlay>
          </DndContext>
        </section>
      </div>

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="bg-blue-400 rounded-sm text-white overflow-hidden bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 max-w-sm sm:max-w-md">
          <DialogTitle className="sr-only">Details</DialogTitle>
          {viewItem && (
            <div className="relative">
              <div className="h-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
              <div className="px-4 pb-8 -mt-8 relative z-10">
                <div className="p-4 bg-slate-900 border-4 border-[#020617] rounded-2xl w-20 h-20 shadow-2xl flex items-center justify-center text-blue-400 mb-4">
                  {getIcon(viewItem.iconName)}
                </div>
                <h3 className="text-3xl font-black mb-1">{viewItem.name}</h3>
                <code className="text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-6 inline-block font-mono">{viewItem.path}</code>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Sl No</p>
                    <p className="text-lg font-mono font-bold text-slate-200">{viewItem.sl_no}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Children</p>
                    <p className="text-lg font-bold text-slate-200">{viewItem.children?.length || 0}</p>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button variant="outlineGlassy" onClick={() => setViewItem(null)}>
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!reorderItem} onOpenChange={() => setReorderItem(null)}>
        <DialogContent className="bg-blue-400 rounded-sm bg-clip-padding text-white backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Relocate Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <Button onClick={() => handleManualMove('up')} variant="outlineGlassy">
              Shift Upwards <ArrowUp className="text-blue-400 ml-2" />
            </Button>
            <Button onClick={() => handleManualMove('down')} variant="outlineGlassy">
              Shift Downwards <ArrowDown className="text-purple-400 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddingNew || !!editItem || !!addParentItem}
        onOpenChange={isOpen => {
          if (!isOpen) {
            setIsAddingNew(false);
            setEditItem(null);
            setAddParentItem(null);
          }
        }}
      >
        <DialogContent className="bg-blue-400 rounded-sm bg-clip-padding backdrop-filter backdrop-blur-md mt-2 text-white bg-opacity-30 border border-gray-100 p-0 overflow-hidden shadow-3xl">
          <DialogHeader className="p-2 border-b border-white/5 bg-white/5">
            <DialogTitle className="text-2xl font-black">
              {isAddingNew ? 'Create New Entry' : editItem ? 'Modify Entry' : `Sub-item for ${addParentItem?.name}`}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <Label className="text-slate-400 font-bold uppercase tracking-wider text-xs">Display Label</Label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/10 h-14 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Dashboard"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-slate-400 font-bold uppercase tracking-wider text-xs">Route Path</Label>
                <Input
                  value={formData.path}
                  onChange={e => setFormData({ ...formData, path: e.target.value })}
                  className="bg-white/5 border-white/10 h-14 rounded-2xl font-mono text-sm"
                  placeholder="/admin/dashboard"
                />
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-400 font-bold uppercase tracking-wider text-xs">Visual Icon</Label>
                  <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <Input
                      placeholder="Search..."
                      value={iconSearch}
                      onChange={e => setIconSearch(e.target.value)}
                      className="pl-9 bg-white/5 border-white/10 h-9 rounded-full text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar border border-slate-50/50 rounded-sm">
                  {filteredIcons.map(name => (
                    <button
                      key={name}
                      onClick={() => setFormData({ ...formData, iconName: name })}
                      className={`p-4 transition-all ${formData.iconName === name ? 'text-blue-600 scale-105 ' : ' border-transparent hover:bg-white/10'}`}
                    >
                      {React.createElement(iconMap[name] || MenuIcon, { size: 22 })}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="p-2 border-t items-center justify-between border-white/5 bg-white/5 flex gap-4">
            <Button
              variant="outlineGlassy"
              onClick={() => {
                setIsAddingNew(false);
                setEditItem(null);
                setAddParentItem(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="outlineGlassy" onClick={handleSaveEntry}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <DialogContent className="bg-blue-400 rounded-sm text-white bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-rose-500 text-2xl font-black">Remove Item?</DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 text-lg leading-relaxed pt-2">
            Delete <span className="text-white font-bold">{deleteItem?.name}</span>? This item and its sub-menus will be gone forever.
          </p>
          <DialogFooter className="mt-8 flex gap-3">
            <Button variant="outlineGlassy" onClick={() => setDeleteItem(null)}>
              Cancel
            </Button>
            <Button variant="outlineFire" onClick={handleDeleteEntry}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
