import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Modal from '@/components/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, ShoppingCartIcon as CashIcon } from 'lucide-react';
import { useResidentStore } from '../../../stores/residentStore';
import toast from 'react-hot-toast';

interface DeptorPaymentProps {
  onClose: () => void;
  debtor: any; // Replace 'any' with the appropriate type if known
}

interface FormValues {
  fullName: string;
  phone: string;
  paymentOption: 'credit_card' | 'MOMO' | 'cash';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  momoNumber?: string;
  room_number: string;
  balance: string;
  originalAmount: string;
  partialPayment: string;
  residentId: string;
}

const DeptorPayment: React.FC<DeptorPaymentProps> = ({ onClose, debtor }) => {
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<FormValues>();
  const residents = useResidentStore((state) => state.residents);
  const removeFromDebtorsList = useResidentStore((state) => state.removeFromDebtorsList);

  useEffect(() => {
    if (debtor) {
      const resident = residents.find((res) => res.id === debtor.residentId);
      setValue('fullName', debtor.fullName);
      setValue('phone', debtor.phone);
      setValue('room_number', resident?.roomNumber || '');
      setValue('originalAmount', debtor.originalAmount);
      setValue('partialPayment', debtor.partialPayment);
      setValue('balance', (debtor.originalAmount - debtor.partialPayment).toString());
      setValue('residentId', debtor.residentId);
    }
  }, [debtor, residents, setValue]);

  const paymentOption = watch('paymentOption');

  const onSubmit: SubmitHandler<FormValues> = data => {
    removeFromDebtorsList(data.residentId);
    toast.success('Payment processed successfully');
    toast.success('Resident removed from debtors list');
    onClose();
    console.log(data);
    // Handle form submission logic here
  };

  return (
    <Modal modalId='deptor_payment_modal' onClose={onClose} size='medium'>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fullName" className="">
            Full Name
          </Label>
          <Input
            id="fullName"
            {...register('fullName', { required: true })}
            className="col-span-3"
          />
          {errors.fullName && <span className="text-red-500">This field is required</span>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone" className="">
            Phone
          </Label>
          <Input
            id="phone"
            {...register('phone', { required: true })}
            className="col-span-3"
            type="tel"
          />
          {errors.phone && <span className="text-red-500">This field is required</span>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="room_number" className="">
            Room Number
          </Label>
          <Input
            id="room_number"
            {...register('room_number', { required: true })}
            className="col-span-3"
            type="tel"
          />
          {errors.room_number && <span className="text-red-500">This field is required</span>}
        </div>
        <div className='flex gap-4'>
          <div className="flex flex-col gap-2">
            <Label htmlFor="originalAmount" className="">
              Original Amount
            </Label>
            <Input
              readOnly
              id="originalAmount"
              {...register('originalAmount', { required: true })}
              className="col-span-3 bg-gray-300"
              type="tel"
            />
            {errors.originalAmount && <span className="text-red-500">This field is required</span>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="partialPayment" className="">
              Partial Payment
            </Label>
            <Input
              readOnly
              id="partialPayment"
              {...register('partialPayment', { required: true })}
              className="col-span-3 bg-gray-300"
              type="tel"
            />
            {errors.partialPayment && <span className="text-red-500">This field is required</span>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="balance" className="">
              Balance
            </Label>
            <Input
              id="balance"
              {...register('balance', { required: true })}
              className="col-span-3 "
              type="tel"
            />
            {errors.balance && <span className="text-red-500">This field is required</span>}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="residentId" className="">
            Resident ID
          </Label>
          <Input
            id="residentId"
            {...register('residentId', { required: true })}
            className="col-span-3"
            type="tel"
          />
          {errors.residentId && <span className="text-red-500">This field is required</span>}
        </div>
        <div className="grid gap-4">
          <Label className="text-left">
            Payment Option
          </Label>
          <RadioGroup
            value={paymentOption}
            onValueChange={(value) => setValue('paymentOption', value as 'credit_card' | 'MOMO' | 'cash')}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="credit_card" id="credit_card" className="peer sr-only" />
              <Label
                htmlFor="credit_card"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary hover:text-white peer-data-[state=checked]:border-primary cursor-pointer ${paymentOption === 'credit_card' ? 'bg-primary text-white' : ''}`}
              >
                <CreditCard className="mb-3 h-6 w-6" />
                Credit Card
              </Label>
            </div>
            <div>
              <RadioGroupItem value="MOMO" id="MOMO" className="peer sr-only" />
              <Label
                htmlFor="MOMO"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary hover:text-white peer-data-[state=checked]:border-primary cursor-pointer ${paymentOption === 'MOMO' ? 'bg-primary text-white' : ''}`}
              >
                <Wallet className="mb-3 h-6 w-6" />
                MOMO
              </Label>
            </div>
            <div>
              <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
              <Label
                htmlFor="cash"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary hover:text-white peer-data-[state=checked]:border-primary cursor-pointer ${paymentOption === 'cash' ? 'bg-primary text-white' : ''}`}
              >
                <CashIcon className="mb-3 h-6 w-6" />
                Cash
              </Label>
            </div>
          </RadioGroup>
        </div>
        {paymentOption === 'credit_card' && (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardNumber" className="text-right">
                Card Number
              </Label>
              <Input
                id="cardNumber"
                {...register('cardNumber', { required: true })}
                className="col-span-3"
              />
              {errors.cardNumber && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiryDate" className="text-right">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                {...register('expiryDate', { required: true })}
                className="col-span-3"
                placeholder="MM/YY"
              />
              {errors.expiryDate && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cvv" className="text-right">
                CVV
              </Label>
              <Input
                id="cvv"
                {...register('cvv', { required: true })}
                className="col-span-3"
              />
              {errors.cvv && <span className="text-red-500">This field is required</span>}
            </div>
          </>
        )}
        {paymentOption === 'MOMO' && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="momoNumber" className="text-right">
              MOMO Number
            </Label>
            <Input
              id="momoNumber"
              {...register('momoNumber', { required: true })}
              className="col-span-3 border"
            />
            {errors.momoNumber && <span className="text-red-500">This field is required</span>}
          </div>
        )}
        <Button type="submit" className="ml-auto">
          Submit Payment
        </Button>
      </form>
    </Modal>
  );
};

export default DeptorPayment;