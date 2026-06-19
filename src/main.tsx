import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './index.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
