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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetAccessManagementsByIdQuery } from '@/redux/features/accessManagements/accessManagementsSlice';

import { useAccessManagementsStore } from '../store/store';
import { IAccessManagements, defaultAccessManagements } from '../store/data/data';

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedAccessManagements, toggleViewModal, setSelectedAccessManagements } = useAccessManagementsStore();

  const { data: accessManagementData, refetch } = useGetAccessManagementsByIdQuery(selectedAccessManagements?._id, { skip: !selectedAccessManagements?._id });

  useEffect(() => {
    if (selectedAccessManagements?._id) {
      refetch();
    }
  }, [selectedAccessManagements?._id, refetch]);

  useEffect(() => {
    if (accessManagementData?.data) {
      setSelectedAccessManagements(accessManagementData.data);
    }
  }, [accessManagementData, setSelectedAccessManagements]);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const DetailRow: React.FC<{
    label: string;
    value: React.ReactNode;
  }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/10">
      <div className="font-semibold text-sm text-white/70">{label}</div>
      <div className="col-span-2 text-sm text-white/90">{value || 'N/A'}</div>
    </div>
  );

  const DetailRowArray: React.FC<{
    label: string;
    values?: (string | number)[];
  }> = ({ label, values }) => <DetailRow label={label} value={values?.join(', ') || 'N/A'} />;

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[625px] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg rounded-sm mt-8">
        <DialogHeader className="border-b border-white/10 pb-3">
          <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">AccessManagements Details</DialogTitle>
        </DialogHeader>
        {selectedAccessManagements && (
          <ScrollArea className="h-[450px] w-full rounded-sm border border-white/10 p-4 bg-white/5 backdrop-blur-md shadow-inner">
            <div className="grid gap-1">
              <DetailRow label="User_name" value={selectedAccessManagements['user_name']} />
              <DetailRow label="User_email" value={selectedAccessManagements['user_email']} />
              <DetailRowArray label="Assign_role" values={selectedAccessManagements['assign_role']} />
              <DetailRow label="Given_by_email" value={selectedAccessManagements['given_by_email']} />
              <DetailRow label="Created At" value={formatDate(selectedAccessManagements.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedAccessManagements.updatedAt)} />
            </div>
          </ScrollArea>
        )}
        <DialogFooter className="border-t border-white/10 pt-4 -mb-2">
          <Button
            variant="outlineWater"
            size="sm"
            onClick={() => {
              toggleViewModal(false);
              setSelectedAccessManagements(defaultAccessManagements as IAccessManagements);
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
