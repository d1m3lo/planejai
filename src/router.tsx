import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    children: [
      {
        path: '/',
        element: <h1>Formulário de simulação</h1>,
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
