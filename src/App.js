import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ModalProvider } from './contexts/ModalContext';
import { PendingStateProvider } from './contexts/PendingStateContext';
import AppRoutes from './routes/Routes';

function App() {
  return (
    <Router>
      <PendingStateProvider>
        <ModalProvider>
          <AppRoutes />
        </ModalProvider>
      </PendingStateProvider>
    </Router>
  );
}

export default App;