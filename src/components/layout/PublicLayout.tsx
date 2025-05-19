
import React, { FC, ReactNode } from "react";
import { PublicNavbar } from "./PublicNavbar";
import { PublicFooter } from "./PublicFooter";

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout: FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <PublicNavbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
};
