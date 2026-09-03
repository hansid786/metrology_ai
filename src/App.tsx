import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';
import { LanguageProvider } from './context/LanguageContext';
import { MetrologyChatBot } from './components/chat/MetrologyChatBot';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppRouter />
        <MetrologyChatBot />
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
