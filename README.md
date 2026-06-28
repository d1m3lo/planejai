# Planej.ai - Educador Financeiro Inteligente

O **Planej.ai** é uma aplicação web inteligente, criada com React, TypeScript e IA Generativa (Google Gemini), cujo objetivo principal é funcionar como um Educador Financeiro Inteligente. A aplicação é capaz de receber informações detalhadas de uma simulação financeira (renda, custos, dívidas, e metas) e gerar insights personalizados, compreensíveis e encorajadores para o usuário, facilitando o planejamento de vida e atingimento de metas.

---

## O que o projeto faz?

O projeto recebe os dados financeiros do usuário (renda bruta, custos fixos, dívidas) e o seu objetivo (meta, custo, prazo). A partir dessas informações, ele faz o cálculo da viabilidade, e com a ajuda da Inteligência Artificial (Gemini), constrói um "Diagnóstico Financeiro", avaliando o percentual de comprometimento da renda, sugerindo cortes de gastos, ideias para renda extra, recomendações de investimentos e mensagens motivacionais adaptadas àquela meta específica.

## Como executar a aplicação?

Siga os passos abaixo para rodar o projeto localmente:

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd planejai
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a variável de ambiente:**
   - Renomeie o arquivo `.env.local.example` para `.env.local` (ou simplesmente crie um `.env.local`).
   - Adicione sua chave de API do Gemini:
     ```env
     VITE_GEMINI_API_KEY=sua_chave_aqui
     ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador:**
   - O projeto estará disponível em `http://localhost:5173`.

## Quais tecnologias foram usadas?

*   **React (v19)** - Biblioteca principal para criação da interface.
*   **TypeScript** - Para segurança e inferência de tipos.
*   **Vite** - Bundler e servidor de desenvolvimento ultra-rápido.
*   **Tailwind CSS (v4)** - Framework para estilização utilizando utilitários, garantindo responsividade e personalização do tema.
*   **React Router Dom** - Gerenciamento de rotas e navegação.
*   **Lucide React** - Biblioteca de ícones moderna.
*   **Google Gemini API (@google/generative-ai / requisições manuais)** - A IA responsável por analisar e devolver o Diagnóstico Financeiro Inteligente.

## Qual melhoria você implementou?

Foi implementado com sucesso um conjunto de melhorias propostas para expandir os recursos da plataforma:

1.  **Página de Histórico de Simulações (Desafio 1):**
    *   Criação de uma tela responsiva que exibe o resumo de cada simulação salva no `localStorage`.
    *   Opção de **Excluir** uma simulação diretamente do histórico.
    *   Opção de **Ver detalhes**, onde o usuário pode revisitar a página de resultados, trazendo o estado anterior de sua simulação com os insights já gerados.

2.  **Chat com o Educador Financeiro (Desafio 2):**
    *   Inclusão de um novo campo de texto interativo dentro do componente de Inteligência Artificial (`AIInsightCard`).
    *   Funcionalidade de conversa fluída onde o usuário pode fazer quantas perguntas quiser relacionadas à sua simulação atual.
    *   A IA compreende o contexto dos dados da simulação e do histórico da conversa.
    *   Auto-scroll embutido ao receber a resposta.
    *   Feedback de carregamento amigável e tratamento de erros visuais.
    *   Todo o histórico de perguntas e respostas é exibido na tela e persistido no `localStorage` sob a respectiva simulação.

## Como testar o fluxo principal?

1. Na tela inicial (**Nova Simulação**), preencha todos os passos do formulário (renda, custos fixos, dívidas e os detalhes do seu sonho) e clique no botão final de **"Gerar simulação"**.
2. Aguarde a tela de resultados carregar o insight da inteligência artificial no card de destaque.
3. Role até o fim do card de insight e faça uma pergunta, por exemplo: *"Onde posso guardar meu dinheiro de forma segura para esse sonho?"*.
4. O balão de *loading* aparecerá, seguido da resposta detalhada da IA. Teste fazer perguntas seguidas.
5. Acesse o **Histórico** pelo botão do cabeçalho. Confirme se a simulação que você acabou de criar aparece listada.
6. Volte clicando em **Ver detalhes**, a simulação vai ser carregada instantaneamente, e todo o chat com a Inteligência Artificial anterior estará salvo.

## O que você aprendeu durante o desafio?

Durante este projeto, o aprendizado focou intensamente no **manejo de diversos tipos de packages**, entendendo profundamente como conectar bibliotecas modernas como React Router, TailwindCSS v4 (que conta com uma configuração e otimização diferenciadas do Vite) de maneira orgânica.

Um ponto fortíssimo foi a **estruturação e manipulação de pastas**. Trabalhar dividindo recursos em `pages`, `features`, `context`, `services` e `hooks` demonstrou claramente a melhor forma de se separar as regras de negócios da camada de apresentação (View). Aprender qual uso aplicar a cada caso facilita imensamente a escalabilidade. O isolamento do _localStorage_ e das chamadas da API do Google Gemini em _Custom Hooks_ e Services limpos evitaram a poluição excessiva dos componentes visuais.

Também aprimorei meus conhecimentos no uso intensivo do **TailwindCSS**, garantindo um Design System coeso, sem repetições extremas e permitindo uma alternância robusta e moderna de modo Claro/Escuro (Light/Dark themes). Além disso, entender o gerenciamento do estado ao combinar o contexto inicial para uma Inteligência Artificial generativa com o estado conversacional posterior forneceu uma visão incrível da criação de produtos orientados a AI.
