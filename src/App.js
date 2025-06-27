import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ModalProvider } from './contexts/ModalContext';
import AppRoutes from './routes/Routes';

function App() {
  return (
    <Router>
      <ModalProvider>
        <AppRoutes />
      </ModalProvider>
    </Router>
  );
}

export default App;