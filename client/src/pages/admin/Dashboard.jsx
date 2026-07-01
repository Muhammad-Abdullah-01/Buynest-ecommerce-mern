import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, ShoppingCart, Package, Users, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { getDashboardStats } from '../../services/orderService.js';
import { formatPrice, formatDate } from '../../utils/formatters.js';
import Loader from '../../components/common/Loader.jsx';

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getDashboardStats,
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm p-4 rounded-2xl flex items-center space-x-2.5">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span>Failed to load admin stats. Please verify authorization credentials.</span>
      </div>
    );
  }

  const { stats, recentOrders = [], ordersByCategory = [] } = data || {};

  const cardItems = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      icon: <DollarSign className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50'
    },
    {
      title: 'Orders Placed',
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50'
    },
    {
      title: 'Boutique Products',
      value: stats?.totalProducts || 0,
      icon: <Package className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50'
    },
    {
      title: 'Active Users',
      value: stats?.totalUsers || 0,
      icon: <Users className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50'
    }
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardItems.map((card) => (
          <div
            key={card.title}
            className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <p className="text-2xl font-black text-slate-800">{card.value}</p>
            </div>
            <div className={`p-4 rounded-2xl ${card.bg}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-slate-400">No orders placed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="text-slate-600 hover:bg-slate-50/50">
                      <td className="py-3">
                        <div className="font-semibold text-slate-800">{order.user?.name}</div>
                        <div className="text-[10px] text-slate-400">{order.user?.email}</div>
                      </td>
                      <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3">
                        {order.isPaid ? (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            Paid
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right font-bold text-slate-800">
                        {formatPrice(order.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sales by Category chart widget */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Revenue by Category</h2>

          {ordersByCategory.length === 0 ? (
            <p className="text-sm text-slate-400">No category statistics available.</p>
          ) : (
            <div className="space-y-4 pt-2">
              {ordersByCategory.map((cat) => {
                // Find maximum sales value to compute relative bar percentages
                const maxSales = Math.max(...ordersByCategory.map((c) => c.sales));
                const percentage = maxSales > 0 ? (cat.sales / maxSales) * 100 : 0;
                return (
                  <div key={cat._id || 'other'} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>{cat._id || 'Uncategorized'}</span>
                      <span className="font-bold text-indigo-600">{formatPrice(cat.sales)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
