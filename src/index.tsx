import { useState } from 'react';
import RecuperarSenha from './pages/recuperar_senha';
import NovaSenha from './pages/recuperar_senha/novasenha';

function App() {
  const [page, setPage] = useState<'recuperar' | 'novasenha'>('recuperar');

  return (
    <>
      {page === 'recuperar' ? (
        <RecuperarSenha onSuccess={() => setPage('novasenha')} />
      ) : (
        <NovaSenha />
      )}
    </>
  );
}

export default App;
