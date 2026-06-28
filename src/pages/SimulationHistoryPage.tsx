import { PageHero } from '@/components/shared/PageHero';
import { useSimulationStorage } from '@/hooks/useSimulationStorage';
import { Trash2, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SimulationRecord } from '@/data/simulation';
import { Button } from '@/components/shared/Button';

export function SimulationHistoryPage() {
  const { getAllSimulations, deleteSimulation } = useSimulationStorage();
  const [simulations, setSimulations] = useState<SimulationRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSimulations(getAllSimulations().reverse());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta simulação?')) {
      deleteSimulation(id);
      setSimulations(getAllSimulations().reverse());
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de Simulações"
        subtitle="Aqui você encontra todas as simulações que já realizou."
      />

      {simulations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <TrendingUp className="text-muted-foreground mb-4 h-16 w-16 opacity-50" />
          <h2 className="mb-2 text-xl font-bold">Nenhuma simulação encontrada</h2>
          <p className="text-muted-foreground mb-6">
            Você ainda não fez nenhuma simulação financeira. Que tal começar agora?
          </p>
          <Button variant="primary" onClick={() => void navigate('/')}>Fazer nova simulação</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {simulations.map((sim) => (
            <div
              key={sim.id}
              className="bg-card border-border flex flex-col justify-between rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div>
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-lg font-bold line-clamp-1" title={sim.goalName}>
                    {sim.goalName}
                  </h3>
                  <button
                    onClick={() => handleDelete(sim.id)}
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                    aria-label="Excluir simulação"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="text-muted-foreground mb-4 space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Custo:</span> {sim.goalAmount}
                  </p>
                  <p>
                    <span className="font-medium">Prazo:</span> {sim.goalDeadline} meses
                  </p>
                  <p>
                    <span className="font-medium">Data:</span>{' '}
                    {sim.createdAt
                      ? new Date(sim.createdAt).toLocaleDateString('pt-BR')
                      : 'Data desconhecida'}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                className="w-full justify-center"
                onClick={() => void navigate(`/resultado/${sim.id}`)}
              >
                Ver detalhes
              </Button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
