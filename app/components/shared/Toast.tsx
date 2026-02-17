"use client";

import React, { useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 min-w-[300px] border border-green-200">
        <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
        <p className="text-gray-800 flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
          aria-label="Close notification"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
