import { PiggyBank } from 'lucide-react';
import { createBrowserRouter } from 'react-router-dom';
import { Button } from './components/shared/Button';

export const router = createBrowserRouter([
  {
    children: [
      {
        path: '/',
        element: (
          <>
            <h1>Formulário de simulação</h1>
            <Button variant="primary" icon={PiggyBank}>
              Clique aqui
            </Button>
          </>
        ),
      },
      {
        path: '/resultado',
        element: <h1>Resultado da simulação</h1>,
      },
      {
        path: '/historico',
        element: <h1>Histórico de simulações</h1>,
      },
    ],
  },
]);
