import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: (
          <>
            <h1>Formulário de simulação</h1>
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
