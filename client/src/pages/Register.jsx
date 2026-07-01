import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { registerSchema } from '../validations/schemas.js';
import { useAuth } from '../hooks/useAuth.js';

const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError('');
    try {
      const res = await registerAuth(data.name, data.email, data.password);
      if (res?.success) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
        <p className="text-sm text-slate-500">Sign up for a free account to manage orders and wishlists.</p>
      </div>

      {apiError && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm p-3.5 rounded-2xl flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{apiError}</span>
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

        {/* Password Field */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none transition-all ${
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
          <UserPlus className="w-4 h-4" />
          <span>{isSubmitting ? 'Creating Account...' : 'Sign Up'}</span>
        </button>
      </form>

      <div className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
