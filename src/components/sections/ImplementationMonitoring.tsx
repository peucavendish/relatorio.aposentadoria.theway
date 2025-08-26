import React from 'react';
import { TrendingUp, Activity, PiggyBank, Target, Percent, Camera, Trash2, Download } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatCurrency';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ImplementationMonitoringProps {
  data: any;
  hideControls?: boolean;
}

function toPercentage(value: number) {
  if (!isFinite(value)) return '—';
  return `${(value * 100).toFixed(1)}%`;
}

function pow1p(baseRate: number, periods: number) {
  return Math.pow(1 + baseRate, periods);
}

interface SnapshotMetrics {
  cdiAnnual: number;
  ipcaAnnual: number;
  cdiQuarter: number;
  ipcaQuarter: number;
  expectedQuarterContribution: number;
  realizedQuarterContribution: number;
  aporteCompliance: number;
  expectedQuarterPatrimony: number;
  realPatrimony: number;
  patrimonioCompliance: number;
}

interface SnapshotEntry {
  id: number;
  dateIso: string;
  dataUrl?: string;
  metrics: SnapshotMetrics;
}

const SNAPSHOTS_KEY = 'implementationMonitoring.snapshots';

function getQuarterLabel(dateIso: string) {
  const d = new Date(dateIso);
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `T${q}/${d.getFullYear()}`;
}

