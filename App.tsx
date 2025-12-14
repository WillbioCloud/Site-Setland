import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TicketModal } from './components/TicketModal';
import { GeminiAssistant } from './components/GeminiAssistant';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeEffects } from './components/ThemeEffects';
import { ThemeTransition } from './components/ThemeTransition'; // <--- IMPORTAR AQUI
import { Home } from './pages/Home';
import { FullMenu } from './pages/FullMenu';

const AppContent: React.FC = () => {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen text-slate-50 selection:bg-accent selection:text-slate-900 transition-colors duration-500 flex flex-col">
        <ThemeEffects />
        
        {/* Adicione o ThemeTransition aqui, logo antes da Navbar */}
        <ThemeTransition /> 
        
        <Navbar onOpenTickets={() => setIsTicketModalOpen(true)} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onOpenTickets={() => setIsTicketModalOpen(true)} />} />
            <Route path="/cardapio" element={<FullMenu />} />
          </Routes>
        </main>

        <Footer />
        
        <TicketModal 
          isOpen={isTicketModalOpen} 
          onClose={() => setIsTicketModalOpen(false)} 
        />
        
        <GeminiAssistant />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;