import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { profileSchema } from '../validations/schemas.js';
import { useAuth } from '../hooks/useAuth.js';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema)
  });

  // Pre-populate fields on user load
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError('');
    setSuccessMsg('');
    try {
      const res = await updateProfile({
        name: data.name,
        email: data.email,
        password: data.password || undefined
      });
      if (res?.success) {
        setSuccessMsg(res.message || 'Profile details updated successfully');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your profile details and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Sidebar Info card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-md">
          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-lg text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide uppercase text-slate-400">Account Member</h3>
            <p className="font-black text-lg truncate mt-0.5">{user?.name}</p>
          </div>
          <div className="text-xs text-slate-400 space-y-1">
            <p>Role: <span className="font-semibold text-white capitalize">{user?.role}</span></p>
            <p>Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800">Profile Information</h2>

          {apiError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm p-3.5 rounded-2xl flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm p-3.5 rounded-2xl flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none transition-all ${
                    errors.name
                      ? 'border-rose-300 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
              {errors.name && <p className="text-xs text-rose-500 font-semibold">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none transition-all ${
                    errors.email
                      ? 'border-rose-300 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
              {errors.email && <p className="text-xs text-rose-500 font-semibold">{errors.email.message}</p>}
            </div>

            {/* Change Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Change Password (Leave blank to keep current)
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="New Password (min 6 chars)"
                  {...register('password')}
                  className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none transition-all ${
                    errors.password
                      ? 'border-rose-300 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
              {errors.password && <p className="text-xs text-rose-500 font-semibold">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-100 disabled:opacity-40 transition-all focus:outline-none text-sm mt-2"
            >
              {isSubmitting ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
