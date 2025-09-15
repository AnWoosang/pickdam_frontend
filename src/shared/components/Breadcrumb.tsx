"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export function Breadcrumb({ items, className = "", onItemClick }: BreadcrumbProps) {
  const router = useRouter();
  
  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    if (onItemClick) {
      onItemClick(item, index);
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-hintText" />
          )}
          
          {item.href ? (
            <button
              onClick={() => handleItemClick(item, index)}
              className={`transition-colors cursor-pointer ${
                item.isActive 
                  ? 'text-textHeading font-medium hover:text-primary' 
                  : 'text-textDefault hover:text-textHeading'
              }`}
            >
              {item.label}
            </button>
          ) : (
            <span className={`${
              item.isActive ? 'text-textHeading font-medium' : 'text-hintText'
            }`}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}