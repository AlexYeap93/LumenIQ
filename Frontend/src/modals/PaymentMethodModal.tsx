import { useState } from 'react';
import { CreditCard, Lock, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog';
import { paymentsApi } from '../api/payments';
import { toast } from 'sonner';

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
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleStripePortal = async () => {
    setIsRedirecting(true);
    try {
      const { portal_url } = await paymentsApi.createPortal(window.location.href);
      window.location.href = portal_url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not open billing portal';
      toast.error(message);
      setIsRedirecting(false);
    }
  };

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
              Manage your payment methods securely through the Stripe billing portal.
            </p>
          </div>

          <Button
            onClick={handleStripePortal}
            disabled={isRedirecting}
            variant="outline"
            className="w-full h-11 text-sm gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            {isRedirecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            {isRedirecting ? 'Redirecting...' : 'Open Stripe Billing Portal'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-slate-400">or enter name for records</span></div>
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
              Stripe Elements will be integrated here
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
