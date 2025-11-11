import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { CardVisibilityProvider } from '@/context/CardVisibilityContext';
import { SectionVisibilityProvider } from '@/context/SectionVisibilityContext';
import Header from '@/components/layout/Header';
import CoverPage from '@/components/sections/CoverPage';
import FinancialSummary from '@/components/sections/FinancialSummary';
import RetirementPlanning from '@/components/sections/RetirementPlanning';
import TotalAssetAllocation from '@/components/sections/TotalAssetAllocation';
import FloatingActions from '@/components/layout/FloatingActions';
import { DotNavigation, MobileDotNavigation } from '@/components/layout/DotNavigation';
import { useSectionObserver } from '@/hooks/useSectionObserver';
import { Loader2 } from 'lucide-react';
import PrintExportButton from '@/components/ui/PrintExportButton';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { formatCurrency } from '@/utils/formatCurrency';
import { useSectionVisibility } from '@/context/SectionVisibilityContext';
import HideableSection from '@/components/ui/HideableSection';
import { getMockUserReports } from '@/testData';

interface IndexPageProps {
  accessor?: boolean;
  clientPropect?: boolean;
}

const IndexPage: React.FC<IndexPageProps> = ({ accessor, clientPropect }) => {
  const { activeSection, navigateToSection } = useSectionObserver();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userReports, setUserReports] = useState(null);
  const [sessionId, setSessionId] = useState<string | null>(null);


  const getClientData = () => ({
    cliente: {
      nome: userReports?.cliente?.nome || "",
      idade: userReports?.cliente?.idade || 0,
      estadoCivil: userReports?.cliente?.estadoCivil || "",
      regimeCasamento: userReports?.cliente?.regimeCasamento || "",
      residencia: userReports?.cliente?.residencia || "",
      xpCode: userReports?.cliente?.codigo_xp || "",
      email: userReports?.cliente?.email || user?.email || "",
      isProspect: clientPropect || false
    },
    financas: {
      patrimonioLiquido: userReports?.financas?.resumo?.patrimonio_liquido || 0,
      excedenteMensal: userReports?.financas?.resumo?.excedente_mensal || 0,
      rendas: userReports?.financas?.rendas || [],
      despesasMensais: userReports?.financas?.resumo?.despesas_mensais || 0,
      indicadores: userReports?.financas?.indicadores || {},
      despesas: userReports?.financas?.despesas || [],
      composicaoPatrimonial: userReports?.financas?.composicao_patrimonial || {},
      ativos: userReports?.ativos?.map(a => ({
        tipo: a.tipo,
        valor: a.valor,
        classe: a.classe
      })) || [],
      passivos: userReports?.passivos || []
    },
    aposentadoria: {
      patrimonioLiquido: userReports?.financas?.resumo?.patrimonio_liquido || 0,
      excedenteMensal: userReports?.financas?.resumo?.excedente_mensal || 0,
      rendas: userReports?.financas?.rendas || [],
      totalInvestido: userReports?.composicao_patrimonial?.Investimentos || 0,
      ativos: userReports?.ativos?.map((a: any) => ({
        tipo: a?.tipo,
        valor: a?.valor,
        classe: a?.classe
      })) || [],
      passivos: userReports?.passivos || [],

      rendaMensalDesejada: userReports?.planoAposentadoria?.renda_desejada || 0,
      idadeAposentadoria: userReports?.planoAposentadoria?.idade_aposentadoria || 0,
      patrimonioAlvo: userReports?.planoAposentadoria?.capital_necessario || 0,

      idadeAtual: userReports?.planoAposentadoria?.idade_atual || 0,
      expectativaVida: userReports?.planoAposentadoria?.expectativa_vida || 0,

      cenarios: userReports?.planoAposentadoria?.cenarios || [],
      estrategias: userReports?.planoAposentadoria?.estrategias || [],
      riscosIdentificados: userReports?.planoAposentadoria?.riscosIdentificados || [],
      recomendacoes: userReports?.planoAposentadoria?.recomendacoes || [],

      anosRestantes: (userReports?.planoAposentadoria?.idade_aposentadoria || 0) -
        (userReports?.planoAposentadoria?.idade_atual || 0),

      taxaRetiradaSegura: 0.04,
      taxaInflacao: 0.03,
      taxaJurosReal: 0.03,

      objetivos: userReports?.objetivos || []
    },
    objetivos: userReports?.objetivos || [],
    previdencia_privada: userReports?.previdencia_privada || []
  });

  const lifeProjectsSummary = () => {
    const raw = getClientData().objetivos || [];
    return (Array.isArray(raw) ? raw : []).map((item: any) => {
      if (typeof item === 'string') return { titulo: item };
      return {
        titulo: item?.tipo || 'Objetivo',
        descricao: `${(item?.valor != null && Number(item.valor) > 0) ? `${formatCurrency(Number(item.valor))} | ` : ''}${item?.prazo || ''}${item?.prioridade ? ` | Prioridade ${item.prioridade}` : ''}`
      };
    });
  };


  useEffect(() => {
    const fetchUserReportsData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionIdFromUrl = urlParams.get('sessionId');

        if (sessionIdFromUrl) {
          setSessionId(sessionIdFromUrl);
          const apiUrl = import.meta.env.VITE_API_THE_WAY;
          const response = await axios.get(`${apiUrl}/retirement-reports/${sessionIdFromUrl}`);

          const reportData = JSON.parse(response.data[0].report_data);
          const normalizeReport = (raw: any) => {
            const base = Array.isArray(raw) ? raw[0] : raw;
            const output = base?.output ?? base;
            return output ?? {};
          };
          setUserReports(normalizeReport(reportData));
        } else {
          // Usar dados mockados quando não há sessionId
          console.log('Usando dados mockados para desenvolvimento');
          setUserReports(getMockUserReports());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback para dados mockados em caso de erro
        console.log('Erro na API, usando dados mockados');
        setUserReports(getMockUserReports());
      }
    };
    fetchUserReportsData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [userReports]);

  // Componente interno que aplica a regra de auto-ocultar dentro do provider
  const AutoHideSections: React.FC<{ userReports: any }> = ({ userReports }) => {
    const { isSectionVisible, toggleSectionVisibility, isLoading: visibilityLoading } = useSectionVisibility();
    const [applied, setApplied] = React.useState(false);

    useEffect(() => {
      if (visibilityLoading || applied || !userReports) return;

      try {
        const shouldHide: Record<string, boolean> = {
          // Removido: 'beach-house': !(userReports?.imovelDesejado?.objetivo?.valorImovel),
          // A seção beach-house agora é controlada apenas pelo usuário, não automaticamente
          'succession': !(
            (userReports?.sucessao?.situacaoAtual?.objetivosSucessorios?.length ?? 0) > 0 ||
            (userReports?.sucessao?.instrumentos?.length ?? 0) > 0
          )
        };

        Object.entries(shouldHide).forEach(([sectionId, hide]) => {
          if (hide && isSectionVisible(sectionId)) {
            toggleSectionVisibility(sectionId);
          }
        });

        setApplied(true);
      } catch (e) {
        setApplied(true);
      }
    }, [visibilityLoading, applied, userReports, isSectionVisible, toggleSectionVisibility]);

    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <CardVisibilityProvider>
        <SectionVisibilityProvider>
          <AutoHideSections userReports={userReports} />
          <div className="relative h-screen overflow-hidden">
            <Header showLogout={!!clientPropect} />
            <main className="h-[calc(100vh-64px)] overflow-y-auto">
              <div className="min-h-screen">
                <CoverPage
                  clientData={getClientData().cliente}
                  date={(userReports?.created_at || userReports?.meta?.created_at) ? new Date(userReports?.created_at || userReports?.meta?.created_at).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : undefined}
                  projectsSummary={lifeProjectsSummary()}
                  retirementSummary={{
                    rendaMensalDesejada: getClientData().aposentadoria.rendaMensalDesejada,
                    idadeAposentadoria: getClientData().aposentadoria.idadeAposentadoria,
                  }}
                />
              </div>

              <HideableSection sectionId="summary">
                <FinancialSummary data={getClientData().financas} hideControls={clientPropect} />
              </HideableSection>

              <HideableSection sectionId="balanco-patrimonial">
                <TotalAssetAllocation data={userReports} hideControls={clientPropect} />
              </HideableSection>

              <HideableSection sectionId="retirement">
                <RetirementPlanning data={getClientData().aposentadoria} hideControls={clientPropect} />
              </HideableSection>


            </main>
            <DotNavigation clientMode={!!clientPropect} />
            <MobileDotNavigation clientMode={!!clientPropect} />
            {!clientPropect && <FloatingActions userReports={userReports} />}
            {!clientPropect && <PrintExportButton />}
          </div>
        </SectionVisibilityProvider>
      </CardVisibilityProvider>
    </ThemeProvider>
  );
};

export default IndexPage;
