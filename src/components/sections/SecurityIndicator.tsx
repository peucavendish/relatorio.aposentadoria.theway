import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import StatusChip from '@/components/ui/StatusChip';
import { ShieldCheck, CheckCircle } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import HideableCard from '@/components/ui/HideableCard';
import { useCardVisibility } from '@/context/CardVisibilityContext';


interface PilarNota {
	name?: string;
	nome?: string;
	nota?: number;
}

interface ScoreFinanceiro {
	pilar?: string;
	notaPonderada?: number;
	elementosAvaliados?: Array<string | PilarNota>;
}


interface SecurityIndicatorProps {
	scoreFinanceiro?: ScoreFinanceiro;
	hideControls?: boolean;
}

const SecurityIndicator: React.FC<SecurityIndicatorProps> = ({ scoreFinanceiro, hideControls }) => {
	const securityIndexRef = useScrollAnimation();
	const { isCardVisible, toggleCardVisibility } = useCardVisibility();

	const pilar = scoreFinanceiro?.pilar ?? 'Total Geral';
	const notaPonderada = scoreFinanceiro?.notaPonderada ?? 0;
	const elementosAvaliadosRaw = scoreFinanceiro?.elementosAvaliados ?? [
		'Reserva de emergência',
		'Diversificação de ativos',
		'Proteção patrimonial',
		'Fluxo de caixa mensal',
		'Endividamento'
	];
	const elementosAvaliados = elementosAvaliadosRaw.map((item) => {
		if (typeof item === 'string') return { nome: item } as PilarNota;
		return item as PilarNota;
	});

	return (
		<section id="security-indicator">
			<div className="section-container">
				<div ref={securityIndexRef as React.RefObject<HTMLDivElement>} className="mb-6 animate-on-scroll">
					<HideableCard
						id="indicador-seguranca"
						isVisible={isCardVisible('indicador-seguranca')}
						onToggleVisibility={() => toggleCardVisibility('indicador-seguranca')}
						hideControls={hideControls}
					>
						<CardHeader className="pb-2">
							<CardTitle className="card-title-standard text-lg">
								{/* <ShieldCheck className="text-accent h-5 w-5" /> */}
								Indicador de Segurança Financeira
							</CardTitle>
							<CardDescription>
								Pilar: <span className="font-semibold">{pilar}</span>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid md:grid-cols-2 gap-6 items-center">
								<div className="flex items-center justify-center">
									<div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center rounded-full border-8" style={{ borderColor: '#36557C20' }}>
										<div
											className="absolute inset-0 rounded-full border-8"
											style={{ 
												borderColor: '#36557C',
												clipPath: `inset(0 ${100 - (notaPonderada ?? 0)}% 0 0)` 
											}}
										/>
										<div className="text-center">
											<div className="text-3xl font-bold md:text-4xl">{notaPonderada}</div>
										</div>
									</div>
								</div>
								<div>
									<h4 className="text-base font-medium mb-3 md:text-lg">Elementos avaliados:</h4>
									<ul className="space-y-2">
										{elementosAvaliados.map((elemento, index) => {
											const displayName = elemento.nome || elemento.name || '';
											return (
												<li key={`${displayName}-${index}`} className="flex items-start gap-2">
													<CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: '#36557C' }} />
													<span className="text-sm md:text-base">{displayName}{elemento.nota != null ? ` — ${elemento.nota}` : ''}</span>
												</li>
											);
										})}
									</ul>
								</div>
							</div>
						</CardContent>
					</HideableCard>
				</div>
			</div>
		</section>
	);
};

export default SecurityIndicator; 