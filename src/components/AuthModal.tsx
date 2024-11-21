import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';
import { useAuthStore } from '../store/authStore';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: { id: string; role: UserRole; vendorId?: string }) => void;
  language: 'en' | 'ar';
}

export function AuthModal({ mode, onClose, onSuccess, language }: AuthModalProps) {
  const { signIn, signUp, verifyOTP, loading, error } = useAuthStore();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    try {
      const identifier = authMethod === 'email' ? email : `+${phone}`;
      const isPhone = authMethod === 'phone';

      if (mode === 'login') {
        await signIn(identifier, password, isPhone);
        const user = useAuthStore.getState().user;
        if (user) {
          onSuccess(user);
          onClose();
        }
      } else {
        // For registration
        if (isPhone) {
          // Start phone verification process
          const result = await signUp(
            identifier,
            password,
            name,
            'customer',
            isPhone
          );

          if (result?.success) {
            setShowOTPInput(true);
          }
        } else {
          // Regular email registration
          const result = await signUp(
            identifier,
            password,
            name,
            'customer',
            isPhone
          );

          if (result?.success) {
            setRegistrationSuccess(true);
            setEmail('');
            setPhone('');
            setPassword('');
            setName('');
          }
        }
      }
    } catch (err) {
      setLocalError((err as Error).message);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    try {
      const result = await verifyOTP(`+${phone}`, otp);
      if (result.success) {
        setRegistrationSuccess(true);
        setShowOTPInput(false);
        setOTP('');
      }
    } catch (err) {
      setLocalError((err as Error).message);
    }
  };

  if (showOTPInput) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold text-center mb-6">
            {language === 'en' ? 'Verify Phone Number' : 'تأكيد رقم الهاتف'}
          </h2>

          {localError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {localError}
            </div>
          )}

          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Enter Verification Code' : 'أدخل رمز التحقق'}
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={language === 'en' ? 'Enter 6-digit code' : 'أدخل الرمز المكون من 6 أرقام'}
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin">⌛</span>
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {language === 'en' ? 'Verify Code' : 'تحقق من الرمز'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === 'login'
            ? language === 'en'
              ? 'Welcome Back'
              : 'مرحباً بعودتك'
            : language === 'en'
            ? 'Create Account'
            : 'إنشاء حساب جديد'}
        </h2>

        {registrationSuccess ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600">
              {language === 'en'
                ? 'Registration successful! Please log in with your credentials.'
                : 'تم التسجيل بنجاح! الرجاء تسجيل الدخول باستخدام بيانات حسابك.'}
            </div>
            <button
              onClick={() => onClose()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {language === 'en' ? 'Close' : 'إغلاق'}
            </button>
          </div>
        ) : (
          <>
            {(error || localError) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error || localError}
              </div>
            )}

            {mode === 'login' && (
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {language === 'en' ? 'Sign in with' : 'تسجيل الدخول باستخدام'}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    authMethod === 'email'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language === 'en' ? 'Email' : 'البريد'}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    authMethod === 'phone'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language === 'en' ? 'Phone' : 'الهاتف'}
                </button>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={language === 'en' ? 'Enter your name' : 'أدخل اسمك'}
                      required
                    />
                  </div>
                </div>
              )}

              {authMethod === 'email' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                  </label>
                  <PhoneInput
                    country={'ye'}
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    inputClass="w-full pl-[52px] pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    containerClass="phone-input"
                    buttonClass="phone-input-button"
                    dropdownClass="phone-input-dropdown"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Password' : 'كلمة المرور'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={language === 'en' ? 'Enter your password' : 'أدخل كلمة المرور'}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <span className="animate-spin">⌛</span>}
                {mode === 'login' ? (
                  <>
                    <Mail className="w-4 h-4" />
                    {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    {language === 'en' ? 'Create Account' : 'إنشاء حساب'}
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}