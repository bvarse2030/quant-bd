/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { format } from 'date-fns';

import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDuplicateKeyError, isApiErrorResponse } from '@/components/common/utils';
import { useGetVerificationsByIdQuery } from '@/redux/features/verifications/verificationsSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useVerificationsStore } from '../store/store';
import { IVerifications, defaultVerifications } from '../store/data/data';

type Primitive = string | number | boolean | null | undefined;

const ViewNextComponents: React.FC = () => {
  const { selectedVerifications, isViewModalOpen, toggleViewModal, setSelectedVerifications } = useVerificationsStore();

  const { data: verificationData, refetch } = useGetVerificationsByIdQuery(selectedVerifications?._id, { skip: !selectedVerifications?._id });

  useEffect(() => {
    if (selectedVerifications?._id) refetch();
  }, [selectedVerifications?._id, refetch]);

  useEffect(() => {
    if (verificationData?.data) setSelectedVerifications(verificationData.data as IVerifications);
  }, [verificationData, setSelectedVerifications]);

  const formatDate = (d?: string | Date): string => {
    if (!d) return 'N/A';
    try {
      return format(new Date(d), 'MMM dd, yyyy');
    } catch (error: unknown) {
      let errMessage: string = 'Invalid Date';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'API error';
      } else if (error instanceof Error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        errMessage = error.message;
      }

      return 'Invalid';
    }
  };

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/10">
      <span className="text-sm text-white/80">{label}</span>
      <span className="col-span-2 text-sm text-white">{(value ?? 'N/A') as Primitive}</span>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-2xl mt-8 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200">Verifications Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[520px] rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-4 mt-3">
          {selectedVerifications && (
            <>
              <DetailRow label="Identifier " value={selectedVerifications['identifier']} />
              <DetailRow label="Value " value={selectedVerifications['value']} />
              <DetailRow label="Created At" value={formatDate(selectedVerifications.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedVerifications.updatedAt)} />
            </>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            variant="outlineWater"
            onClick={() => {
              toggleViewModal(false);
              setSelectedVerifications(defaultVerifications as IVerifications);
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
