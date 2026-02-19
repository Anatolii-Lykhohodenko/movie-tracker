import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Root } from './Root.tsx';
import 'bulma/css/bulma.min.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WatchListProvider } from './contexts/WatchListContext';
import { AuthProvider } from './contexts/AuthContext.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WatchListProvider>
          <Root />
        </WatchListProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
