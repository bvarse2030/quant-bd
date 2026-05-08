/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { format } from 'date-fns';
import { Shield, Check, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetRolesByIdQuery } from '@/redux/features/roles/rolesSlice';
import { useGetSidebarsQuery } from '@/redux/features/sidebars/sidebarsSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useRolesStore } from '../store/store';
import { ICURD, defaultRoles } from '../store/data/data';
import { iconMap, SidebarItem } from '../../sidebar/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

type PermissionKey = keyof ICURD;

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedRoles, toggleViewModal, setSelectedRoles } = useRolesStore();
  const { data: roleData, refetch } = useGetRolesByIdQuery(selectedRoles?._id, { skip: !selectedRoles?._id });
  const { data: sidebarData, isLoading: sidebarIsLoading } = useGetSidebarsQuery({ page: 1, limit: 100 });
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    if (selectedRoles?._id && isViewModalOpen) {
      refetch();
    }
  }, [selectedRoles?._id, refetch, isViewModalOpen]);

  useEffect(() => {
    if (roleData?.data) {
      setSelectedRoles(roleData.data);
    }
  }, [roleData, setSelectedRoles]);

  useEffect(() => {
    if (sidebarData?.data?.sidebars) {
      const formattedData = sidebarData.data.sidebars.map((item: SidebarItem) => ({
        ...item,
        icon: iconMap[(item.iconName as keyof typeof iconMap) || 'Menu'] || iconMap.Menu,
        children: item.children?.map(child => ({
          ...child,
          icon: iconMap[(child.iconName as keyof typeof iconMap) || 'Menu'] || iconMap.Menu,
        })),
      }));
      setSidebarItems(formattedData);
    }
  }, [sidebarData]);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const isRowChecked = (path: string): boolean => {
    return (selectedRoles?.dashboard_access_ui || []).some(item => item.path === path);
  };

  const getPermissionValue = (path: string, permission: PermissionKey): boolean => {
    const item = (selectedRoles?.dashboard_access_ui || []).find(i => i.path === path);
    return item?.userAccess ? !!item.userAccess[permission] : false;
  };

  const PermissionIndicator = ({ active, label }: { active: boolean; label: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-5 h-5 rounded-sm flex items-center justify-center border transition-all duration-300 ${
                active ? 'bg-green-400 border-green-500 text-white' : 'bg-rose-500 border-rose-600 text-white'
              }`}
            >
              {active ? <Check size={12} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
            </div>
            <span className={`text-[8px] uppercase font-bold tracking-tighter sm:hidden ${active ? 'text-white/70' : 'text-white/20'}`}>{label[0]}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-zinc-900 border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
          {label}: {active ? 'Enabled' : 'Disabled'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const PermissionGroup = ({ item }: { item: SidebarItem }) => (
    <div className="flex items-center gap-3 sm:gap-4 ml-auto">
      {(['create', 'read', 'update', 'delete'] as PermissionKey[]).map(key => (
        <PermissionIndicator key={key} active={isRowChecked(item.path) && getPermissionValue(item.path, key)} label={key} />
      ))}
    </div>
  );

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-3 border-b border-white/10">
      <div className="font-semibold text-sm text-white/70">{label}</div>
      <div className="col-span-2 text-sm text-white/90">{value || 'N/A'}</div>
    </div>
  );

  const ContentBlock = ({ label, html }: { label: string; html?: string }) => (
    <div className="py-4 border-b border-white/10">
      <Label className="font-semibold text-sm text-white/70 block mb-2">{label}</Label>
      <div className="rounded-sm bg-white/5 border border-white/10 p-4">
        <div
          className="text-sm text-white/80 leading-relaxed prose prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: html || '<p class="text-white/20 italic">No additional data provided.</p>' }}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[850px] lg:max-w-[1000px] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg rounded-sm mt-8 p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-white/60" />
            <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">Role Configuration Details</DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] w-full bg-white/5 backdrop-blur-md shadow-inner">
          <div className="p-6 space-y-2">
            <div className="grid gap-1">
              <DetailRow label="Role Identity" value={selectedRoles?.name} />
              <DetailRow label="Account Anchor" value={selectedRoles?.email} />
              <DetailRow label="Created At" value={formatDate(selectedRoles?.createdAt)} />
              <DetailRow label="System Synced" value={formatDate(selectedRoles?.updatedAt)} />
            </div>

            <ContentBlock label="Internal Administrative Notes" html={selectedRoles?.note} />
            <ContentBlock label="Permissions Architecture" html={selectedRoles?.description} />

            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-semibold tracking-wide text-white/90 uppercase">Access Matrix</Label>
                <div className="hidden sm:flex gap-6 text-[10px] uppercase tracking-widest font-bold text-white/40 mr-4">
                  <span>Create</span>
                  <span>Read</span>
                  <span>Update</span>
                  <span>Delete</span>
                </div>
              </div>

              <div className="rounded-sm border border-white/10 p-2 sm:p-3 bg-white/5">
                {sidebarIsLoading ? (
                  <p className="text-center text-sm text-white/60 p-10">Decrypting Schema...</p>
                ) : (
                  <Accordion type="multiple" className="space-y-2">
                    {sidebarItems.map(item => {
                      const hasChildren = item.children && item.children.length > 0;
                      const activeRow = isRowChecked(item.path);

                      const RowContent = (
                        <div
                          className={`flex flex-col md:flex-row md:items-center items-start gap-3 p-3 rounded-sm transition-all w-full border border-white/5 ${activeRow ? 'bg-white/10' : 'bg-white/5 opacity-50'}`}
                        >
                          <div className="flex items-center gap-4 flex-1 overflow-hidden">
                            <div className={`p-2 rounded-sm ${activeRow ? 'bg-white/20 text-white' : 'bg-white/5 text-white/20'}`}>{item.icon}</div>
                            <div className="flex flex-col text-left truncate">
                              <span className={`text-sm font-medium ${activeRow ? 'text-white' : 'text-white/40'}`}>{item.name}</span>
                              <span className="text-[10px] font-mono text-white/50 truncate uppercase">{item.path}</span>
                            </div>
                          </div>
                          <PermissionGroup item={item} />
                        </div>
                      );

                      if (hasChildren) {
                        return (
                          <AccordionItem key={item.sl_no} value={`item-${item.sl_no}`} className="border-none">
                            <AccordionTrigger className="p-0 hover:no-underline [&_svg]:text-white/40">{RowContent}</AccordionTrigger>
                            <AccordionContent className="p-0 pt-2">
                              <div className="ml-6 space-y-2 border-l border-white/10 pl-4">
                                {item.children?.map(child => (
                                  <div
                                    key={child.sl_no}
                                    className={`flex items-center gap-3 p-2 rounded-sm border border-white/5 ${isRowChecked(child.path) ? 'bg-white/5' : 'opacity-30'}`}
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="text-white/40 scale-75">{child.icon}</div>
                                      <span className="text-xs font-medium text-white/70">{child.name}</span>
                                    </div>
                                    <PermissionGroup item={child} />
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      }

                      return (
                        <div key={item.sl_no} className="w-full">
                          {RowContent}
                        </div>
                      );
                    })}
                  </Accordion>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 border-t border-white/10 bg-white/5">
          <Button
            onClick={() => {
              toggleViewModal(false);
              setSelectedRoles(defaultRoles);
            }}
            variant="outlineWater"
            size="sm"
            className="rounded-sm border-white/30 text-white/80 hover:bg-white/20 px-8"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNextComponents;
