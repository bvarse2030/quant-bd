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
import { useGetAccountsByIdQuery } from '@/redux/features/accounts/accountsSlice';
import { formatDuplicateKeyError, isApiErrorResponse } from '@/components/common/utils';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useAccountsStore } from '../store/store';
import { IAccounts, defaultAccounts } from '../store/data/data';

type Primitive = string | number | boolean | null | undefined;

const ViewNextComponents: React.FC = () => {
  const { selectedAccounts, isViewModalOpen, toggleViewModal, setSelectedAccounts } = useAccountsStore();

  const { data: accountData, refetch } = useGetAccountsByIdQuery(selectedAccounts?._id, { skip: !selectedAccounts?._id });

  useEffect(() => {
    if (selectedAccounts?._id) refetch();
  }, [selectedAccounts?._id, refetch]);

  useEffect(() => {
    if (accountData?.data) setSelectedAccounts(accountData.data as IAccounts);
  }, [accountData, setSelectedAccounts]);

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
          <DialogTitle className="bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200">Accounts Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[520px] rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-4 mt-3">
          {selectedAccounts && (
            <>
              <DetailRow label="AccountId" value={selectedAccounts['accountId']} />
              <DetailRow label="ProviderId" value={selectedAccounts['providerId']} />
              <DetailRow label="UserId" value={selectedAccounts['userId']} />
              <DetailRow label="AccessToken" value={selectedAccounts['accessToken']} />
              <DetailRow label="IdToken" value={selectedAccounts['idToken']} />
              <DetailRow label="AccessTokenExpiresAt" value={formatDate(selectedAccounts['accessTokenExpiresAt'])} />
              <DetailRow label="Scope" value={selectedAccounts['scope']} />
              <DetailRow label="Created At" value={formatDate(selectedAccounts.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedAccounts.updatedAt)} />
            </>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            variant="outlineWater"
            onClick={() => {
              toggleViewModal(false);
              setSelectedAccounts(defaultAccounts as IAccounts);
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
