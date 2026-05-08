/*
|-----------------------------------------
| setting up Edit for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUpdateAccessManagementsMutation } from '@/redux/features/accessManagements/accessManagementsSlice';

import { useAccessManagementsStore } from '../store/store';
import { IAccessManagements, defaultAccessManagements } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

interface RoleItem {
  id: string;
  name: string;
}

const EditNextComponents: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedAccessManagements, setSelectedAccessManagements } = useAccessManagementsStore();

  const [updateAccessManagements, { isLoading }] = useUpdateAccessManagementsMutation();
  const [editedAccessManagement, setAccessManagement] = useState<IAccessManagements>(defaultAccessManagements);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const res = await fetch('/api/roles/v1/list');
        const data = await res.json();
        setRoles(data.data || []);
      } catch (err) {
        console.error('Failed to load roles:', err);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (selectedAccessManagements) {
      setAccessManagement(selectedAccessManagements);
    }
  }, [selectedAccessManagements]);

  const handleFieldChange = (name: string, value: unknown) => {
    setAccessManagement(prev => ({ ...prev, [name]: value }));
  };

  const toggleRoleSelection = (roleName: string) => {
    const currentRoles = Array.isArray(editedAccessManagement.assign_role) ? editedAccessManagement.assign_role : [];

    const updatedRoles = currentRoles.includes(roleName) ? currentRoles.filter(name => name !== roleName) : [...currentRoles, roleName];

    handleFieldChange('assign_role', updatedRoles);
  };

  const handleEditAccessManagement = async () => {
    if (!selectedAccessManagements) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, ...updateData } = editedAccessManagement;

      await updateAccessManagements({
        id: selectedAccessManagements._id,
        ...updateData,
      }).unwrap();

      toggleEditModal(false);
      handleSuccess('Edit Successful');
    } catch (error: unknown) {
      console.error('Failed to update record:', error);
      let errMessage = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <DialogContent className={cn('sm:max-w-[625px] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg rounded-sm mt-8')}>
        <DialogHeader className="border-b border-white/10 pb-3">
          <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">Edit Access Management</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[50vh] w-full rounded-sm border border-white/10 p-4 bg-white/5 backdrop-blur-md shadow-inner">
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="user_name" className="text-white/70 pb-1 block">
                User Name
              </Label>
              <InputFieldForString
                id="user_name"
                placeholder="User Name"
                value={editedAccessManagement.user_name}
                onChange={value => handleFieldChange('user_name', value as string)}
              />
            </div>

            <div>
              <Label htmlFor="user_email" className="text-white/70 pb-1 block">
                User Email
              </Label>
              <InputFieldForEmail
                id="user_email"
                value={editedAccessManagement.user_email}
                onChange={value => handleFieldChange('user_email', value as string)}
              />
            </div>

            <div>
              <Label htmlFor="assign_role" className="text-white/70 pb-1 block">
                Assign Role
              </Label>

              <div className="rounded-sm border border-white/10 bg-white/10 backdrop-blur-lg p-4 space-y-2 shadow-md">
                {loadingRoles ? (
                  <p className="text-sm text-white/60 text-center">Loading roles...</p>
                ) : roles.length === 0 ? (
                  <p className="text-sm text-white/60 text-center">No roles found.</p>
                ) : (
                  roles.map((role, idx) => {
                    const selected = editedAccessManagement.assign_role?.includes(role.name);
                    return (
                      <div
                        key={role.id + idx}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-sm transition-all duration-200 border border-transparent cursor-pointer',
                          selected ? 'bg-green-500/20 border-green-400/40 shadow-inner' : 'hover:bg-white/10 hover:border-white/20',
                        )}
                        onClick={() => toggleRoleSelection(role.name)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={role.name}
                            checked={selected}
                            onCheckedChange={() => toggleRoleSelection(role.name)}
                            className="border-white/40 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-300"
                          />
                          <Label htmlFor={role.name} className={cn('text-white/90 cursor-pointer select-none', selected && 'font-semibold text-green-300')}>
                            {role.name}
                          </Label>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="given_by_email" className="text-white/70 pb-1 block">
                Given By Email
              </Label>
              <InputFieldForEmail
                id="given_by_email"
                value={editedAccessManagement.given_by_email}
                onChange={value => handleFieldChange('given_by_email', value as string)}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-white/10 pt-4 -mb-2">
          <Button
            variant="outlineDefault"
            size="sm"
            onClick={() => {
              toggleEditModal(false);
              setSelectedAccessManagements(null);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleEditAccessManagement} variant="outlineWater" size="sm">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNextComponents;
