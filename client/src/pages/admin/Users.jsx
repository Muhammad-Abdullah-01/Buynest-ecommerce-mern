import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCheck, ShieldAlert, Trash2, AlertCircle } from 'lucide-react';
import * as orderService from '../../services/orderService.js';
import Loader from '../../components/common/Loader.jsx';

const Users = () => {
  const queryClient = useQueryClient();

  // Fetch all users
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: orderService.getAllUsers
  });

  const users = data?.users || [];

  // Update user role mutation
  const roleMutation = useMutation({
    mutationFn: ({ id, userData }) => orderService.updateUserRole(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to modify role.');
    }
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: orderService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  });

  const handleRoleToggle = (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (
      window.confirm(
        `Are you sure you want to change ${user.name}'s role from ${user.role} to ${newRole}?`
      )
    ) {
      roleMutation.mutate({ id: user._id, userData: { role: newRole } });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this user account?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm p-4 rounded-2xl flex items-center space-x-2.5">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span>Failed to fetch user accounts logs. Verify session credentials.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <p className="text-sm text-slate-500">Configure administrative access roles and remove user records.</p>

      {users.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/60 rounded-3xl">
          <p className="text-slate-400">No registered users found.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4">Status Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {users.map((user) => (
                  <tr key={user._id} className="text-slate-600 hover:bg-slate-50/40">
                    <td className="px-6 py-4 font-bold text-slate-800">{user.name}</td>
                    <td className="px-6 py-4 font-mono text-xs">{user.email}</td>
                    <td className="px-6 py-4 text-xs font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 uppercase tracking-wider">
                          Admin
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleRoleToggle(user)}
                        className="p-2 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors inline-flex"
                        title="Toggle Access Role"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 rounded-lg transition-colors inline-flex"
                        title="Delete Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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

export default Users;
