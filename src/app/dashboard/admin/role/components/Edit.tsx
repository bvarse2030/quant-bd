/*
|-----------------------------------------
| setting up Edit for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUpdateRolesMutation } from '@/redux/features/roles/rolesSlice';
import { useGetSidebarsQuery } from '@/redux/features/sidebars/sidebarsSlice';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';


import { useRolesStore } from '../store/store';
import { iconMap, SidebarItem } from '../../sidebar/utils';
import { IRoles, defaultRoles, ICURD, defaultCURD } from '../store/data/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

type PermissionKey = keyof ICURD;

const EditNextComponents: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedRoles, setSelectedRoles } = useRolesStore();
  const [updateRoles, { isLoading }] = useUpdateRolesMutation();
  const [editedRole, setRole] = useState<IRoles>(defaultRoles);
  const { data: sidebarData, isLoading: sidebarIsLoading } = useGetSidebarsQuery({ page: 1, limit: 100 });
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

  const session = authClient.useSession();
  const sessionEmail = session.data?.user.email || '';

  useEffect(() => {
    if (selectedRoles) {
      setRole(selectedRoles);
    }
  }, [selectedRoles, isEditModalOpen]);

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

  const handleFieldChange = (name: keyof IRoles, value: unknown) => {
    setRole(prev => ({ ...prev, [name]: value }));
  };

  const handleDashboardAccessChange = (name: string, path: string, checked: boolean) => {
    setRole(prev => {
      const currentAccess = prev.dashboard_access_ui || [];
      if (checked) {
        return {
          ...prev,
          dashboard_access_ui: [...currentAccess, { name, path, userAccess: { ...defaultCURD } }],
        };
      } else {
        return {
          ...prev,
          dashboard_access_ui: currentAccess.filter(item => item.path !== path),
        };
      }
    });
  };

  const handlePermissionChange = (path: string, permission: PermissionKey, checked: boolean) => {
    setRole(prev => {
      const currentAccess = [...(prev.dashboard_access_ui || [])];
      const index = currentAccess.findIndex(item => item.path === path);
      if (index > -1) {
        currentAccess[index] = {
          ...currentAccess[index],
          userAccess: {
            ...currentAccess[index].userAccess,
            [permission]: checked,
          },
        };
      }
      return { ...prev, dashboard_access_ui: currentAccess };
    });
  };

  const handleFullAccess = () => {
    const fullPermissions: ICURD = Object.keys(defaultCURD).reduce((acc, key) => {
      acc[key as PermissionKey] = true;
      return acc;
    }, {} as ICURD);

    const allPaths: { name: string; path: string; userAccess: ICURD }[] = [];

    sidebarItems.forEach(item => {
      allPaths.push({ name: item.name, path: item.path, userAccess: { ...fullPermissions } });
      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          allPaths.push({ name: child.name, path: child.path, userAccess: { ...fullPermissions } });
        });
      }
    });

    setRole(prev => ({ ...prev, dashboard_access_ui: allPaths }));
  };

  const isRowChecked = (path: string): boolean => {
    return (editedRole.dashboard_access_ui || []).some(item => item.path === path);
  };

  const getPermissionValue = (path: string, permission: PermissionKey): boolean => {
    const item = (editedRole.dashboard_access_ui || []).find(i => i.path === path);
    if (!item || !item.userAccess) return false;
    return item.userAccess[permission];
  };

  const handleEditRole = async () => {
    if (!selectedRoles?._id) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, ...updateData } = editedRole;
      const finalPayload = {
        id: selectedRoles._id,
        ...updateData,
        email: sessionEmail || editedRole.email,
      };

      await updateRoles(finalPayload).unwrap();
      handleSuccess('Update Successful');
      toggleEditModal(false);
      setSelectedRoles(null);
    } catch (error: unknown) {
      let errMessage = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  const PermissionCheckboxes = ({ item }: { item: SidebarItem }) => (
    <div className="flex items-center gap-3 ml-auto" onClick={e => e.stopPropagation()}>
      {(Object.keys(defaultCURD) as PermissionKey[]).map(key => {
        const isActive = isRowChecked(item.path);
        const selected = isActive && getPermissionValue(item.path, key);
        return (
          <TooltipProvider key={key}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1">
                  <Checkbox
                    disabled={!isActive}
                    checked={selected}
                    onCheckedChange={checked => handlePermissionChange(item.path, key, checked as boolean)}
                    className={`transition-all duration-200 border-white/40 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-300 ${!isActive ? 'opacity-20' : 'opacity-100'}`}
                  />
                  <span className="text-[8px] uppercase font-bold text-white/40 sm:hidden">{key[0]}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-900 border-white/20 text-white text-xs capitalize">{key} Permission</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );

  return (
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <DialogContent className="sm:max-w-[850px] lg:max-w-[1000px] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg rounded-sm mt-8 p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-white/60" />
            <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">Edit System Role</DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[50vh] w-full bg-white/5 backdrop-blur-md shadow-inner px-2 py-6">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/70 text-sm font-medium">
                  Role Identity
                </Label>
                <InputFieldForString
                  id="name"
                  placeholder="e.g. Master Administrator"
                  value={editedRole.name}
                  onChange={value => handleFieldChange('name', value as string)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70 text-sm font-medium">
                  Account Holder
                </Label>
                <Input id="email" readOnly className="bg-white/10 border-white/20 text-white/50 rounded-sm" value={editedRole.email} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-white/70 text-sm font-medium">Admin Notes</Label>
                <div className="rounded-sm border border-white/10 bg-white/10 overflow-hidden">
                  <RichTextEditorField id="note" value={editedRole.note} onChange={value => handleFieldChange('note', value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 text-sm font-medium">Permissions Description</Label>
                <div className="rounded-sm border border-white/10 bg-white/10 overflow-hidden">
                  <RichTextEditorField id="description" value={editedRole.description} onChange={value => handleFieldChange('description', value)} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold tracking-wide text-white/90 uppercase">Access Matrix</Label>
                <div className="hidden sm:flex gap-8 text-[10px] uppercase tracking-widest font-bold text-white/40 mr-4">
                  <span>Create</span>
                  <span>Read</span>
                  <span>Update</span>
                  <span>Delete</span>
                </div>
              </div>

              <div className="rounded-sm border border-white/10 bg-white/5 p-2 sm:p-3">
                {sidebarIsLoading ? (
                  <p className="text-center text-sm text-white/60 p-10">Synchronizing Schema...</p>
                ) : (
                  <Accordion type="multiple" className="space-y-2">
                    {sidebarItems.map((item, idx) => {
                      const hasChildren = item.children && item.children.length > 0;
                      const activeRow = isRowChecked(item.path);

                      const RowContent = (
                        <div
                          className={`flex flex-col md:flex-row items-start  md:items-center gap-3 p-3 rounded-sm border border-white/10 transition-all w-full ${activeRow ? 'bg-green-500/10 border-green-400/20' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                          <div className="flex items-center gap-4 flex-1 overflow-hidden">
                            <Checkbox
                              checked={activeRow}
                              onCheckedChange={checked => handleDashboardAccessChange(item.name, item.path, checked as boolean)}
                              className="border-white/40 data-[state=checked]:bg-green-400"
                            />
                            <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded-sm transition-all ${activeRow ? 'text-green-300' : 'text-white/40'}`}>{item.icon}</div>
                              <div className="flex flex-col text-left truncate">
                                <span className={`text-sm font-medium ${activeRow ? 'text-green-300' : 'text-white/70'}`}>{item.name}</span>
                                <span className="text-[10px] font-mono text-white/50 truncate uppercase">{item.path}</span>
                              </div>
                            </div>
                          </div>
                          <PermissionCheckboxes item={item} />
                        </div>
                      );

                      return (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} key={item.sl_no}>
                          {hasChildren ? (
                            <AccordionItem value={`item-${item.sl_no}`} className="border-none">
                              <AccordionTrigger className="p-0 hover:no-underline [&_svg]:text-white/40">{RowContent}</AccordionTrigger>
                              <AccordionContent className="p-0 pt-2">
                                <div className="ml-6 space-y-2 border-l border-white/10 pl-4">
                                  {item.children?.map(child => (
                                    <div
                                      key={child.sl_no}
                                      className={`flex items-center gap-3 p-2 rounded-sm border border-white/5 ${isRowChecked(child.path) ? 'bg-green-500/5' : 'bg-white/5 opacity-40'}`}
                                    >
                                      <div className="flex items-center gap-3 flex-1">
                                        <Checkbox
                                          checked={isRowChecked(child.path)}
                                          onCheckedChange={checked => handleDashboardAccessChange(child.name, child.path, checked as boolean)}
                                          className="border-white/20 scale-90 data-[state=checked]:bg-green-400"
                                        />
                                        <span className={`text-xs font-medium ${isRowChecked(child.path) ? 'text-green-300/80' : 'text-white/40'}`}>
                                          {child.name}
                                        </span>
                                      </div>
                                      <PermissionCheckboxes item={child} />
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ) : (
                            <div className="w-full">{RowContent}</div>
                          )}
                        </motion.div>
                      );
                    })}
                  </Accordion>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 border-t border-white/10 bg-white/5 gap-3 flex-col sm:flex-row">
          <Button
            variant="outlineWater"
            size="sm"
            onClick={handleFullAccess}
            className="rounded-sm border-white/30 text-white/80 hover:bg-white/20 gap-2 font-bold text-[10px] uppercase"
          >
            <Zap className="w-3 h-3" /> Full Access
          </Button>
          <div className="flex-1" />
          <div className="flex gap-3 items-center justify-between">
            <Button
              variant="outlineDefault"
              size="sm"
              className="rounded-sm border-white/20 text-white/60 hover:text-white font-bold text-[10px] uppercase"
              onClick={() => {
                toggleEditModal(false);
                setSelectedRoles(null);
              }}
            >
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={handleEditRole} variant="outlineGlassy" size="sm">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNextComponents;
