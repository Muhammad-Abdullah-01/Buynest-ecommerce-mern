import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema } from '../validations/schemas.js';
import * as authService from '../services/authService.js';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError('');
    setSuccessMsg('');
    try {
      const res = await authService.resetPassword(token, data.password);
      if (res?.success) {
        setSuccessMsg(res.message || 'Your password was successfully updated.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Token is invalid or has expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Set New Password</h1>
        <p className="text-sm text-slate-500">Please choose a secure new password for your account.</p>
      </div>

      {apiError && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm p-3.5 rounded-2xl flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {successMsg ? (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm p-5 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="font-bold">Password Reset Completed</span>
          </div>
          <p className="text-xs leading-relaxed text-emerald-600">
            {successMsg} Redirecting you to login page shortly...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={`w-full bg-slate-50 border rounded-xl py-2.5 py-2.5 pl-10 pr-10 text-sm focus:outline-none transition-all ${
                  errors.password
                    ? 'border-rose-300 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-transparent'
                }`}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-500 font-semibold">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-full shadow-lg shadow-indigo-100 disabled:opacity-40 transition-all focus:outline-none"
          >
            <span>{isSubmitting ? 'Updating...' : 'Save New Password'}</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
