'use client';

import React, { useState } from 'react';
import { CheckoutAddressForm, AddressFormData } from '@/components/features/CheckoutAddressForm';
import { formatINR } from '@/lib/utils';
import { ShoppingBag, Landmark, Clock, CheckCircle, BarChart3, HelpCircle, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const [activeLayout, setActiveLayout] = useState<'amazon-style' | 'flipkart-style'>('amazon-style');
  const [successData, setSuccessData] = useState<AddressFormData | null>(null);

  // Cart summary details local variables
  const itemsSubtotal = 4850;
  const deliveryCharges = activeLayout === 'amazon-style' ? 80 : 0; // Simulate different platform fee policies
  const discountAmount = 450;
  const totalDue = itemsSubtotal + deliveryCharges - discountAmount;

  const handleFormSubmitSuccess = (data: AddressFormData) => {
    setSuccessData(data);
    setTimeout(() => {
      setSuccessData(null);
    }, 8000);
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Title & A/B testing Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Checkout Page</h1>
          <p className="text-slate-500 text-sm mt-1">
            Select layout variant to run comparison experiments.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
          <span className="text-xs font-bold text-slate-500 uppercase px-2">UX Layout:</span>
          <button
            onClick={() => {
              setActiveLayout('amazon-style');
              setSuccessData(null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeLayout === 'amazon-style'
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Amazon Style
          </button>
          <button
            onClick={() => {
              setActiveLayout('flipkart-style');
              setSuccessData(null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeLayout === 'flipkart-style'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Flipkart Style
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Checkout address form column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Address Form Container */}
          <div className="relative">
            <CheckoutAddressForm 
              layout={activeLayout} 
              onSubmitSuccess={handleFormSubmitSuccess} 
            />
            
            {/* Form Success Popup Overlay */}
            {successData && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center p-6 z-10 animate-fade-in">
                <div className="max-w-md text-center bg-white border border-emerald-100 p-6 rounded-2xl shadow-xl">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-800">Address Saved Successfully</h3>
                  <p className="text-slate-500 text-xs mt-1">
                    Simulated address saved in database. Checkout flow proceeding...
                  </p>
                  <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 mt-4 space-y-1">
                    <p><span className="font-semibold text-slate-700">Recipient:</span> {successData.fullName}</p>
                    <p><span className="font-semibold text-slate-700">Phone:</span> +91 {successData.phone}</p>
                    <p><span className="font-semibold text-slate-700">Address:</span> {successData.streetAddress}, {successData.landmark && `${successData.landmark}, `}{successData.city}, {successData.state} - {successData.pinCode}</p>
                    <p><span className="font-semibold text-slate-700">Delivery Type:</span> {successData.addressType.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* UX Research Comparative Explanation Panel */}
          <section className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold tracking-tight">UX Comparative Testing Architecture</h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              This form acts as a modular layout renderer for A/B usability experiments. By passing the 
              <code className="bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-[10px] mx-1">layout</code> prop, 
              researchers can switch between checkout structures while retaining the identical underlying state management, Zod validations, and submission handlers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-emerald-900 pt-4 mt-2">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase mb-1">
                  <Clock className="w-3.5 h-3.5" /> Task Time
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Measures user speed from load to validation success. Flipkart's full-width fields can reduce mobile scrolling times.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase mb-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Error Rates
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Tracks where inline Zod validation triggers most frequently. Form field ordering changes cognitive visual load.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase mb-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Cognitive Load
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Compares Amazon's multi-step compact flow against Flipkart's single-panel visual sequence for purchase completion rates.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Checkout Order summary column */}
        <div className="space-y-6">
          
          {/* Price details card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 border-b pb-3 mb-4">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">Price Details</h2>
            </div>
            
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Price ({2} items)</span>
                <span className="font-semibold text-slate-800">{formatINR(itemsSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-emerald-600 font-semibold">-{formatINR(discountAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                {deliveryCharges === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE Delivery</span>
                ) : (
                  <span className="font-semibold text-slate-800">{formatINR(deliveryCharges)}</span>
                )}
              </div>
              
              <div className="border-t pt-3 flex justify-between text-base font-black text-slate-800">
                <span>Total Amount</span>
                <span>{formatINR(totalDue)}</span>
              </div>
            </div>

            <div className="mt-4 p-2 bg-emerald-50 text-[11px] text-emerald-800 rounded-lg text-center font-medium border border-emerald-100">
              You will save {formatINR(discountAmount)} on this order
            </div>
          </div>

          {/* Delivery speed policies summary card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Landmark className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase">Umiya Logistics Hub</h3>
            </div>
            <ul className="text-xs text-slate-500 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Ahmedabad region orders are shipped from main distribution hub with Express same-day service.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Strict verification of PIN codes to match zone constraints.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Cash on Delivery (COD) and Online Bank Transfers are fully supported.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
