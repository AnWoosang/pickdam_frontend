"use client";

import React from "react";
import { Logo } from "@/components/common/Logo";

interface CenteredLayoutProps {
  children: React.ReactNode;
  showLogo?: boolean;
  logoSize?: "small" | "medium" | "big";
  maxWidth?: "small" | "medium" | "large" | "wide";
  className?: string;
}

const maxWidthClasses = {
  small: "max-w-sm",
  medium: "max-w-md", 
  large: "max-w-lg",
  wide: "max-w-xl",
};

export const CenteredLayout: React.FC<CenteredLayoutProps> = ({
  children,
  showLogo = true,
  logoSize = "big",
  maxWidth = "medium",
  className = "",
}) => {

  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <div className="min-h-screen overflow-y-auto bg-white">
        <div className="flex flex-col items-center px-4 pt-24 pb-16 bg-white">
          <div className={`w-full ${maxWidthClasses[maxWidth]}`}>
            {showLogo && (
              <div className="text-center mb-16">
                <Logo size={logoSize} />
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};