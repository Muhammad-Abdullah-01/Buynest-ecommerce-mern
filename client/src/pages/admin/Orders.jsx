import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, AlertCircle, ShoppingBag, Eye, Truck } from 'lucide-react';
import * as orderService from '../../services/orderService.js';
import { formatPrice, formatDate } from '../../utils/formatters.js';
import Loader from '../../components/common/Loader.jsx';

const Orders = () => {
  const queryClient = useQueryClient();

  // Fetch all orders
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: orderService.getAllOrders
  });

  // Mark as delivered mutation
  const deliverMutation = useMutation({
    mutationFn: orderService.deliverOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrders']);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Fulfillment action failed.');
    }
  });

  const orders = data?.orders || [];

  const handleDeliver = (id) => {
    if (window.confirm('Mark this order as fulfilled and delivered?')) {
      deliverMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm p-4 rounded-2xl flex items-center space-x-2.5">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span>Failed to retrieve system order logs. Verify administrator sessions.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <p className="text-sm text-slate-500">Monitor billing statuses, shipping locations, and update fulfillment marks.</p>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/60 rounded-3xl">
          <p className="text-slate-400">No checkout transactions found.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Delivery</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {orders.map((order) => (
                  <tr key={order._id} className="text-slate-600 hover:bg-slate-50/40">
                    <td className="px-6 py-4 font-mono text-xs font-semibold">{order._id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{order.user?.name || 'Guest User'}</div>
                      <div className="text-[10px] text-slate-400">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 font-black text-slate-800">{formatPrice(order.totalPrice)}</td>
                    <td className="px-6 py-4">
                      {order.isPaid ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          Paid
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {order.isDelivered ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          Delivered
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          Processing
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!order.isDelivered && order.isPaid && (
                        <button
                          onClick={() => handleDeliver(order._id)}
                          className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-100 font-semibold py-1.5 px-3 rounded-full text-xs transition-all ml-auto"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Fulfill</span>
                        </button>
                      )}
                      {(!order.isPaid || order.isDelivered) && (
                        <span className="text-xs text-slate-400 font-semibold block pr-4">Complete</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
