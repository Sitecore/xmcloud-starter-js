'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MapPin } from 'lucide-react';

interface ZipcodeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (zipcode: string) => void;
  onUseMyLocation: () => void;
  isGeoLoading: boolean;
  error?: string | null;
}

export function ZipcodeModal({
  open,
  onClose,
  onSubmit,
  onUseMyLocation,
  isGeoLoading,
  error,
}: ZipcodeModalProps) {
  const [zipcode, setZipcode] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!zipcode.trim()) {
      setInputError('Please enter a valid zipcode');
      return;
    }

    // Basic zipcode validation (US format)
    const zipcodeRegex = /^\d{5}(-\d{4})?$/;
    if (!zipcodeRegex.test(zipcode.trim())) {
      setInputError('Please enter a valid 5-digit zipcode');
      return;
    }

    onSubmit(zipcode.trim());
    setZipcode('');
    setInputError(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className=" sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter your zipcode</DialogTitle>
          <DialogDescription>
            {error
              ? `We couldn't access your location: ${error}. Please enter your zipcode manually or try again.`
              : 'Please enter your zipcode to continue.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              id="zipcode"
              placeholder="Enter your zipcode (e.g., 10001)"
              value={zipcode}
              onChange={(e) => {
                setZipcode(e.target.value);
                setInputError(null);
              }}
              className={inputError ? 'border-red-500' : ''}
            />
            {inputError && <p className="text-sm text-red-500">{inputError}</p>}
          </div>

          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onUseMyLocation}
              disabled={isGeoLoading}
              className="flex w-full items-center justify-center gap-2"
            >
              <MapPin size={16} />
              {isGeoLoading ? 'Getting location...' : 'Use my location'}
              {isGeoLoading && (
                <div className="border-primary ml-1 h-4 w-4 animate-spin rounded-full border-b-2"></div>
              )}
            </Button>
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" className="flex w-full items-center justify-center">
              Save zipcode
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
