import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Cadastro from './pages/cadastro';
import RecuperarSenha from './pages/recuperar_senha';
import Main from './pages/main';
import Admin from './pages/admin';
<<<<<<< HEAD
import VisualizadorGeografico from './pages/visualizador_geografico';
=======
import Perfil from './pages/perfil';
import SearchPol from './pages/searchpol';
import SimuladorUrna from './pages/simulador-urna';
import PaginaPartido from './pages/pagina_partido';
import PaginaPolitico from './pages/pagina_politico';
>>>>>>> 411d6d24e974b8d44632c2d2fe0d2562202e2a24

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/visualizador" element={<VisualizadorGeografico />} />
        <Route path="/main" element={<Main />} />
        <Route path="/admin" element={<Admin />} />
<<<<<<< HEAD
=======
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/searchpol" element={<SearchPol />} />
        <Route path="/main" element={<Main />} />
        <Route path="/simulador-urna" element={<SimuladorUrna />} />
        <Route path="/pagina_partido" element={<PaginaPartido />} />
        <Route path="/pagina_politico" element={<PaginaPolitico />} />
>>>>>>> 411d6d24e974b8d44632c2d2fe0d2562202e2a24
      </Routes>
    </BrowserRouter>
  );
}

export default App;
