import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import HideableCard from '@/components/ui/HideableCard';
import { useCardVisibility } from '@/context/CardVisibilityContext';
import { CalendarDays, CheckCircle2, Clock3, Target, User as UserIcon } from 'lucide-react';

interface LifeProjectsProps {
  data?: any;
  hideControls?: boolean;
}

interface NormalizedProject {
  titulo: string;
  descricao?: string;
  prazo?: string;
  responsavel?: string;
  status?: 'concluido' | 'em_andamento' | 'pendente' | string;
}

const LifeProjects: React.FC<LifeProjectsProps> = ({ data, hideControls }) => {
  const { isCardVisible, toggleCardVisibility } = useCardVisibility();

  const rawProjects: any[] = Array.isArray(data?.projetosDeVida)
    ? data.projetosDeVida
    : Array.isArray(data?.objetivos)
      ? data.objetivos
      : [];

  const projects: NormalizedProject[] = rawProjects.map((item: any) => {
    if (typeof item === 'string') {
      return { titulo: item };
    }

    return {
      titulo: item.titulo || item.nome || item.objetivo || 'Projeto',
      descricao: item.descricao || item.detalhes || item.observacao || undefined,
      prazo: item.prazo || item.periodo || item.horizonte || undefined,
      responsavel: item.responsavel || item.owner || undefined,
      status: item.status || item.situacao || undefined,
    } as NormalizedProject;
  });

  return (
    <section className="py-16 px-4" id="life-projects">
      <div className="section-container">
        <div className="mb-12 text-center">
          <div className="inline-block">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-accent/10 p-3 rounded-full">
                <Target size={28} className="text-accent" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-3">Projetos de Vida</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Metas pessoais e familiares que orientam o plano financeiro.
            </p>
          </div>
        </div>

        <HideableCard
          id="projetos-de-vida"
          isVisible={isCardVisible('projetos-de-vida')}
          onToggleVisibility={() => toggleCardVisibility('projetos-de-vida')}
          hideControls={hideControls}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} className="text-accent" />
              Projetos e Metas
            </CardTitle>
            <CardDescription>
              Lista consolidada dos projetos informados pelo cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Nenhum projeto de vida cadastrado até o momento.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((p, idx) => (
                  <Card key={idx} className="border-border/80">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">
                        {p.titulo}
                      </CardTitle>
                      {p.descricao && (
                        <CardDescription>{p.descricao}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0 text-sm">
                      <div className="flex flex-wrap gap-3 text-muted-foreground">
                        {p.prazo && (
                          <div className="flex items-center gap-1">
                            <CalendarDays size={14} className="text-accent" />
                            <span>{p.prazo}</span>
                          </div>
                        )}
                        {p.responsavel && (
                          <div className="flex items-center gap-1">
                            <UserIcon size={14} className="text-accent" />
                            <span>{p.responsavel}</span>
                          </div>
                        )}
                        {p.status && (
                          <div className="flex items-center gap-1">
                            {String(p.status).toLowerCase().includes('concl') ? (
                              <CheckCircle2 size={14} className="text-green-600" />
                            ) : (
                              <Clock3 size={14} className="text-yellow-600" />
                            )}
                            <span className="capitalize">{p.status}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </HideableCard>
      </div>
    </section>
  );
};

export default LifeProjects; 