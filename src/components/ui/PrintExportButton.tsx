import React from 'react';
import { FileDown } from 'lucide-react';

interface PrintExportButtonProps {
  label?: string;
}

const PrintExportButton: React.FC<PrintExportButtonProps> = ({ label = 'Exportar PDF' }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="no-print fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-md border border-border/60 bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-background/90"
      aria-label="Exportar PDF"
      title="Exportar PDF"
    >
      <FileDown size={16} className="text-muted-foreground" />
      {label}
    </button>
  );
};

export default PrintExportButton; 