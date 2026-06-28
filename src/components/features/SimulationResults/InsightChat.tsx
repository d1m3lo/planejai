import { useSimulationStorage } from '@/hooks/useSimulationStorage';
import { askQuestion } from '@/services/aiService';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { SimulationRecord } from '@/data/simulation';

interface InsightChatProps {
  simulationId: string;
}

export function InsightChat({ simulationId }: InsightChatProps) {
  const { getFormData, updateSimulation } = useSimulationStorage();
  const simulation = getFormData(simulationId) as SimulationRecord;

  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>(
    simulation?.messages || []
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !simulation) return;

    const userText = input.trim();
    const newMessages = [...messages, { role: 'user' as const, text: userText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Save user message immediately
    updateSimulation(simulationId, { ...simulation, messages: newMessages });

    try {
      const simulationContext = `Renda: ${simulation.income}, Custos: ${simulation.expenses}, Dívidas: ${simulation.debts}, Meta: ${simulation.goalName}, Custo: ${simulation.goalAmount}, Prazo: ${simulation.goalDeadline} meses`;
      const reply = await askQuestion(userText, messages, simulationContext);
      const finalMessages = [...newMessages, { role: 'model' as const, text: reply }];
      setMessages(finalMessages);
      updateSimulation(simulationId, { ...simulation, messages: finalMessages });
    } catch (err) {
      setError('Erro ao enviar mensagem. Tente novamente.');
      // Revert user message locally on failure? Or just show error.
      // Assuming we keep the user message, so they can retry typing it or we just show error below it.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col rounded-xl border border-(--border) bg-background/50">
      <div className="border-b border-(--border) p-4">
        <h3 className="text-sm font-semibold">Ficou com alguma dúvida?</h3>
        <p className="text-muted-foreground text-xs">Pergunte ao seu educador financeiro</p>
      </div>

      <div className="flex max-h-80 flex-col gap-4 overflow-y-auto p-4">
        {messages.length === 0 && !isLoading && (
          <p className="text-muted-foreground text-center text-sm">
            Nenhuma mensagem ainda. Envie sua primeira pergunta!
          </p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex w-max max-w-[85%] flex-col rounded-lg px-4 py-2 text-sm ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground self-end'
                : 'bg-muted text-foreground self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="bg-muted text-foreground self-start flex w-max max-w-[85%] items-center gap-2 rounded-lg px-4 py-2 text-sm">
            <Loader2 className="animate-spin" size={16} />
            <span>Educador digitando...</span>
          </div>
        )}
        {error && (
          <p className="text-destructive text-center text-xs">{error}</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-(--border) p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta aqui..."
            className="flex-1 rounded-lg border border-(--border) bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-primary text-primary-foreground disabled:bg-primary/50 flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-primary/90"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
