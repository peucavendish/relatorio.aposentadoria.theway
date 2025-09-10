import { useSectionVisibility } from '../context/SectionVisibilityContext';

/**
 * Hook para calcular a numeração dinâmica das seções baseada na visibilidade
 * @param sectionId - ID da seção atual
 * @returns Número da seção (1, 2, 3, etc.) ou null se a seção estiver oculta
 */
export const useSectionNumbering = (sectionId: string): number | null => {
  const { getVisibleSections } = useSectionVisibility();
  
  const visibleSections = getVisibleSections();
  const sectionIndex = visibleSections.indexOf(sectionId);
  
  // Se a seção não estiver visível, retorna null
  if (sectionIndex === -1) {
    return null;
  }
  
  // Retorna o número da seção (baseado em 1)
  return sectionIndex + 1;
};

export default useSectionNumbering;
