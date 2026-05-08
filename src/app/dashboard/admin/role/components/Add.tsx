/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Sparkles, Trash2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAddRolesMutation } from '@/redux/features/roles/rolesSlice';
import { useGetSidebarsQuery } from '@/redux/features/sidebars/sidebarsSlice';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';


import { useRolesStore } from '../store/store';
import { iconMap, SidebarItem } from '../../sidebar/utils';
import { IRoles, defaultRoles, defaultCURD, ICURD } from '../store/data/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

type PermissionKey = keyof ICURD;

const AddNextComponents: React.FC = () => {
  const { toggleAddModal, isAddModalOpen } = useRolesStore();
  const [addRoles, { isLoading }] = useAddRolesMutation();
  const [newRole, setNewRole] = useState<IRoles>(defaultRoles);
  const { data: sidebarData, isLoading: sidebarIsLoading } = useGetSidebarsQuery({ page: 1, limit: 100 });
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

  const session = authClient.useSession();
  const sessionEmail = session.data?.user.email || '';

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
    setNewRole(prev => ({ ...prev, [name]: value }));
  };

  const handleDashboardAccessChange = (name: string, path: string, checked: boolean) => {
    setNewRole(prev => {
      const currentAccess = prev.dashboard_access_ui || [];
      if (checked) {
        return {
          ...prev,
          dashboard_access_ui: [
            ...currentAccess,
            {
              name,
              path,
              userAccess: { ...defaultCURD },
            },
          ],
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
    setNewRole(prev => {
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

  const handleFullAccess = useCallback(() => {
    const fullAccessList: NonNullable<IRoles['dashboard_access_ui']> = [];

    const traverseAndAdd = (items: SidebarItem[]) => {
      items.forEach(item => {
        const fullPermissions: ICURD = Object.keys(defaultCURD).reduce((acc, key) => {
          acc[key as PermissionKey] = true;
          return acc;
        }, {} as ICURD);

        fullAccessList.push({
          name: item.name,
          path: item.path,
          userAccess: fullPermissions,
        });

        if (item.children && item.children.length > 0) {
          traverseAndAdd(item.children);
        }
      });
    };

    traverseAndAdd(sidebarItems);
    setNewRole(prev => ({
      ...prev,
      dashboard_access_ui: fullAccessList,
    }));
  }, [sidebarItems]);

  const isRowChecked = (path: string): boolean => {
    return (newRole.dashboard_access_ui || []).some(item => item.path === path);
  };

  const getPermissionValue = (path: string, permission: PermissionKey): boolean => {
    const item = (newRole.dashboard_access_ui || []).find(i => i.path === path);
    if (!item || !item.userAccess) return false;
    return !!item.userAccess[permission];
  };

  const handleAddRole = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, ...updateData } = newRole;
      const finalPayload = {
        ...updateData,
        email: sessionEmail,
      };
      await addRoles(finalPayload).unwrap();
      handleSuccess('Added Successfully');
      toggleAddModal(false);
      setNewRole(defaultRoles);
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
        return (
          <TooltipProvider key={key}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1">
                  <Checkbox
                    disabled={!isActive}
                    checked={getPermissionValue(item.path, key)}
                    onCheckedChange={checked => handlePermissionChange(item.path, key, checked as boolean)}
                    className={`transition-all duration-200 border-white/60 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-300 ${!isActive ? 'opacity-20' : 'opacity-100'}`}
                  />
                  <span className="text-[8px] uppercase font-medium text-white/30 sm:hidden">{key[0]}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-900 border-white/20 text-white text-xs backdrop-blur-xl rounded-sm">{key} Permission</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );

  return (
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[850px] lg:max-w-[1000px] mt-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-sm text-white transition-all duration-300 p-0 overflow-hidden">
        <DialogHeader className="px-4 py-2 border-b border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center justify-start">
              <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">Create Role</DialogTitle>
              <ShieldCheck className="w-5 h-5 text-white/40" />
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[450px] w-full p-4 border-b border-white/10 -mt-2">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/70 text-sm font-medium">
                  Role Identity
                </Label>
                <InputFieldForString
                  id="name"
                  placeholder="e.g. Master Administrator"
                  value={newRole.name}
                  onChange={value => handleFieldChange('name', value as string)}
                  className="bg-white/10 border-white/20 rounded-sm focus:border-white/40 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70 text-sm font-medium">
                  Creator Reference
                </Label>
                <Input
                  id="email"
                  readOnly
                  className="bg-white/5 border-white/20 text-white/50 text-sm rounded-sm backdrop-blur-md"
                  value={sessionEmail || newRole.email}
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-white/70 text-sm font-medium">Note</Label>
                <div className="rounded-sm border border-white/20 bg-white/5 backdrop-blur-md overflow-hidden">
                  <RichTextEditorField id="note" value={newRole.note} onChange={value => handleFieldChange('note', value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 text-sm font-medium">Authority</Label>
                <div className="rounded-sm border border-white/20 bg-white/5 backdrop-blur-md overflow-hidden">
                  <RichTextEditorField id="description" value={newRole.description} onChange={value => handleFieldChange('description', value)} />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold text-white/90">Permission</Label>
                <div className="hidden sm:flex gap-8 text-[10px] uppercase tracking-wider font-bold text-white/40 mr-4">
                  <span className="w-8 text-center">Create</span>
                  <span className="w-8 text-center">Read</span>
                  <span className="w-8 text-center">Update</span>
                  <span className="w-8 text-center">Delete</span>
                </div>
              </div>

              <div className="rounded-sm border border-white/40 bg-white/5 backdrop-blur-md shadow-inner p-2 sm:p-3">
                {sidebarIsLoading ? (
                  <p className="text-center text-sm text-white/60 p-10">Syncing Permissions...</p>
                ) : (
                  <Accordion type="multiple" className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {sidebarItems.map((item, index) => {
                        const hasChildren = item.children && item.children.length > 0;
                        const activeRow = isRowChecked(item.path);

                        const RowContent = (
                          <div
                            className={`flex items-center gap-3 p-3 rounded-sm border border-white/10 transition-all w-full ${activeRow ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20 shadow-sm'}`}
                          >
                            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                              <Checkbox
                                checked={activeRow}
                                onCheckedChange={checked => handleDashboardAccessChange(item.name, item.path, checked as boolean)}
                                className={`transition-all duration-200 border-white/60 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-300 ${!activeRow ? 'opacity-60' : 'opacity-100'}`}
                              />
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`p-1.5 rounded-sm transition-all ${activeRow ? 'text-white' : 'text-white/40'}`}>{item.icon}</div>
                                <div className="flex flex-col text-left truncate">
                                  <span className={`text-sm font-medium truncate ${activeRow ? 'text-white' : 'text-white/80'}`}>{item.name}</span>
                                  <span className="text-[10px] text-white/50 truncate font-mono">{item.path}</span>
                                </div>
                              </div>
                            </div>
                            <PermissionCheckboxes item={item} />
                          </div>
                        );

                        return (
                          <motion.div key={item.sl_no} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }}>
                            {hasChildren ? (
                              <AccordionItem value={`item-${item.sl_no}`} className="border-none">
                                <AccordionTrigger className="p-0 hover:no-underline [&_svg]:text-white/40">{RowContent}</AccordionTrigger>
                                <AccordionContent className="p-0 pt-1">
                                  <div className="space-y-1 pl-6">
                                    {item.children?.map(child => (
                                      <div
                                        key={child.sl_no}
                                        className="flex items-center gap-3 p-2 rounded-sm bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                                      >
                                        <div className="flex items-center gap-3 flex-1">
                                          <Checkbox
                                            checked={isRowChecked(child.path)}
                                            onCheckedChange={checked => handleDashboardAccessChange(child.name, child.path, checked as boolean)}
                                            className="border-white/60 rounded-sm"
                                          />
                                          <div className="flex items-center gap-3">
                                            <div className={isRowChecked(child.path) ? 'text-white/80' : 'text-white/20'}>{child.icon}</div>
                                            <span className={`text-xs font-medium ${isRowChecked(child.path) ? 'text-white/80' : 'text-white/30'}`}>
                                              {child.name}
                                            </span>
                                          </div>
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
                    </AnimatePresence>
                  </Accordion>
                )}
              </div>
            </motion.div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 bg-white/5 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outlineWater" onClick={handleFullAccess} size="sm">
              <Sparkles className="w-3 h-3" />
              Full Access
            </Button>
            <Button variant="outlineFire" onClick={() => setNewRole(defaultRoles)} size="sm">
              <Trash2 className="w-3 h-3" />
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outlineWater" onClick={() => toggleAddModal(false)} size="sm">
              Close
            </Button>
            <Button disabled={isLoading || !newRole.name} onClick={handleAddRole} variant="outlineWater" size="sm">
              {isLoading ? 'Processing...' : 'Authorize Role'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
