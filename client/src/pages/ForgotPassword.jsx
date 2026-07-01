import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema } from '../validations/schemas.js';
import * as authService from '../services/authService.js';

const ForgotPassword = () => {
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError('');
    setSuccessMsg('');
    try {
      const res = await authService.forgotPassword(data.email);
      if (res?.success) {
        setSuccessMsg(res.message || 'If that email exists, we have sent a reset link.');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6">
      <div className="space-y-2">
        <Link
          to="/login"
          className="inline-flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight pt-2">Reset Password</h1>
        <p className="text-sm text-slate-500">
          Enter your email and we'll send a secure link to reset your password.
        </p>
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
            <span className="font-bold">Email Sent</span>
          </div>
          <p className="text-xs leading-relaxed text-emerald-600">
            {successMsg}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-full shadow-lg shadow-indigo-100 disabled:opacity-40 transition-all focus:outline-none"
          >
            <span>{isSubmitting ? 'Requesting link...' : 'Send Reset Link'}</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
