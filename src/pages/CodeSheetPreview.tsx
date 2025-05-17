
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";

interface CodeSheetPreviewProps {
  onLogout: () => Promise<void>;
}

const CodeSheetPreview = ({ onLogout }: CodeSheetPreviewProps) => {
  return (
    <AppLayout onLogout={async () => await onLogout()}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Code Sheet Preview</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p>Code sheet preview content will be displayed here.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default CodeSheetPreview;
