/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { format } from 'date-fns';

import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetUsersByIdQuery } from '@/redux/features/user/userSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useUsersStore } from '../store/store';
import { IUsers, defaultUsers } from '../store/data/data';

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedUsers, toggleViewModal, setSelectedUsers } = useUsersStore();

  const { data: userData, refetch } = useGetUsersByIdQuery(selectedUsers?._id, { skip: !selectedUsers?._id });

  useEffect(() => {
    if (selectedUsers?._id) {
      refetch();
    }
  }, [selectedUsers?._id, refetch]);

  useEffect(() => {
    if (userData?.data) {
      setSelectedUsers(userData.data);
    }
  }, [userData, setSelectedUsers]);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatBoolean = (value?: boolean) => (value ? 'Yes' : 'No');

  const DetailRow: React.FC<{
    label: string;
    value: React.ReactNode;
  }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/10">
      <div className="font-semibold text-sm text-white/70">{label}</div>
      <div className="col-span-2 text-sm text-white/90">{value || 'N/A'}</div>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[625px] mt-[30px] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg rounded-2xl">
        <DialogHeader className="border-b border-white/10 pb-3">
          <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">Users Details</DialogTitle>
        </DialogHeader>
        {selectedUsers && (
          <ScrollArea className="h-[450px] w-full rounded-md border border-white/10 p-4 bg-white/5 backdrop-blur-md shadow-inner">
            <div className="grid gap-1">
              <DetailRow label="Name" value={selectedUsers['name']} />
              <DetailRow label="Email" value={selectedUsers['email']} />
              <DetailRow
                label="Email Verified"
                value={
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                               ${
                                 selectedUsers['emailVerified']
                                   ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                   : 'bg-red-500/20 text-red-300 border border-red-500/30'
                               }`}
                  >
                    {formatBoolean(selectedUsers['emailVerified'])}
                  </span>
                }
              />
              <DetailRow label="Created At" value={formatDate(selectedUsers.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedUsers.updatedAt)} />
            </div>
          </ScrollArea>
        )}
        <DialogFooter className="border-t border-white/10 pt-3">
          <Button
            variant="outlineDefault"
            onClick={() => {
              toggleViewModal(false);
              setSelectedUsers(defaultUsers as IUsers);
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNextComponents;
