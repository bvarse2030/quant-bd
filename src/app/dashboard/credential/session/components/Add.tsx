/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DateField } from '@/components/dashboard-ui/DateField';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import { useAddSessionsMutation } from '@/redux/features/sessions/sessionsSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useSessionsStore } from '../store/store';
import { ISessions, defaultSessions } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

const AddNextComponents: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setSessions } = useSessionsStore();
  const [addSessions, { isLoading }] = useAddSessionsMutation();
  const [newSession, setNewSession] = useState<ISessions>(defaultSessions);

  const handleFieldChange = (name: string, value: unknown) => {
    setNewSession(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSession = async () => {
    try {
      const updateData = { ...newSession };
      delete updateData._id;

      const addedSession = await addSessions(updateData).unwrap();
      setSessions([addedSession]);
      toggleAddModal(false);
      setNewSession(defaultSessions);
      handleSuccess('Added Successfully');
    } catch (error: unknown) {
      console.error('Failed to add record:', error);
      let errMessage: string = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent
        className="sm:max-w-[825px] rounded-xl border mt-[35px] border-white/20 bg-white/10
                           backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 p-0"
      >
        <ScrollArea className="h-[75vh] max-h-[calc(100vh-2rem)] rounded-xl">
          <DialogHeader className="p-6 pb-3">
            <DialogTitle
              className="text-xl font-semibold bg-clip-text text-transparent
                                       bg-linear-to-r from-white to-blue-200 drop-shadow-md"
            >
              Add New Session
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4 px-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="expiresAt" className="text-right ">
                ExpiresAt
              </Label>
              <div className="col-span-3">
                <DateField id="expiresAt" value={newSession['expiresAt']} onChange={date => handleFieldChange('expiresAt', date)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="token" className="text-right ">
                Token
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="token"
                  placeholder="Token"
                  value={newSession['token']}
                  onChange={value => handleFieldChange('token', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="createdAt" className="text-right ">
                CreatedAt
              </Label>
              <div className="col-span-3">
                <DateField id="createdAt" value={newSession['createdAt']} onChange={date => handleFieldChange('createdAt', date)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="updatedAt" className="text-right ">
                UpdatedAt
              </Label>
              <div className="col-span-3">
                <DateField id="updatedAt" value={newSession['updatedAt']} onChange={date => handleFieldChange('updatedAt', date)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="ipAddress" className="text-right ">
                IpAddress
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="ipAddress"
                  placeholder="IpAddress"
                  value={newSession['ipAddress']}
                  onChange={value => handleFieldChange('ipAddress', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="userAgent" className="text-right ">
                UserAgent
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="userAgent"
                  placeholder="UserAgent"
                  value={newSession['userAgent']}
                  onChange={value => handleFieldChange('userAgent', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="userId" className="text-right ">
                UserId
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="userId"
                  placeholder="UserId"
                  value={newSession['userId']}
                  onChange={value => handleFieldChange('userId', value as string)}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 gap-3">
          <Button variant="outlineWater" onClick={() => toggleAddModal(false)} size="sm">
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleAddSession} variant="outlineGarden" size="sm">
            {isLoading ? 'Adding...' : 'Add Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
