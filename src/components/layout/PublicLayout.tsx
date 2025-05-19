
import React, { FC, ReactNode } from "react";
import { PublicNavbar } from "./PublicNavbar";
import { PublicFooter } from "./PublicFooter";

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout: FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
};
