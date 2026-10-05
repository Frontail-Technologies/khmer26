'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SpinnerGap } from '@phosphor-icons/react';

export interface ActionReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  required?: boolean;
  minLength?: number;
  isPending?: boolean;
  onConfirm: (reason: string) => void | Promise<void>;
}

export function ActionReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  placeholder = 'Enter reason or notes for this action...',
  confirmLabel = 'Submit',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  required = true,
  minLength = 3,
  isPending = false,
  onConfirm,
}: ActionReasonDialogProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setReason('');
      setError(null);
    }
  }

  const handleConfirm = async () => {
    const trimmed = reason.trim();
    if (required && (!trimmed || trimmed.length < minLength)) {
      setError(`Please provide a reason (minimum ${minLength} characters).`);
      return;
    }
    setError(null);
    await onConfirm(trimmed);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isPending && onOpenChange(val)}>
      <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError(null);
            }}
            placeholder={placeholder}
            rows={4}
            disabled={isPending}
            className="text-xs sm:text-sm resize-none rounded-xl bg-background"
          />
          {error && (
            <p className="text-[11px] font-medium text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter className="flex-row justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="h-9 px-4 text-xs font-semibold rounded-lg"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant}
            size="sm"
            onClick={handleConfirm}
            disabled={isPending}
            className="h-9 px-4 text-xs font-semibold rounded-lg"
          >
            {isPending && <SpinnerGap className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
