import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, PackageOpen } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="max-w-md w-full mx-auto my-12 bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6 text-center">
      <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Placed!</h1>
        <p className="text-sm text-slate-500">
          Thank you for your purchase. Your payment was confirmed and your order is being processed.
        </p>
      </div>

      {orderId && (
        <div className="bg-slate-50 rounded-2xl p-4 text-xs font-mono text-slate-500">
          <p className="text-slate-400 uppercase font-bold tracking-wider text-[10px] mb-1">Order Reference</p>
          <span>{orderId}</span>
        </div>
      )}

      <div className="flex flex-col space-y-3 pt-4">
        <Link
          to={`/orders`}
          className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-full shadow-lg shadow-indigo-100 transition-all"
        >
          <PackageOpen className="w-4 h-4" />
          <span>View Order History</span>
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center space-x-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-3.5 rounded-full transition-all"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