const ImplementationMonitoring: React.FC<ImplementationMonitoringProps> = ({ data, hideControls }) => {
  const titleRef = useScrollAnimation<HTMLDivElement>();
  const sectionRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const captureRef = React.useRef<HTMLDivElement>(null);

  if (!data) {
    return <section className="py-16 px-4" id="implementation-monitoring"><div className="section-container">Dados de monitoramento não disponíveis</div></section>;
  }

  const currentInvestments: number = Number(
    data?.financas?.composicaoPatrimonial?.Investimentos ??
      (Array.isArray(data?.financas?.ativos)
        ? data.financas.ativos
            .filter((a: any) => (a?.classe || a?.tipo || '').toLowerCase().includes('invest'))
            .reduce((sum: number, a: any) => sum + (Number(a?.valor) || 0), 0)
        : 0)
  ) || 0;

  const monthlySurplus: number = Number(data?.financas?.excedenteMensal) || 0;
  const recommendedMonthlyContribution: number = Number(data?.aposentadoria?.aporteMensalRecomendado) || 0;
  const expectedMonthlyContribution: number = recommendedMonthlyContribution || monthlySurplus || 0;
  const expectedQuarterContribution = expectedMonthlyContribution * 3;

  const realizedQuarterContribution: number = Number(
    data?.planoAcao?.acompanhamentoProgresso?.aportesRealizadosTrimestre
  ) || 0;

  // Parâmetros editáveis (padrões conforme solicitação)
  const [ipcaAnnual, setIpcaAnnual] = React.useState<number>(0.03); // 3%
  const [cdiAnnual, setCdiAnnual] = React.useState<number>(0.1375); // 13,75%

  // Captura/Histórico
  const [capturing, setCapturing] = React.useState<boolean>(false);
  const [captured, setCaptured] = React.useState<boolean>(false);
  const [snapshots, setSnapshots] = React.useState<SnapshotEntry[]>([]);
  const [hoverPreview, setHoverPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const savedCdi = localStorage.getItem('implementationMonitoring.cdiAnnual');
      const savedIpca = localStorage.getItem('implementationMonitoring.ipcaAnnual');
      if (savedCdi !== null) {
        const v = parseFloat(savedCdi);
        if (Number.isFinite(v)) setCdiAnnual(v);
      }
      if (savedIpca !== null) {
        const v = parseFloat(savedIpca);
        if (Number.isFinite(v)) setIpcaAnnual(v);
      }

      const savedSnaps = localStorage.getItem(SNAPSHOTS_KEY);
      if (savedSnaps) {
        const parsed = JSON.parse(savedSnaps);
        if (Array.isArray(parsed)) {
          const normalized: SnapshotEntry[] = parsed.map((s: any) => {
            if (s?.metrics) return s as SnapshotEntry;
            // Backwards compatibility: enrich older entries with current metrics as best-effort
            return {
              id: s?.id || Date.now(),
              dateIso: s?.dateIso || new Date().toISOString(),
              dataUrl: s?.dataUrl,
              metrics: {
                cdiAnnual,
                ipcaAnnual,
                cdiQuarter: pow1p(cdiAnnual, 3 / 12) - 1,
                ipcaQuarter: ipcaAnnual / 4,
                expectedQuarterContribution,
                realizedQuarterContribution,
                aporteCompliance: expectedQuarterContribution > 0 ? Math.min(1, realizedQuarterContribution / expectedQuarterContribution) : 0,
                expectedQuarterPatrimony: currentInvestments + (currentInvestments * (pow1p(cdiAnnual, 3 / 12) - 1)) + expectedQuarterContribution,
                realPatrimony: currentInvestments,
                patrimonioCompliance: (currentInvestments + (currentInvestments * (pow1p(cdiAnnual, 3 / 12) - 1)) + expectedQuarterContribution) > 0 ? Math.min(1, currentInvestments / (currentInvestments + (currentInvestments * (pow1p(cdiAnnual, 3 / 12) - 1)) + expectedQuarterContribution)) : 0
              }
            };
          });
          setSnapshots(normalized);
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = async () => {
    if (!captureRef.current) return;
    try {
      setCapturing(true);
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#ffffff',
        scale: Math.min(2, window.devicePixelRatio || 1),
        useCORS: true,
        foreignObjectRendering: true,
        logging: false
      });
      const dataUrl = canvas.toDataURL('image/png');
      const nowIso = new Date().toISOString();
      const cdiQ = pow1p(cdiAnnual, 3 / 12) - 1;
      const ipcaQ = ipcaAnnual / 4;
      const expectedReturn = currentInvestments * cdiQ;
      const expectedPat = currentInvestments + expectedReturn + expectedQuarterContribution;
      const aporteComp = expectedQuarterContribution > 0 ? Math.min(1, realizedQuarterContribution / expectedQuarterContribution) : 0;
      const patrComp = expectedPat > 0 ? Math.min(1, currentInvestments / expectedPat) : 0;
      const entry: SnapshotEntry = {
        id: Date.now(),
        dateIso: nowIso,
        dataUrl,
        metrics: {
          cdiAnnual,
          ipcaAnnual,
          cdiQuarter: cdiQ,
          ipcaQuarter: ipcaQ,
          expectedQuarterContribution,
          realizedQuarterContribution,
          aporteCompliance: aporteComp,
          expectedQuarterPatrimony: expectedPat,
          realPatrimony: currentInvestments,
          patrimonioCompliance: patrComp
        }
      };
      setSnapshots(prev => {
        const updated = [entry, ...prev];
        try { localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(updated)); } catch {}
        return updated;
      });
      setCaptured(true);
      setTimeout(() => setCaptured(false), 1800);
    } catch (e) {
      // noop
    } finally {
      setCapturing(false);
    }
  };

  const handleDeleteSnapshot = (id: number) => {
    setSnapshots(prev => {
      const updated = prev.filter(s => s.id !== id);
      try { localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // Derivados
  const cdiQuarter = pow1p(cdiAnnual, 3 / 12) - 1;
  const ipcaQuarter = ipcaAnnual / 4;

  const expectedQuarterReturn = currentInvestments * cdiQuarter;
  const expectedQuarterPatrimony = currentInvestments + expectedQuarterReturn + expectedQuarterContribution;

  // Real atual reportado
  const realPatrimony = currentInvestments;

  const aporteCompliance = expectedQuarterContribution > 0
    ? Math.min(1, realizedQuarterContribution / expectedQuarterContribution)
    : 0;

  const patrimonioCompliance = expectedQuarterPatrimony > 0
    ? Math.min(1, realPatrimony / expectedQuarterPatrimony)
    : 0;

  return (
    <section className="py-16 px-4" id="implementation-monitoring">
      <div className="section-container">
        <div ref={titleRef} className="mb-12 text-center animate-on-scroll">
          <div className="inline-block">
            <div className="card-flex-center mb-4">
              <div className="bg-accent/10 p-3 rounded-full">
                <Activity size={28} className="text-accent" />
              </div>
            </div>
            <h2 className="card-title-standard text-4xl">10. Implementação e Monitoramento</h2>
            <p className="card-description-standard max-w-2xl mx-auto">
              Acompanhamento de aportes e evolução do patrimônio de investimentos versus metas, com base em CDI (12m) e IPCA.
            </p>
          </div>
        </div>

        <div ref={sectionRef} className="section-container animate-on-scroll">
          <h3 className="text-xl font-semibold mb-3">Premissas e KPIs do trimestre</h3>
          <div ref={captureRef} className="relative overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><PiggyBank className="h-4 w-4" /> Aportes (Trimestre)</CardTitle>
                  <CardDescription>Objetivo vs Realizado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Esperado</span>
                    <span className="font-medium">{formatCurrency(Math.round(expectedQuarterContribution))}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Realizado</span>
                    <span className={cn("font-medium", realizedQuarterContribution >= expectedQuarterContribution ? "text-financial-success" : "text-foreground")}>{formatCurrency(Math.round(realizedQuarterContribution))}</span>
                  </div>
                  <Progress value={aporteCompliance * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-2">Cumprimento: <span className="font-medium text-foreground">{toPercentage(aporteCompliance)}</span></div>
                  <p className="text-xs text-muted-foreground mt-2">Base: aporte mensal esperado = recomendado ou excedente mensal; meta do trimestre = 3× esse valor.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> CDI e IPCA</CardTitle>
                  <CardDescription>Parâmetros de referência</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3 mb-3">
                    <div>
                      <Label htmlFor="cdiAnnual" className="mb-1 block">CDI (12 meses) %</Label>
                      <Input
                        id="cdiAnnual"
                        type="number"
                        step="0.01"
                        min="0"
                        value={Number.isFinite(cdiAnnual) ? (cdiAnnual * 100).toFixed(2) : ''}
                        readOnly
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="ipcaAnnual" className="mb-1 block">IPCA (12 meses) %</Label>
                      <Input
                        id="ipcaAnnual"
                        type="number"
                        step="0.01"
                        min="0"
                        value={Number.isFinite(ipcaAnnual) ? (ipcaAnnual * 100).toFixed(2) : ''}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3 mt-1">
                    <div className="text-sm text-muted-foreground">CDI (trimestre ≈)</div>
                    <Badge variant="outline" className="text-foreground">{toPercentage(cdiQuarter)}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Usado para estimar a rentabilidade (100% do CDI). IPCA apenas como referência de inflação.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4" /> Patrimônio de Investimentos</CardTitle>
                  <CardDescription>Esperado (Trimestre) vs Real</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Esperado</span>
                    <span className="font-medium">{formatCurrency(Math.round(expectedQuarterPatrimony))}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Real</span>
                    <span className={cn("font-medium", realPatrimony >= expectedQuarterPatrimony ? "text-financial-success" : "text-foreground")}>{formatCurrency(Math.round(realPatrimony))}</span>
                  </div>
                  <Progress value={patrimonioCompliance * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-2">Aderência: <span className="font-medium text-foreground">{toPercentage(patrimonioCompliance)}</span></div>
                  <p className="text-xs text-muted-foreground mt-2">Esperado = patrimônio atual + rentabilidade do trimestre + aportes esperados. Real = patrimônio reportado em Investimentos.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><Percent className="h-4 w-4" /> Rentabilidade Esperada</CardTitle>
                  <CardDescription>Base: 100% do CDI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sobre o patrimônio atual</span>
                    <span className="font-medium">{formatCurrency(Math.round(expectedQuarterReturn))}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Equivale a {toPercentage(cdiQuarter)} no trimestre. IPCA trimestral de referência: {toPercentage(ipcaQuarter)}.</div>
                  <div className="text-xs text-muted-foreground mt-1">Considera 100% do CDI sobre o patrimônio atual; não inclui resgates ou eventos extraordinários.</div>
                </CardContent>
              </Card>
            </div>
            <Card className="mb-2">
              <CardContent className="py-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={handleCapture} disabled={!!hideControls || capturing}>
                    <Camera className="h-4 w-4 mr-1" /> {capturing ? 'Registrando…' : 'Acionar planejamento'}
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    {captured ? 'Foto registrada. Uma nova coluna foi adicionada ao quadro.' : 'Registra a situação atual e adiciona uma coluna ao quadro de revisões.'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {snapshots.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Quadro de Revisões (trimestral)</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-sm">
                  <thead>
                    <tr>
                      <th className="text-left sticky left-0 bg-background z-10 w-64">Métrica</th>
                      {snapshots.map(s => (
                        <th key={s.id} className="text-left whitespace-nowrap pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{getQuarterLabel(s.dateIso)}</span>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteSnapshot(s.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">{new Date(s.dateIso).toLocaleDateString()}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="sticky left-0 bg-background z-10 font-medium">CDI (12m)</td>
                      {snapshots.map(s => <td key={s.id + '-cdi12'}>{toPercentage((s.metrics?.cdiAnnual) ?? cdiAnnual)}</td>)}
                    </tr>
                    <tr>
                      <td className="sticky left-0 bg-background z-10 font-medium">IPCA (12m)</td>
                      {snapshots.map(s => <td key={s.id + '-ipca12'}>{toPercentage((s.metrics?.ipcaAnnual) ?? ipcaAnnual)}</td>)}
                    </tr>
                    <tr>
                      <td className="sticky left-0 bg-background z-10 font-medium">CDI (trim)</td>
                      {snapshots.map(s => <td key={s.id + '-cditrim'}>{toPercentage((s.metrics?.cdiQuarter) ?? (pow1p(cdiAnnual, 3/12) - 1))}</td>)}
                    </tr>
                    <tr>
                      <td className="sticky left-0 bg-background z-10 font-medium">Aportes esperados</td>
                      {snapshots.map(s => <td key={s.id + '-aportexp'}>{formatCurrency(Math.round((s.metrics?.expectedQuarterContribution) ?? expectedQuarterContribution))}</td>)}
                    </tr>
                    <tr>
                      <td className="sticky left-0 bg-background z-10 font-medium">Aportes realizados</td>
                      {snapshots.map(s => <td key={s.id + '-aportr'}>{formatCurrency(Math.round((s.metrics?.realizedQuarterContribution) ?? realizedQuarterContribution))}</td>)}
                    </tr>
                    <tr>
                      <td className="sticky left-0 bg-background z-10 font-medium">Cumprimento (aportes)</td>
                      {snapshots.map(s => <td key={s.id + '-aportc'}>{toPercentage((s.metrics?.aporteCompliance) ?? aporteCompliance)}</td>)}
                    </tr>
                    <tr>
                      <td className="sticky left-0 bg-background z-10 font-medium">Patrimônio esperado</td>
                      {snapshots.map(s => <td key={s.id + '-patesp'}>{formatCurrency(Math.round((s.metrics?.expectedQuarterPatrimony) ?? expectedQuarterPatrimony))}</td>)}
                    </tr>
                    <tr>
                      <td className="sticky left-0 bg-background z-10 font-medium">Patrimônio real</td>
                      {snapshots.map(s => <td key={s.id + '-patreal'}>{formatCurrency(Math.round((s.metrics?.realPatrimony) ?? realPatrimony))}</td>)}
                    </tr>
                    <tr>
                      <td className="sticky left-0 bg-background z-10 font-medium">Aderência (patrimônio)</td>
                      {snapshots.map(s => <td key={s.id + '-patc'}>{toPercentage((s.metrics?.patrimonioCompliance) ?? patrimonioCompliance)}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {false && snapshots.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Histórico de Situações</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {snapshots.map((s) => (
                  <Card key={s.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{new Date(s.dateIso).toLocaleString()}</CardTitle>
                      <CardDescription>Registro visual do acompanhamento</CardDescription>
                    </CardHeader>
                    <CardContent onMouseEnter={() => setHoverPreview(s.dataUrl!)} onMouseLeave={() => setHoverPreview(null)}>
                      <div className="text-xs text-muted-foreground">Passe o mouse para visualizar</div>
                      <div className="flex justify-end gap-2 mt-3">
                        <a href={s.dataUrl} download={`situacao-${s.id}.png`} className="inline-flex">
                          <Button size="sm" variant="secondary"><Download className="h-4 w-4 mr-1" /> Baixar</Button>
                        </a>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteSnapshot(s.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {false && hoverPreview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="bg-background/95 border rounded-md shadow-2xl p-2">
                <img src={hoverPreview} alt="Pré-visualização" className="w-[900px] max-w-[95vw] h-auto rounded-md" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImplementationMonitoring; 