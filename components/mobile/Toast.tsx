'use client';

import toast, { Toaster } from 'react-hot-toast';

export { toast };

const toastStyles = {
  success: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 10px 40px rgba(16,185,129,0.3)',
  },
  error: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 10px 40px rgba(239,68,68,0.3)',
  },
  loading: {
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 10px 40px rgba(99,102,241,0.3)',
  },
};

export function showSuccess(message) {
  toast.success(message, {
    style: toastStyles.success,
    iconTheme: { primary: '#fff', secondary: 'transparent' },
    duration: 3000,
    position: 'top-center',
  });
}

export function showError(message) {
  toast.error(message, {
    style: toastStyles.error,
    iconTheme: { primary: '#fff', secondary: 'transparent' },
    duration: 4000,
    position: 'top-center',
  });
}

export function showLoading(message = 'Loading...') {
  return toast.loading(message, {
    style: toastStyles.loading,
    position: 'top-center',
  });
}

export function dismissToast(id) {
  toast.dismiss(id);
}

export function AppToaster() {
  return <Toaster containerStyle={{ top: 60 }} />;
}
