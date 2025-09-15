import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function FormField({ label, error, required = false, children, icon }: FormFieldProps) {
  return (
    <div>
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}