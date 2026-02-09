import { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog';

interface PaymentMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSavePaymentMethod?: (payload: { holderName: string }) => void;
}

export function PaymentMethodModal({
  open,
  onOpenChange,
  onSavePaymentMethod
}: PaymentMethodModalProps) {
  const [holderName, setHolderName] = useState('');

  const handleSave = () => {
    onSavePaymentMethod?.({ holderName });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl w-full rounded-2xl border border-slate-200 bg-white/95 p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-semibold text-slate-900">Update payment method</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Lock className="h-4 w-4 text-blue-600" />
              Stripe-secured payment details
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Card details will be collected via Stripe Elements/Checkout in production.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholderName" className="text-slate-700">Cardholder name</Label>
            <Input
              id="cardholderName"
              value={holderName}
              onChange={(event) => setHolderName(event.target.value)}
              placeholder="Jane Doe"
              className="border-slate-200 bg-white/90"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700">Card details</Label>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-500">
              <CreditCard className="h-4 w-4 text-slate-400" />
              will add the stripe section here
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave} className="gradient-blue-primary text-white hover:opacity-90">
            Save payment method
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
