import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Cadastro from './pages/cadastro';
import RecuperarSenha from './pages/recuperar_senha';
import QuemSomos from './pages/quem_somos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
