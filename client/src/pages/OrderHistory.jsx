import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, ChevronRight, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { getMyOrders } from '../services/orderService.js';
import { formatPrice, formatDate } from '../utils/formatters.js';
import Loader from '../components/common/Loader.jsx';

const OrderHistory = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myOrders'],
    queryFn: getMyOrders
  });

  const orders = data?.orders || [];

  if (isLoading) {
    return <Loader fullPage={true} />;
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm p-4 rounded-2xl flex items-center space-x-2.5">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span>Failed to load orders. Please refresh the page.</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
        <p className="text-sm text-slate-500 mt-1">Review your past orders and their fulfillment status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto border border-slate-100">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">No Orders Found</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              You haven't placed any orders yet. Explore our collections to get started!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-semibold text-slate-500">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Order Placed</p>
                    <p className="text-slate-700 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Order ID</p>
                    <p className="font-mono text-slate-700 mt-0.5">{order._id}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 text-left sm:text-right">Total Amount</p>
                  <p className="text-base font-black text-indigo-600 mt-0.5">{formatPrice(order.totalPrice)}</p>
                </div>
              </div>

              {/* Order Status Bar */}
              <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap gap-4 text-xs font-semibold">
                <div className="flex items-center space-x-1.5">
                  <span className="text-slate-400">Payment:</span>
                  {order.isPaid ? (
                    <span className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Paid</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Pending Payment</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-slate-400">Shipping:</span>
                  {order.isDelivered ? (
                    <span className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Delivered</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Processing Shipment</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 px-6">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center py-4 text-sm">
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400 font-semibold">Quantity: {item.qty}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900 ml-4">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
