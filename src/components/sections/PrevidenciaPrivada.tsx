import React from 'react';
import { PiggyBank, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import HideableCard from '@/components/ui/HideableCard';
import { formatCurrency } from '@/utils/formatCurrency';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCardVisibility } from '@/context/CardVisibilityContext';

interface PrevidenciaPrivadaData {
  previdencia_privada: Array<{
    tipo: string;
    saldo_atual: number;
    contribuicao_mensal: number;
  }>;
}

interface PrevidenciaPrivadaProps {
  data: PrevidenciaPrivadaData;
  hideControls?: boolean;
}

const PrevidenciaPrivada: React.FC<PrevidenciaPrivadaProps> = ({ data, hideControls }) => {
  const headerRef = useScrollAnimation();
  const { isCardVisible, toggleCardVisibility } = useCardVisibility();

  const totalSaldo = data?.previdencia_privada?.reduce((sum, prev) => sum + prev.saldo_atual, 0) || 0;
  const totalContribuicao = data?.previdencia_privada?.reduce((sum, prev) => sum + prev.contribuicao_mensal, 0) || 0;

  return (
    <section className="min-h-screen py-16 px-4" id="previdencia-privada">
      <div className="section-container">
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="mb-12 text-center animate-on-scroll"
        >
          <div className="inline-block">
            <div className="card-flex-center mb-4">
              <div className="bg-accent/10 p-3 rounded-full">
                <PiggyBank size={28} className="text-accent" />
              </div>
            </div>
            <h2 className="heading-2 mb-3">Previdência Privada</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Análise dos seus investimentos em previdência privada e estratégias de contribuição.
            </p>
          </div>
        </div>

        {/* Resumo Geral */}
        <div className="mb-8 animate-on-scroll delay-1">
          <HideableCard
            id="resumo-previdencia"
            isVisible={isCardVisible("resumo-previdencia")}
            onToggleVisibility={() => toggleCardVisibility("resumo-previdencia")}
            hideControls={hideControls}
          >
            <CardHeader>
              <CardTitle className="card-title-standard text-lg">Resumo Geral</CardTitle>
              <CardDescription>
                Visão consolidada dos seus investimentos em previdência privada
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data?.previdencia_privada && data.previdencia_privada.length > 0 ? (
                <div className="card-grid-3">
                  <div className="card-metric">
                    <h3 className="card-metric-label">Saldo Total</h3>
                    <div className="card-metric-value">
                      {formatCurrency(totalSaldo)}
                    </div>
                  </div>
                  <div className="card-metric">
                    <h3 className="card-metric-label">Contribuição Mensal Total</h3>
                    <div className="card-metric-value">
                      {formatCurrency(totalContribuicao)}
                    </div>
                  </div>
                  <div className="card-metric">
                    <h3 className="card-metric-label">Planos Ativos</h3>
                    <div className="card-metric-value">
                      {data?.previdencia_privada?.length || 0}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <PiggyBank size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum plano de previdência privada encontrado</h3>
                  <p className="text-muted-foreground">
                    Não foram encontrados dados de previdência privada para exibir.
                  </p>
                </div>
              )}
            </CardContent>
          </HideableCard>
        </div>

        {/* Detalhamento por Plano */}
        {data?.previdencia_privada && data.previdencia_privada.length > 0 && (
          <div className="mb-8 animate-on-scroll delay-2">
            <HideableCard
              id="detalhamento-planos"
              isVisible={isCardVisible("detalhamento-planos")}
              onToggleVisibility={() => toggleCardVisibility("detalhamento-planos")}
              hideControls={hideControls}
            >
              <CardHeader>
                <CardTitle className="card-title-standard text-lg">Detalhamento por Plano</CardTitle>
                <CardDescription>
                  Informações detalhadas de cada plano de previdência privada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.previdencia_privada.map((plano, index) => (
                    <div key={index} className="p-4 border border-border/70 rounded-lg bg-muted/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="bg-accent/10 p-2 rounded-full mr-3">
                              <TrendingUp size={16} className="text-accent" />
                            </div>
                            <h4 className="font-semibold text-lg">{plano.tipo}</h4>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 mt-3">
                            <div className="flex items-center">
                              <DollarSign size={16} className="text-muted-foreground mr-2" />
                              <span className="text-sm text-muted-foreground">Saldo Atual:</span>
                              <span className="ml-2 font-semibold">{formatCurrency(plano.saldo_atual)}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar size={16} className="text-muted-foreground mr-2" />
                              <span className="text-sm text-muted-foreground">Contribuição Mensal:</span>
                              <span className="ml-2 font-semibold">{formatCurrency(plano.contribuicao_mensal)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </HideableCard>
          </div>
        )}

        {/* Análise e Recomendações */}
        <div className="mb-8 animate-on-scroll delay-3">
          <HideableCard
            id="analise-previdencia"
            isVisible={isCardVisible("analise-previdencia")}
            onToggleVisibility={() => toggleCardVisibility("analise-previdencia")}
            hideControls={hideControls}
          >
            <CardHeader>
              <CardTitle className="card-title-standard text-lg">Análise e Recomendações</CardTitle>
              <CardDescription>
                Insights sobre sua estratégia de previdência privada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <h4 className="font-semibold text-sm mb-2 text-blue-800 dark:text-blue-200">
                    Diversificação de Planos
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Você possui {data?.previdencia_privada?.length || 0} plano(s) de previdência privada, 
                    o que contribui para a diversificação da sua estratégia de aposentadoria.
                  </p>
                </div>
                
                {totalContribuicao > 0 && (
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <h4 className="font-semibold text-sm mb-2 text-green-800 dark:text-green-200">
                      Contribuições Regulares
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Suas contribuições mensais de {formatCurrency(totalContribuicao)} demonstram 
                      disciplina na construção do patrimônio para aposentadoria.
                    </p>
                  </div>
                )}

                {totalSaldo > 0 && (
                  <div className="p-4 border border-purple-200 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <h4 className="font-semibold text-sm mb-2 text-purple-800 dark:text-purple-200">
                      Patrimônio Acumulado
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Seu saldo total de {formatCurrency(totalSaldo)} em previdência privada 
                      representa uma base sólida para sua aposentadoria.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </HideableCard>
        </div>
      </div>
    </section>
  );
};

export default PrevidenciaPrivada;
