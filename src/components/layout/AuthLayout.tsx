
import React, { FC, ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left column with image */}
      <div className="hidden md:flex md:w-1/2 bg-primary relative">
        <img 
          src="/lovable-uploads/a1031bb9-adfa-4926-911f-56a05cfc92b4.jpg" 
          alt="Building design" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-6 left-6">
          <Link to="/" className="text-white font-bold text-xl flex items-center">
            <span className="mr-2">Comply</span>
          </Link>
        </div>
      </div>
      
      {/* Right column with form */}
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="flex justify-between items-center p-6 md:hidden">
          <Link to="/" className="text-primary font-bold text-xl">
            Comply
          </Link>
        </div>
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto px-6 w-full">
          {children}
        </div>
      </div>
    </div>
  );
};
