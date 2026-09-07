import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Cadastro from './pages/cadastro';
import RecuperarSenha from './pages/recuperar_senha';
import Main from './pages/main';
import Admin from './pages/admin';
import Perfil from './pages/perfil';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/main" element={<Main />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
