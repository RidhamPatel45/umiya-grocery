'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

// Zod Schema for Address Validation (localized to India)
export const addressSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  streetAddress: z.string().min(5, 'Street address must be at least 5 characters'),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  pinCode: z.string().regex(/^[1-9]\d{5}$/, 'PIN code must be a valid 6-digit number (e.g. 380001)'),
  addressType: z.enum(['home', 'work'], {
    errorMap: () => ({ message: 'Please select an address type' }),
  }),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface CheckoutAddressFormProps {
  layout?: 'amazon-style' | 'flipkart-style';
  onSubmitSuccess?: (data: AddressFormData) => void;
}

export function CheckoutAddressForm({
  layout = 'amazon-style',
  onSubmitSuccess,
}: CheckoutAddressFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      phone: '',
      streetAddress: '',
      landmark: '',
      city: '',
      state: '',
      pinCode: '',
      addressType: 'home',
    },
  });

  const pinCodeValue = watch('pinCode');
  const [isAhmedabadZone, setIsAhmedabadZone] = useState<boolean | null>(null);

  // Conditional logic to flag Ahmedabad delivery zone availability
  useEffect(() => {
    if (pinCodeValue && /^[1-9]\d{5}$/.test(pinCodeValue)) {
      if (pinCodeValue.startsWith('38')) {
        setIsAhmedabadZone(true);
        // Autopopulate typical cities in Gujarat for these PINs
        setValue('state', 'Gujarat');
        setValue('city', 'Ahmedabad');
      } else {
        setIsAhmedabadZone(false);
      }
    } else {
      setIsAhmedabadZone(null);
    }
  }, [pinCodeValue, setValue]);

  // Telemetry simulation for UX metrics
  const onSubmit = (data: AddressFormData) => {
    // UX Research metrics logging
    console.log(`[UX Research] Form Submitted successfully using layout: "${layout}"`);
    console.log(`[UX Research] Metrics - Form validity: ${isValid}, Ahmedabad Delivery: ${isAhmedabadZone}`);
    
    if (onSubmitSuccess) {
      onSubmitSuccess(data);
    }
  };

  const isAmazon = layout === 'amazon-style';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        'transition-all duration-300',
        isAmazon 
          ? 'bg-amber-50/20 border border-slate-200 p-6 rounded-lg shadow-sm font-sans'
          : 'bg-white border-2 border-slate-100 p-8 rounded-xl shadow-md font-sans'
      )}
      aria-label={`${isAmazon ? 'Amazon style' : 'Flipkart style'} Address Entry Form`}
    >
      {/* UX Layout Header */}
      <div className="mb-6">
        <h2 className={cn(
          'font-bold',
          isAmazon ? 'text-xl text-slate-800' : 'text-lg uppercase tracking-wider text-slate-900 border-b pb-2'
        )}>
          {isAmazon ? 'Add a new delivery address' : '2. DELIVERY ADDRESS'}
        </h2>
        {isAmazon && <p className="text-xs text-slate-500 mt-1">Please enter your shipping information below.</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Full Name */}
        <div className="md:col-span-2">
          <label 
            htmlFor="fullName" 
            className={cn(
              'block text-sm font-semibold mb-1',
              isAmazon ? 'text-slate-800' : 'text-slate-500'
            )}
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="e.g. John Doe"
            {...register('fullName')}
            className={cn(
              'w-full px-3 py-2 text-sm border rounded-md transition-all outline-none',
              isAmazon 
                ? 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                : 'border-slate-200 focus:border-blue-500 bg-slate-50 focus:bg-white',
              errors.fullName && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
            )}
            aria-invalid={errors.fullName ? 'true' : 'false'}
          />
          {errors.fullName && (
            <p className="text-rose-600 text-xs mt-1 flex items-center gap-1" role="alert">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label 
            htmlFor="phone" 
            className={cn(
              'block text-sm font-semibold mb-1',
              isAmazon ? 'text-slate-800' : 'text-slate-500'
            )}
          >
            Mobile Number
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">+91</span>
            <input
              id="phone"
              type="tel"
              placeholder="10-digit number"
              {...register('phone')}
              className={cn(
                'w-full pl-11 pr-3 py-2 text-sm border rounded-md transition-all outline-none',
                isAmazon 
                  ? 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                  : 'border-slate-200 focus:border-blue-500 bg-slate-50 focus:bg-white',
                errors.phone && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
              )}
              aria-invalid={errors.phone ? 'true' : 'false'}
            />
          </div>
          {errors.phone && (
            <p className="text-rose-600 text-xs mt-1 flex items-center gap-1" role="alert">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.phone.message}
            </p>
          )}
        </div>

        {/* PIN Code */}
        <div>
          <label 
            htmlFor="pinCode" 
            className={cn(
              'block text-sm font-semibold mb-1',
              isAmazon ? 'text-slate-800' : 'text-slate-500'
            )}
          >
            Pincode
          </label>
          <input
            id="pinCode"
            type="text"
            maxLength={6}
            placeholder="6-digit PIN code"
            {...register('pinCode')}
            className={cn(
              'w-full px-3 py-2 text-sm border rounded-md transition-all outline-none',
              isAmazon 
                ? 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                : 'border-slate-200 focus:border-blue-500 bg-slate-50 focus:bg-white',
              errors.pinCode && 'border-rose-500'
            )}
            aria-invalid={errors.pinCode ? 'true' : 'false'}
          />
          {errors.pinCode && (
            <p className="text-rose-600 text-xs mt-1 flex items-center gap-1" role="alert">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.pinCode.message}
            </p>
          )}

          {/* Delivery Zone availability notices */}
          {isAhmedabadZone === true && (
            <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-md flex items-start gap-1.5 text-[11px] text-emerald-800" role="status">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Ahmedabad Express Zone:</span> Eligible for free Same-Day/Next-Day shipping from Umiya Hub.
              </div>
            </div>
          )}
          {isAhmedabadZone === false && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-1.5 text-[11px] text-amber-800" role="status">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Standard Delivery Zone:</span> Deliveries usually arrive in 3-5 business days.
              </div>
            </div>
          )}
        </div>

        {/* Street Address */}
        <div className="md:col-span-2">
          <label 
            htmlFor="streetAddress" 
            className={cn(
              'block text-sm font-semibold mb-1',
              isAmazon ? 'text-slate-800' : 'text-slate-500'
            )}
          >
            Flat, House no., Building, Company, Apartment
          </label>
          <input
            id="streetAddress"
            type="text"
            placeholder="e.g. A-402, Shivalik Residency"
            {...register('streetAddress')}
            className={cn(
              'w-full px-3 py-2 text-sm border rounded-md transition-all outline-none',
              isAmazon 
                ? 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                : 'border-slate-200 focus:border-blue-500 bg-slate-50 focus:bg-white',
              errors.streetAddress && 'border-rose-500'
            )}
            aria-invalid={errors.streetAddress ? 'true' : 'false'}
          />
          {errors.streetAddress && (
            <p className="text-rose-600 text-xs mt-1 flex items-center gap-1" role="alert">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.streetAddress.message}
            </p>
          )}
        </div>

        {/* Landmark */}
        <div className="md:col-span-2">
          <label 
            htmlFor="landmark" 
            className={cn(
              'block text-sm font-semibold mb-1',
              isAmazon ? 'text-slate-800' : 'text-slate-500'
            )}
          >
            Landmark <span className="text-slate-400 font-normal text-xs">(Optional)</span>
          </label>
          <input
            id="landmark"
            type="text"
            placeholder="e.g. Near Star Bazaar"
            {...register('landmark')}
            className={cn(
              'w-full px-3 py-2 text-sm border rounded-md transition-all outline-none',
              isAmazon 
                ? 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                : 'border-slate-200 focus:border-blue-500 bg-slate-50 focus:bg-white'
            )}
          />
        </div>

        {/* Town/City */}
        <div>
          <label 
            htmlFor="city" 
            className={cn(
              'block text-sm font-semibold mb-1',
              isAmazon ? 'text-slate-800' : 'text-slate-500'
            )}
          >
            Town/City
          </label>
          <input
            id="city"
            type="text"
            placeholder="e.g. Ahmedabad"
            {...register('city')}
            className={cn(
              'w-full px-3 py-2 text-sm border rounded-md transition-all outline-none',
              isAmazon 
                ? 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                : 'border-slate-200 focus:border-blue-500 bg-slate-50 focus:bg-white',
              errors.city && 'border-rose-500'
            )}
            aria-invalid={errors.city ? 'true' : 'false'}
          />
          {errors.city && (
            <p className="text-rose-600 text-xs mt-1 flex items-center gap-1" role="alert">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.city.message}
            </p>
          )}
        </div>

        {/* State */}
        <div>
          <label 
            htmlFor="state" 
            className={cn(
              'block text-sm font-semibold mb-1',
              isAmazon ? 'text-slate-800' : 'text-slate-500'
            )}
          >
            State
          </label>
          <input
            id="state"
            type="text"
            placeholder="e.g. Gujarat"
            {...register('state')}
            className={cn(
              'w-full px-3 py-2 text-sm border rounded-md transition-all outline-none',
              isAmazon 
                ? 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                : 'border-slate-200 focus:border-blue-500 bg-slate-50 focus:bg-white',
              errors.state && 'border-rose-500'
            )}
            aria-invalid={errors.state ? 'true' : 'false'}
          />
          {errors.state && (
            <p className="text-rose-600 text-xs mt-1 flex items-center gap-1" role="alert">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.state.message}
            </p>
          )}
        </div>

        {/* Address Type Selection */}
        <div className="md:col-span-2 mt-2">
          <label className={cn(
            'block text-sm font-semibold mb-2',
            isAmazon ? 'text-slate-800' : 'text-slate-500'
          )}>
            Select an Address Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                value="home"
                {...register('addressType')}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              Home (7 AM - 9 PM delivery)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                value="work"
                {...register('addressType')}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              Office/Commercial (10 AM - 6 PM delivery)
            </label>
          </div>
          {errors.addressType && (
            <p className="text-rose-600 text-xs mt-1 flex items-center gap-1" role="alert">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.addressType.message}
            </p>
          )}
        </div>

      </div>

      {/* Action Button */}
      <div className="mt-8 flex justify-start">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'px-6 py-2.5 text-sm font-bold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
            isAmazon
              ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 border border-amber-500 focus:ring-amber-500'
              : 'bg-orange-500 hover:bg-orange-600 text-white w-full py-3 uppercase tracking-wider focus:ring-orange-500'
          )}
        >
          {isSubmitting 
            ? 'Processing...' 
            : isAmazon 
              ? 'Use this address' 
              : 'SAVE AND DELIVER HERE'
          }
        </button>
      </div>

    </form>
  );
}

export default CheckoutAddressForm;
