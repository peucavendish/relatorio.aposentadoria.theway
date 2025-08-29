import React from 'react';
import { cn } from '@/lib/utils';
import { useSectionObserver } from '@/hooks/useSectionObserver';

// Definição das seções usando os mesmos IDs e ícones do componente original
const sections = [
  { id: 'cover', label: 'Capa' },
  { id: 'summary', label: 'Resumo Financeiro' },
  { id: 'total-asset-allocation', label: 'Gestão de Ativos' },
  { id: 'retirement', label: 'Aposentadoria' },
  { id: 'beach-house', label: 'Imóvel' },
  { id: 'protection', label: 'Proteção Patrimonial' },
  { id: 'succession', label: 'Planejamento Sucessório' },
  { id: 'tax', label: 'Planejamento Tributário' },
  { id: 'action-plan', label: 'Plano de Ação' }
];

export function DotNavigation() {
  const { activeSection, navigateToSection } = useSectionObserver();
  const activeIndex = sections.findIndex(section => section.id === activeSection);

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
      <div className="flex flex-col items-center space-y-3">
        {sections.map((section, index) => {
          const isActive = section.id === activeSection;
          return (
            <button
              key={section.id}
              onClick={() => navigateToSection(section.id)}
              className="outline-none focus:ring-0"
              aria-label={`Ir para ${index + 1}. ${section.label}`}
              title={`${index + 1}. ${section.label}`}
            >
              <div
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all duration-300',
                  isActive ? 'bg-accent scale-125' : 'bg-muted hover:bg-accent/30'
                )}
              />
            </button>
          );
        })}

        {/* Indicador textual opcional do índice ativo */}
        <div className="mt-2 text-xs text-muted-foreground select-none">{activeIndex + 1}/{sections.length}</div>
      </div>
    </div>
  );
}

export function MobileDotNavigation() {
  const { activeSection, navigateToSection } = useSectionObserver();

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center md:hidden">
      <div className="flex space-x-4 px-4 py-3 bg-card/80 backdrop-blur-md rounded-full border border-border shadow-lg">
        {sections.map((section, index) => {
          const isActive = section.id === activeSection;
          
          return (
            <button
              key={section.id}
              onClick={() => navigateToSection(section.id)}
              className="outline-none focus:ring-0"
              aria-label={`Ir para ${index + 1}. ${section.label}`}
              title={`${index + 1}. ${section.label}`}
            >
              <div 
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all duration-300',
                  isActive 
                    ? 'bg-accent scale-125' 
                    : 'bg-muted hover:bg-accent/30'
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
} 