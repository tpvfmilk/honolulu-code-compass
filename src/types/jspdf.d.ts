
import 'jspdf';
import { TableProps } from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: TableProps) => jsPDF;
    internal: {
      events: any;
      scaleFactor: number;
      pageSize: { 
        width: number; 
        height: number;
        getWidth: () => number; 
        getHeight: () => number; 
      };
      pages: number[];
      getEncryptor: (objectId: number) => (data: string) => string;
      getNumberOfPages: () => number;
    };
  }
}
